import { createContext, useContext, useState } from "react";

const TableContext = createContext();

export const useTable = () => useContext(TableContext);

export const TableProvider = ({ children }) => {
    const [version, setVersion] = useState('')
    const value = {
        version,
        setVersion
    };

    return (
        <TableContext.Provider value={value}>{children}</TableContext.Provider>
    );
};