import { createContext, useContext, useState } from 'react'

const PresetContext = createContext()

export const usePreset = () => useContext(PresetContext)

export const PresetProvider = ({ children }) => {
  const [selectedService, setSelectedService] = useState(null)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [presetNumber, setPresetNumber] = useState(1)
  const [presetName, setPresetName] = useState('')

  const value = {
    selectedService,
    setSelectedService,
    selectedPreset,
    setSelectedPreset,
    presetNumber,
    setPresetNumber,
    presetName,
    setPresetName
  }

  return <PresetContext.Provider value={value}>{children}</PresetContext.Provider>
}
