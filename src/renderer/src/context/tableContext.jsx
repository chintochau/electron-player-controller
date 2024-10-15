import { createContext, useContext, useState } from 'react'

const TableContext = createContext()

export const useTable = () => useContext(TableContext)

export const TableProvider = ({ children }) => {
  const [version, setVersion] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showPreset, setShowPreset] = useState(false)

  const value = {
    version,
    setVersion,
    isCollapsed,
    setIsCollapsed,
    showPreset,
    setShowPreset
  }

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}
