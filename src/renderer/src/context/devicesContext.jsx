import { createContext, useContext, useState } from "react";

const DevicesContext = createContext();

export const useDevices = () => useContext(DevicesContext);

export const DevicesProvider = ({ children }) => {
    const [devices, setDevices] = useState([])

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

    const value = {
        devices,
        setDevices,
        updateDeviceStatus
    };

    return (
        <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
    );
};