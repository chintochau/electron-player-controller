import React, { useEffect, useState } from 'react'
import { useBrowsing } from '../context/browsingContext'
import { useSdui } from '../context/sduiContext'
import { playerControl, runCommandForDevice } from '../lib/utils'
import noArtwork from '../assets/noartwork.png'
import { renderComponent } from './BrowseView/GUI'
import { Plus } from 'lucide-react'
import { useDevices } from '../context/devicesContext'

const PresetsBar = ({ ip }) => {
  const [presets, setPresets] = useState([])
  const { setIsAddpresetPageShown, isAddpresetPageShown } = useSdui()
  const { setSelectedPlayer } = useBrowsing()
  const { devices } = useDevices()

  const loadPresets = async () => {
    const res = await window.api.loadSDUIPage(`http://${ip}:11000/Presets`)
    if (res && res.json && res.json.presets) {
      setPresets(res.json.presets.preset)
    }
  }

  const getImagePath = (uri) => {
    if (!uri) return noArtwork
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return uri
    } else {
      if (uri.startsWith('/images')) {
      }
    }
    return `http://${ip}:11000${uri}`
  }

  useEffect(() => {
    loadPresets()
  }, [])
  
  // Reload presets when the add preset dialog is closed
  useEffect(() => {
    if (!isAddpresetPageShown) {
      loadPresets()
    }
  }, [isAddpresetPageShown])

  return (
    <div className="flex justify-end items-center gap-2 mt-2">
      <div className="flex items-center gap-1.5 bg-muted/30 rounded-full p-1">
        {presets && presets.slice(0, 6).map((preset) => (
          <div
            key={preset.$.id}
            className="relative group cursor-pointer"
            onClick={() => {
              runCommandForDevice(ip, `:11000/Preset?id=${preset.$.id}`, 'GET')
            }}
            title={preset.$.name}
          >
            <div className="size-8 rounded-full overflow-hidden ring-1 ring-border/50 transition-all duration-200 group-hover:ring-2 group-hover:ring-primary group-hover:scale-110 group-active:scale-95">
              <img
                className="w-full h-full object-cover"
                alt={preset.$.name}
                src={getImagePath(preset.$.image)}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = noArtwork
                }}
              />
            </div>
            <div className="absolute -top-1 -right-1 size-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ))}
        
        {/* Add Preset Button */}
        <div
          className="relative group cursor-pointer"
          onClick={() => {
            const currentDevice = devices.find(device => device.ip === ip)
            if (currentDevice) {
              setSelectedPlayer(currentDevice)
            }
            setIsAddpresetPageShown(true)
          }}
          title="Add Preset"
        >
          <div className="size-8 rounded-full flex items-center justify-center bg-background border border-dashed border-muted-foreground/50 transition-all duration-200 group-hover:border-primary group-hover:scale-110 group-active:scale-95">
            <Plus className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PresetsBar
