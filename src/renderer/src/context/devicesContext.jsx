import { createContext, useContext, useState } from "react";

const DevicesContext = createContext();

export const useDevices = () => useContext(DevicesContext);

export const DevicesProvider = ({ children }) => {
    const [devices, setDevices] = useState([])

    const value = {
        devices,
        setDevices
    };

    return (
        <DevicesContext.Provider value={value}>{children}</DevicesContext.Provider>
    );
};