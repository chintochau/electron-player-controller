import { createContext, useContext, useEffect, useState } from "react";
import { useRefresh } from "./refreshContext";
import { useStorage } from "./localStorageContext";

const DevicesContext = createContext();

export const useDevices = () => useContext(DevicesContext);

export const DevicesProvider = ({ children }) => {
    const [devices, setDevices] = useState([])
    const [selectedDevices, setSelectedDevices] = useState([]) // ips of selected devices
    const { refreshTime } = useRefresh();
    const { checkRoomForMac } = useStorage();

    const updateDeviceStatus = (ip, status) => {
        setDevices((prevDevices) => {
            // Create a new array by mapping over the previous state
            return prevDevices.map((prevDevice) => {
                if (status === null) {
                    // If status is null, remove the status only when lastSynced is more than 5 seconds
                    if (new Date() - prevDevice.lastSynced > 5000) {
                        return { 
                            ...prevDevice, 
                            status: null, 
                            lastSynced: new Date() }
                    } else {
                        return prevDevice
                    }

                } else if (prevDevice.ip === ip) {
                    // Return a new object with updated values
                    return {
                        ...prevDevice,
                        status,
                        lastSynced: new Date()
                    }
                }
                return prevDevice // No changes, return the device as is
            })
        })
    }
    const setDeviceGroupingStatus = (ip, status) => {
        const { isMaster, isSlave, master, slave } = status;

        setDevices((prevDevices) => {
            // Create a new array by mapping over the previous state
            return prevDevices.map((device) => {
                if (device.ip === ip) {
                    // Return a new object with updated values
                    return {
                        ...device,
                        isMaster,
                        isSlave,
                        master,
                        slave
                    };
                }
                return device; // No changes, return the device as is
            });
        });
    };

    const searchDeviceByIp = (ip) => {
        return devices.find((device) => device.ip === ip);
    };

    const selectAllDevices = () => {
        setSelectedDevices(devices.map((device) => device.ip));
    };

    const removeSelectedDeviceByIp = (ip) => {
        setSelectedDevices(selectedDevices.filter((selectedIp) => selectedIp !== ip));
    };

    const removeAllSelectedDevices = () => {
        setSelectedDevices([]);
    };

    const selectDeviceByIp = (ip) => {
        if (selectedDevices.includes(ip)) {
            setSelectedDevices(selectedDevices.filter((selectedIp) => selectedIp !== ip));
        } else {
            setSelectedDevices([...selectedDevices, ip]);
        }
    }

    const sortAndSaveDevicesList = (devices) => {
        // sort by room, and then by name
        devices.sort((a, b) => {
            if (a.room < b.room) return -1
            if (a.room > b.room) return 1
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
        })
        setDevices(devices)
        return devices
    }

    async function initialDiscoverDevices() {
        const discoveredDevices = await window.api.discoverDevices()
        let devicesList = []
        for (const device of discoveredDevices) {
            const { name, txt, addresses, referer } = device
            const ip = referer.address

            const room = checkRoomForMac(txt.mac)

            devicesList.push({
                name,
                ip,
                mac: txt.mac,
                model: txt.model,
                version: txt.version,
                room,
                lastUpdated: new Date(),
            })
        }
        setDevices(devicesList)
        return devicesList
    }

    const updateDevices = async () => {
        const discoveredDevices = await window.api.discoverDevices()
        const devicesList = discoveredDevices.map((device) => {
            const { name, txt, addresses, referer } = device
            const ip = referer.address
            const room = checkRoomForMac(txt.mac)
            return {
                name,
                ip,
                mac: txt.mac,
                model: txt.model,
                version: txt.version,
                room,
                lastUpdated: new Date(),
            }
        })
        setDevices((prevDevices) => {
            // compare the new devices list with the previous devices list
            // 1. remove devices that are disconnected for more than 30 seconds
            // 2. add new devices
            // 3. update the device version
            // 4. update lastUpdated timestamp

            // compare updated list and existing list, remove device in existing list that are not in updated list and disconnected for 30 seconds
            const newDevices = prevDevices.map((prevDevice) => {
                const device = devicesList.find((device) => device.mac === prevDevice.mac)
                if (!device) {
                    // if the device is not in the updated list, check if the device is disconnected for more than 90 seconds
                    if (new Date() - prevDevice.lastUpdated > 90000) {
                        // if the device is disconnected for more than 30 seconds, remove it
                        return null
                    } else {
                        // if the device is not disconnected for more than 30 seconds, keep it
                        return prevDevice
                    }
                } else {
                    // if the device is in the updated list, update the lastUpdated timestamp, version, 
                    return {
                        ...prevDevice,
                        lastUpdated: new Date(),
                        version: device.version
                    }
                }
            })

            // add new devices
            newDevices.push(...devicesList.filter((device) => !prevDevices.find((prevDevice) => prevDevice.mac === device.mac)))
            return newDevices

        })
    }

    const refreshDevices = () => {
        setDevices([])
        initialDiscoverDevices()
    }

    const [count, setCount] = useState(0);

    useEffect(() => {
        let intervalId;
        initialDiscoverDevices();
        // Function to handle phase 1: run every 2 seconds for 3 times
        const startPhaseOne = () => {
            intervalId = setInterval(() => {
                setCount(prevCount => {
                    updateDevices();
                    if (prevCount >= 2) {
                        clearInterval(intervalId);
                        startPhaseTwo();  // Move to phase 2 after 3 runs
                    }
                    return prevCount + 1;
                });
            }, 2000);
        };

        // Function to handle phase 2: run every 15 seconds
        const startPhaseTwo = () => {
            intervalId = setInterval(() => {
                updateDevices();
            }, 15000);
        };

        // Start phase 1 when the component mounts
        startPhaseOne();

        // Cleanup intervals when component unmounts
        return () => clearInterval(intervalId);
    }, []);


    const value = {
        devices,
        setDevices,
        updateDeviceStatus,
        setDeviceGroupingStatus,
        searchDeviceByIp,
        selectedDevices,
        setSelectedDevices,
        selectAllDevices,
        selectDeviceByIp,
        removeSelectedDeviceByIp,
        removeAllSelectedDevices,
        refreshDevices,
    };

    return (
        <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
    );
};