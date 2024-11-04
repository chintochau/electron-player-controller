import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useStorage } from './localStorageContext'
import { playerControl, runCommandForDevice } from '../lib/utils'
import { useDevices } from './devicesContext'
import { toast } from '@/hooks/use-toast'

const SetupContext = createContext()

export const useSetup = () => useContext(SetupContext)

export const SetupProvider = ({ children }) => {
    const [needSetupDevices, setNeedSetupDevices] = useState([])
    const [additionalDevices, setAdditionalDevices] = useState([])
    const [selectedWifi, setSelectedWifi] = useState('')
    const [wifiPassword, setWifiPassword] = useState('')
    const [setupMatrix, setSetupMatrix] = useState([]) // [{name:"alpha IQ", version:"1.0.0", ip:"237.84.2.178", mac:"00:00:00:00:00:00", isConnected: true, isInitialized: true, isRebooted: false, isFinished: false}, ]
    const [inProgress, setInProgress] = useState(false)
    const [currentConnectedWifi, setCurrentConnectedWifi] = useState(null)
    const [bluosDevicesList, setBluosDevicesList] = useState([])


    const wifiRef = useRef(null)


    useEffect(() => {
        const wifiAndPasswordIsFilled = selectedWifi && wifiPassword && selectedWifi.length > 0 && wifiPassword.length > 0
        if (!inProgress) return
        setTimeout(() => {
            discoverDevices((devicesList) => {
                console.log(devicesList);
                if (inProgress && wifiAndPasswordIsFilled) {
                    runPlayersSetupProcess(devicesList)
                } else if (inProgress && !wifiAndPasswordIsFilled) {
                    toast({
                        title: 'Error',
                        description: 'Please fill in the wifi SSID and password',
                        status: 'error'
                    })
                    setInProgress(false)
                }


            })

        }, 2000)
    }, [inProgress, setupMatrix])


    const discoverDevices = async (callback) => {
        const discoveredDevices = await window.api.discoverDevices()
        const devicesList = discoveredDevices.map((device) => {
            const { name, txt, addresses, referer } = device
            const ip = referer.address
            return {
                name,
                ip,
                version: txt.version,
                mac: txt.mac,
            }
        })
        callback(devicesList)
        return devicesList
    }

    const checkCurrentConnectedWifi = async () => {
        const wifi = await window.api.getCurrentWifi()
        setCurrentConnectedWifi(wifi)
        wifiRef.current = wifi
    }

    useEffect(() => {
        // checkCurrentConnectedWifi()
        // check every 3 seconds
        const intervalId = setInterval(() => {
            checkCurrentConnectedWifi()
        }, 3000)
        return () => clearInterval(intervalId)
    }, [])


    const rebootDevice = (ip) => {
        playerControl(ip, 'reboot', null)
    }

    const initializeDevice = (ip) => {
        runCommandForDevice(ip, ":11000/SetInitialized?init=1", 'GET')
    }

    const connectDeviceToSelectedWifi = async () => {
        //http://10.0.0.107/wifiapi?ssid=Jason&type=WPA2&key=00012345
        try {
            const res = await runCommandForDevice("10.1.2.3", `/wifiapi?ssid=${selectedWifi}&type=WPA2&key=${wifiPassword}`, 'GET')
            const parser = new DOMParser()
            const document = parser.parseFromString(res.data, "text/html")
            console.log(document);
            return true
        } catch (error) {
            return false
        }
    }


    const connectToSSID = (ssid, password) => {
        window.api.connectToDeviceThroughWifi(ssid, password)
    }

    const checkWifiAvailableOnPlayer = async () => {
        try {
            const res = await runCommandForDevice("10.1.2.3", "/wificfg", 'GET')
            const parser = new DOMParser()
            const xml = parser.parseFromString(res.data, "text/html")
            const noNetworksOption = xml.querySelector('option');
            if (noNetworksOption && noNetworksOption.textContent === "No networks found.") {
                console.log("No networks found.");
                return false
            } else {
                console.log("Networks found.");
                return true
            }
        } catch (error) {
            console.error(error);
            return false
        }
    }



    const runPlayersSetupProcess = async (discoveredDevices) => {
        // loop through the matrix
        // [{name:"alpha IQ", version:null, ip:null, mac:"00:00:00:00:00:00", isUpgraded: false, isConnected: true, isInitialized: true, isRebooted: false, isFinished: false}, ]

        // TODO: handle apmode, no wifi available
        // TODO: handle wifi setup faile response
        // TODO: idenfity device by mac instead of name

        const getDeviceFromListByName = (name) => {
            const device = discoveredDevices.find((device) => {
                return device.name.replace(" - ", "-") === name
            })
            return device
        }

        // 0: check if all devices are finished or if all are removed
        const allFinished = setupMatrix.every((device) => device.isFinished) || setupMatrix.length === 0
        if (allFinished) {
            setInProgress(false)
            return
        }

        let matrix = setupMatrix.map((device) => {
            if (!device.ip || device.ip === '10.1.2.3') return device
            const thisDevice = getDeviceFromListByName(device.name)
            if (!thisDevice) return device

            if (device.isRebooted) {
                device.isFinished = true
                device.currentStatus = 'Finished'
                deselectDevice(device.name)
            }
            return device
        })

        //1. reboot devices that is already initialized, set finish flag
        matrix = matrix.map((device) => {
            if (!device.ip || device.ip === '10.1.2.3') return device
            const thisDevice = getDeviceFromListByName(device.name)
            if (!thisDevice) return device

            if (device.isInitialized && !device.isRebooted) {
                rebootDevice(device.ip)
                device.isRebooted = true
                device.currentStatus = 'Finalizing'
            }
            return device
        })

        //2. initialize devices that is connected and already upgraded to the latest version
        matrix = matrix.map((device) => {
            if (!device.ip || device.ip === '10.1.2.3') return device

            if (device.isUpgraded && device.isConnected && !device.isInitialized) {
                initializeDevice(device.ip)
                device.isInitialized = true
                device.currentStatus = 'Rebooting'
            }
            return device
        })
        //3. check upgrade for devices that is not upgraded, send the command and update the flag

        matrix = await Promise.all(matrix.map(async (device) => {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 2000)
            if (device.isUpgraded || device.ip === '10.1.2.3' || !device.ip) return device
            try {
                const res = await window.api.checkUpgrade(device.ip, { signal: controller.signal })
                clearTimeout(timeoutId)
                if (res) {
                    if (!res.version && res.available === "false") {
                        // res = {inProgress:false,version: null,available:false}
                        const thisDevice = getDeviceFromListByName(device.name)
                        if (!thisDevice) return device
                        device.isUpgraded = true
                        device.version = thisDevice.version
                        device.ip = thisDevice.ip
                    }
                    if (res.available === "true" && res.version) {
                        // res = {inProgress:false, version 4.6.3, available: true}
                        window.api.playerControl(device.ip, 'upgrade', res.version)
                        device.currentStatus = `Upgrading to ${res.version}`
                    }
                }
            } catch (error) {
                console.log(`Timeout fetching upgrade for device ${device.name}:`);
            } finally {
                clearTimeout(timeoutId)
            }
            return device
        }))

        //4. link devices that is not connected to the selected wifi
        matrix = await Promise.all(matrix.map(async (device) => {
            if (device.shouldRefreshTime && device.shouldRefreshTime > new Date().getTime()) return device

            const thisDevice = getDeviceFromListByName(device.name)
            console.log("thisDevice", thisDevice);
            
            if (thisDevice && thisDevice.ip == "10.1.2.3" && !device.wifiAvailable) {
                const res = await checkWifiAvailableOnPlayer()
                device.wifiAvailable = res
                console.log("res", res);
                if (!res) {
                    playerControl("10.1.2.3", 'reboot', null)
                }
            } else if (!device.wifiAvailable && wifiRef && wifiRef.current && wifiRef.current === device.name) {
                const res = await checkWifiAvailableOnPlayer()
                device.wifiAvailable = res
                console.log("res", res);
                if (!res) {
                    playerControl("10.1.2.3", 'reboot', null)
                }
            } else if (thisDevice && thisDevice.ip !== "10.1.2.3") {
                device.version = thisDevice.version
                device.ip = thisDevice.ip
                if (!device.isConnected) {
                    device.currentStatus = `Connected to ${selectedWifi}`
                }
                device.isConnected = true
            } else if (!device.isConnecting && wifiRef && wifiRef.current && wifiRef.current === device.name) {
                device.currentStatus = `Connecting to ${selectedWifi}`
                const res = await connectDeviceToSelectedWifi()
                if (!res) {
                    return device
                } else {
                    device.isConnecting = true
                    connectToSSID(selectedWifi, wifiPassword)

                }
            } else if (!device.isConnecting && thisDevice && thisDevice.ip === "10.1.2.3") {
                device.curretStatus = `Connecting to ${selectedWifi}`
                const res = await connectDeviceToSelectedWifi()
                if (!res) {
                    return device
                } else {
                    device.isConnecting = true
                    connectToSSID(selectedWifi, wifiPassword)
                }
            }
            return device
        }))


        // 5. connect to the next device that is not connected
        const device = matrix.find((device) => !device.isConnected && !device.isConnecting)
        if (device) {
            connectToSSID(device.name)
        } else if (wifiRef && !wifiRef.current) {
            connectToSSID(selectedWifi, wifiPassword)
        }

        // 6. add additional devices
        const additionalMatrixItems = additionalDevices.map((device) => createMatrixItem(device))
        console.log("additionalMatrixItems", additionalMatrixItems);

        matrix = [...matrix, ...additionalMatrixItems]
        setSetupMatrix(matrix)
    }

    const addToAdditionalDevices = (device) => {
        setAdditionalDevices((prev) => {
            return [...prev, device]
        })
    }


    const createMatrixItem = (device) => {
        return {
            name: device,
            mac: null,
            version: null,
            shouldRefreshTime: null,
            ip: null,
            wifiAvailable: false,
            isConnecting: false,
            isConnected: false,
            isInitialized: false,
            isRebooted: false,
            isUpgraded: false,
            isFinished: false,
            currentStatus: "Waiting for connection",
        }
    }


    const createMatrixAndStart = () => {
        setSetupMatrix(
            needSetupDevices.map((device) => createMatrixItem(device))
        )
        setInProgress(true)
    }

    const removeItemFromMatrix = (deviceSSID) => {
        setSetupMatrix((prev) => {
            return prev.filter((item) => item.name !== deviceSSID)
        })
    }

    const selectDevice = (device) => {
        setNeedSetupDevices((prev) => {
            return [...prev, device]
        })
    }
    const deselectDevice = (device) => {
        setNeedSetupDevices((prev) => {
            return prev.filter((item) => item !== device)
        })
    }
    const isDeviceSelected = (device) => {
        return needSetupDevices.includes(device)
    }

    const value = {
        needSetupDevices,
        setNeedSetupDevices,
        selectedWifi,
        setSelectedWifi,
        wifiPassword,
        setWifiPassword,
        setupMatrix,
        setSetupMatrix,
        createMatrixAndStart,
        selectDevice,
        deselectDevice,
        inProgress,
        setInProgress,
        isDeviceSelected,
        currentConnectedWifi,
        addToAdditionalDevices,
        removeItemFromMatrix,
        bluosDevicesList, setBluosDevicesList
    }

    return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>
}
