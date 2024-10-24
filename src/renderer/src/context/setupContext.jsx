import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useStorage } from './localStorageContext'
import { playerControl, runCommandForDevice } from '../lib/utils'
import { useDevices } from './devicesContext'
import { toast } from '@/hooks/use-toast'

const SetupContext = createContext()

export const useSetup = () => useContext(SetupContext)

export const SetupProvider = ({ children }) => {
    const [needSetupDevices, setNeedSetupDevices] = useState([])
    const [selectedWifi, setSelectedWifi] = useState('')
    const [wifiPassword, setWifiPassword] = useState('')
    const [setupMatrix, setSetupMatrix] = useState([]) // [{name:"alpha IQ", version:"1.0.0", ip:"237.84.2.178", mac:"00:00:00:00:00:00", isConnected: true, isInitialized: true, isRebooted: false, isFinished: false}, ]
    const [inProgress, setInProgress] = useState(false)
    const [currentConnectedWifi, setCurrentConnectedWifi] = useState(null)


    useEffect(() => {
        const wifiAndPasswordIsFilled = selectedWifi && wifiPassword && selectedWifi.length > 0 && wifiPassword.length > 0
        discoverDevices((devicesList) => {
            console.log('devicesList', devicesList);
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
    }, [inProgress, setupMatrix])


    const discoverDevices = async (callback) => {
        const discoveredDevices = await window.api.discoverDevices()
        const devicesList = discoveredDevices.map((device) => {
            const { name, txt, addresses, referer } = device
            const ip = referer.address
            return {
                name,
                ip,
                mac: txt.mac,
                model: txt.model,
                version: txt.version,
            }
        })
        callback(devicesList)
        return devicesList
    }

    const checkCurrentConnectedWifi = async () => {
        const wifi = await window.api.getCurrentWifi()
        setCurrentConnectedWifi(wifi)
    }

    useEffect(() => {
        // checkCurrentConnectedWifi()
        // check every 3 seconds
        const intervalId = setInterval(() => {
            checkCurrentConnectedWifi()
        }, 3000)
        return () => clearInterval(intervalId)
    }, [])

    const isBluOSDevice = (ssid) => {
        if (ssid.split('-').length > 1 && ssid.split('-').length < 3 && ssid.split('-')[1].length === 4) {
            return true
        } else {
            return false
        }
    }

    const rebootDevice = (ip) => {
        playerControl(ip, 'reboot', null)
    }

    const initializeDevice = (ip) => {
        runCommandForDevice(ip, ":11000/SetInitialized?init=1", 'GET')
    }

    const connectDeviceToSelectedWifi = () => {
        //http://10.0.0.107/wifiapi?ssid=Jason&type=WPA2&key=00012345
        runCommandForDevice("10.1.2.3", `/wifiapi?ssid=${selectedWifi}&type=WPA2&key=${wifiPassword}`, 'GET')
    }

    const connectToSSID = (ssid, password) => {
        window.api.connectToDeviceThroughWifi(ssid, password)
    }



    const runPlayersSetupProcess = async (discoveredDevices) => {
        // loop through the matrix
        // [{name:"alpha IQ", version:null, ip:null, mac:"00:00:00:00:00:00", isUpgraded: false, isConnected: true, isInitialized: true, isRebooted: false, isFinished: false}, ]

        const getDeviceFromListByName = (name) => {
            const device = discoveredDevices.find((device) => {
                return device.name.replace(" - ", "-") === name
            })
            return device
        }

        // -1: check if all devices are finished
        const allFinished = setupMatrix.every((device) => device.isFinished)
        if (allFinished) {
            setInProgress(false)
            return
        }

        let matrix = setupMatrix.map((device) => {
            if (!device.ip) return device
            const thisDevice = getDeviceFromListByName(device.name)
            if (!thisDevice) return device

            if (device.isRebooted) {
                device.isFinished = true
                device.currentStatus = 'Finished'
            }
            return device
        })

        //0. reboot devices that is already initialized, set finish flag
        matrix = matrix.map((device) => {
            if (!device.ip) return device
            const thisDevice = getDeviceFromListByName(device.name)
            if (!thisDevice) return device

            if (device.isInitialized && !device.isRebooted) {
                rebootDevice(device.ip)
                device.isRebooted = true
                device.currentStatus = 'Finalizing'
            }
            return device
        })

        //1. initialize devices that is connected and already upgraded to the latest version
        matrix = matrix.map((device) => {
            if (!device.ip) return device

            if (device.isUpgraded && device.isConnected && !device.isInitialized) {
                initializeDevice(device.ip)
                device.isInitialized = true
                device.currentStatus = 'Rebooting'
            }
            return device
        })
        //2. check upgrade for devices that is not upgraded, send the command and update the flag

        matrix = await Promise.all(matrix.map(async (device) => {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 2000)
            if (device.isUpgraded) return device
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

        //3. link devices that is not connected to the selected wifi
        matrix = matrix.map((device) => {
            const thisDevice = getDeviceFromListByName(device.name)
            if (thisDevice && thisDevice.ip !== "10.1.2.3") {
                device.version = thisDevice.version
                device.ip = thisDevice.ip
                if (!device.isConnected) {
                    device.currentStatus = `Connected to ${selectedWifi}`
                }
                device.isConnected = true
            } else if (currentConnectedWifi && currentConnectedWifi === device.name && !device.isConnecting) {
                device.currentStatus = `Connecting to ${selectedWifi}`
                connectDeviceToSelectedWifi()
                device.isConnecting = true
            }
            return device
        })

        // 4. connect to the next device that is not connected
        const device = matrix.find((device) => !device.isConnected && !device.isConnecting)
        if (device) {
            connectToSSID(device.name)
        } else if (!currentConnectedWifi) {
            connectToSSID(selectedWifi, wifiPassword)
        }
        setSetupMatrix(matrix)
    }


    const createMatrixAndStart = () => {
        setSetupMatrix(
            needSetupDevices.map((device) => {
                return (
                    {
                        name: device,
                        version: null,
                        ip: null,
                        isConnecting: false,
                        isConnected: false,
                        isInitialized: false,
                        isRebooted: false,
                        isUpgraded: false,
                        isFinished: false,
                        currentStatus: "Waiting for connection",
                    }
                )
            })
        )
        setInProgress(true)
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
        currentConnectedWifi
    }

    return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>
}
