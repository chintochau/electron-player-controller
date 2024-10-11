import { createContext, useContext, useState } from "react";

const DevicesContext = createContext();

export const useDevices = () => useContext(DevicesContext);

export const DevicesProvider = ({ children }) => {
    const [devices, setDevices] = useState([])
    const [selectedDevices, setSelectedDevices] = useState([]) // ips of selected devices

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
        removeAllSelectedDevices
    };

    return (
        <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
    );
};