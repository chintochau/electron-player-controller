import React, { useEffect, useState } from 'react'
import { useBrowsing } from '../context/browsingContext'
import { useSdui } from '../context/sduiContext'
import { playerControl, runCommandForDevice } from '../lib/utils'
import noArtwork from '../assets/noartwork.png'
import { renderComponent } from './BrowseView/GUI'
import { Plus, Trash2 } from 'lucide-react'
import { useDevices } from '../context/devicesContext'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'

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
        {presets &&
          presets.slice(0, 6).map((preset) => (
            <ContextMenu key={preset.$.id}>
              <ContextMenuTrigger>
                <div
                  className="relative group/preset cursor-pointer"
                  onClick={() => {
                    runCommandForDevice(ip, `:11000/Preset?id=${preset.$.id}`, 'GET')
                  }}
                  title={preset.$.name}
                >
                  <div className="size-8 rounded-full overflow-hidden ring-1 ring-border/50 transition-all duration-200 group-hover/preset:ring-2 group-hover/preset:ring-primary group-hover/preset:scale-110 group-active/preset:scale-95">
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
                  <div className="absolute -top-1 -right-1 size-3 rounded-full bg-primary opacity-0 group-hover/preset:opacity-100 transition-opacity duration-200" />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => {
                    runCommandForDevice(ip, `:11000/Preset?id=${preset.$.id}`, 'GET')
                  }}
                  className="text-base"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Play
                </ContextMenuItem>
                <ContextMenuItem disabled className="text-base opacity-50">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={async (event) => {
                    event.stopPropagation()
                    // Use GET request as shown in the terminal - this is the working delete command
                    await runCommandForDevice(ip, `:11000/SetPreset?id=${preset.$.id}`, 'GET')
                    // Reload presets after deletion
                    loadPresets()
                  }}
                  className="text-base"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}

        {/* Add Preset Button */}
        <div
          className="relative group/add cursor-pointer"
          onClick={() => {
            const currentDevice = devices.find((device) => device.ip === ip)
            if (currentDevice) {
              setSelectedPlayer(currentDevice)
            }
            setIsAddpresetPageShown(true)
          }}
          title="Add Preset"
        >
          <div className="size-8 rounded-full flex items-center justify-center bg-background border border-dashed border-muted-foreground/50 transition-all duration-200 group-hover/add:border-primary group-hover/add:scale-110 group-active/add:scale-95">
            <Plus className="size-4 text-muted-foreground group-hover/add:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PresetsBar
