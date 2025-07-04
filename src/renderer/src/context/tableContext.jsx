import { createContext, useContext, useState } from 'react'
import { useStorage } from './localStorageContext'

const TableContext = createContext()

export const useTable = () => useContext(TableContext)

export const TableProvider = ({ children }) => {
  const [version, setVersion] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showPreset, setShowPreset] = useState(false)
  const { togglePresetVisibility, isPresetVisible } = useStorage()
  const [isGridMode, setIsGridMode] = useState()

  const value = {
    version,
    setVersion,
    isCollapsed,
    setIsCollapsed,
    showPreset: isPresetVisible || showPreset,
    setShowPreset: togglePresetVisibility,
    togglePresetVisibility,
    isPresetVisible,
    isGridMode,
    setIsGridMode
  }

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}
