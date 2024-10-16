import React, { useEffect, useState } from 'react'
import { useBrowsing } from '../context/browsingContext'
import { useSdui } from '../context/sduiContext'
import { playerControl, runCommandForDevice } from '../lib/utils'
import noArtwork from '../assets/noartwork.png'
import { renderComponent } from './BrowseView/GUI'

const PresetsBar = ({ ip }) => {
  const [presets, setPresets] = useState([])

  const loadPresets = async () => {
    const res = await window.api.loadSDUIPage(`http://${ip}:11000/Presets`, ip)
    if (res && res.json && res.json.presets) {
      setPresets(res.json.presets.preset)
      console.log(res.json.presets.preset)
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

  if (presets === undefined || presets.length === 0) return null

  return (
    <div className="flex justify-end border-t mt-3 pt-2 ">
      <div className="flex rounded-md ">
        {presets.slice(0, 5).map((preset) => (
          <div
            key={preset.$.id}
            className="flex flex-col items-start gap-2 cursor-pointer hover:bg-accent hover:text-primary rounded-md px-1.5 py-1  relative group transition ease-out duration-300 active:scale-110"
            onClick={() => {
              runCommandForDevice(ip, `:11000/Preset?id=${preset.$.id}`, 'GET')
            }}
          >
            <div className="size-12 flex items-center justify-center">
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
      </div>
    </div>
  )
}

export default PresetsBar
