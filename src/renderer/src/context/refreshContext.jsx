import { createContext, useContext, useState } from "react";

const RefreshContext = createContext();

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }) => {
const [refreshTime, setRefreshTime] = useState(2)
const [shouldRefresh, setShouldRefresh] = useState(true)
  const value = {
    refreshTime,
    setRefreshTime,
    shouldRefresh,
    setShouldRefresh
  };

  return (
    <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>
  );
};