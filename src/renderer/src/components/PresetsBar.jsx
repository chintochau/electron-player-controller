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
    <div className="flex justify-end border-t mt-3 pt-2 ">
      <div className="flex rounded-md ">
        {presets && presets.slice(0, 5).map((preset) => (
          <div
            key={preset.$.id}
            className="flex flex-col items-start gap-2 cursor-pointer hover:bg-accent hover:text-primary rounded-md px-1.5 py-1  relative group transition ease-out duration-300 active:scale-110"
            onClick={() => {
              runCommandForDevice(ip, `:11000/Preset?id=${preset.$.id}`, 'GET')
            }}
          >
            <div className="size-12 object-cover overflow-hidden flex items-center justify-center">
              <img
                className="rounded-md "
                alt={preset.$.name}
                src={getImagePath(preset.$.image)}
                onError={(e) => {
                  e.target.onerror = null // Prevent infinite loop if fallback fails
                  e.target.src = noArtwork // Path to your fallback image
                }}
              />
              {renderComponent('player-link', 6, true)}
            </div>
          </div>
        ))}
        
        {/* Add Preset Button */}
        <div
          className="flex flex-col items-start gap-2 cursor-pointer hover:bg-accent hover:text-primary rounded-md px-1.5 py-1 relative group transition ease-out duration-300 active:scale-110"
          onClick={() => {
            // Find and set the player that matches this IP
            const currentDevice = devices.find(device => device.ip === ip)
            if (currentDevice) {
              setSelectedPlayer(currentDevice)
            }
            setIsAddpresetPageShown(true)
          }}
          title="Add Preset"
        >
          <div className="size-12 flex items-center justify-center border-2 border-dashed border-muted-foreground/50 rounded-md hover:border-primary">
            <Plus className="size-6 text-muted-foreground group-hover:text-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PresetsBar
