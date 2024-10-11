import { createContext, useContext, useEffect, useState } from "react";
import { useRefresh } from "./refreshContext";
import { useStorage } from "./localStorageContext";

const DevicesContext = createContext();

export const useDevices = () => useContext(DevicesContext);

export const DevicesProvider = ({ children }) => {
    const [devices, setDevices] = useState([])
    const [selectedDevices, setSelectedDevices] = useState([]) // ips of selected devices
    const {refreshTime} = useRefresh();
    const {checkRoomForMac} = useStorage();

    const updateDeviceStatus = (ip, status) => {
        setDevices((prevDevices) => {
            // Create a new array by mapping over the previous state
            return prevDevices.map((prevDevice) => {
                if (prevDevice.ip === ip) {
                    // Return a new object with updated values
                    return {
                        ...prevDevice,
                        status
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

    async function fetchDevices() {
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
            })
        }

        devicesList = sortAndSaveDevicesList(devicesList)
        return devicesList
    }

    const refreshDevices = () => {
        setDevices([])
        fetchDevices()
    }

    useEffect(() => {
        fetchDevices()
        // const interval = setInterval(() => {
        //   fetchDevices();
        // }, refreshTime * 1000);
        // return () => clearInterval(interval);
      }, [refreshTime])

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