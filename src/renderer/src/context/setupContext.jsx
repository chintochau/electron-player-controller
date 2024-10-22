import { createContext, useContext, useEffect, useState } from 'react'
import { useStorage } from './localStorageContext'

const SetupContext = createContext()

export const useSetup = () => useContext(SetupContext)

export const SetupProvider = ({ children }) => {
    const { } = useStorage()
    const [needSetupDevices, setNeedSetupDevices] = useState([])
    const [selectedWifi, setSelectedWifi] = useState('')
    const [wifiPassword, setWifiPassword] = useState('')
    const [setupMatrix, setSetupMatrix] = useState([]) // [{name:"alpha IQ", version:"1.0.0", ip:"237.84.2.178", mac:"00:00:00:00:00:00", isConnected: true, isInitialized: true, isRebooted: false, isFinished: false}, ]
    const [inProgress, setInProgress] = useState(false)

    useEffect(() => {
        if (inProgress) {
            // run process every 2 seconds
            const intervalId = setInterval(() => {
                runPlayersSetupProcess()
            }, 2000)
            return () => clearInterval(intervalId)
        }
    }, [inProgress, setupMatrix])

    const runPlayersSetupProcess = () => {

        // loop through the matrix
        // [{name:"alpha IQ", version:"1.0.0", ip:"237.84.2.178", mac:"00:00:00:00:00:00", isConnected: true, isInitialized: true, isRebooted: false, isFinished: false}, ]

        //0. reboot devices that is already initialized, set finish flag
        let matrix = setupMatrix.forEach((device) => {
            if (!device.ip) return
            if (device.isInitialized && !device.isRebooted) {
                playerControl(device.ip, 'reboot', null)
                device.isRebooted = true
            }
        })
        //1. initialize devices that is connected and already upgraded to the latest version
        matrix = matrix.forEach((device) => {
            if (!device.ip) return
            if (device.isConnected && !device.isInitialized) {

                device.isInitialized = true
            }
        })
        //2. check upgrade for devices that is not upgraded, send the command and update the flag

        matrix = matrix.forEach(async (device) => {

            const res = await window.api.checkUpgrade(ip)
            // res = {inProgress:false,version: null,available:false}
            // res = {inProgress:false, version 4.6.3, available: true}
            // res = null (timeout)
            if (res && res.available === "true") {
                
            }
        })
        //3. connect devices that is not connected

    }


    const createMatrixAndStart = () => {
        setSetupMatrix(
            needSetupDevices.map((device) => {
                return (
                    {
                        name: device,
                        version: null,
                        ip: null,
                        mac: null,
                        isConnected: false,
                        isInitialized: false
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
    }

    return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>
}
