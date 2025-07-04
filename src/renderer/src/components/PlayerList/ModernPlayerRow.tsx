import React, { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Edit2,
  Check,
  ChevronDown,
  Send,
  XCircle,
  Wifi,
  WifiOff,
  MinusCircle,
  Plus,
  Power,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useDevices } from '../../context/devicesContext'
import { useStorage } from '../../context/localStorageContext'
import { useTable } from '../../context/tableContext'
import { useRefresh } from '../../context/refreshContext'
import { useToast } from '@/hooks/use-toast'
import { playerControl, removeFromGroup, runCommandForDevice } from '../../lib/utils'
import { mapCommandByName } from '../../lib/constants'
import noArtwork from '../../assets/noartwork.png'
import ApiListDropDown from '../ApiListDropDown'
import AddPlayerToGroup from '../AddPlayerToGroup'
import SettingsMenu from '../SettingsMenu'
import PresetsBar from '../PresetsBar'
import type { Device, DeviceStatus } from '../../types'

interface ModernPlayerRowProps {
  device: Device
  isSelected: boolean
  onSelectionChange: (selected: boolean) => void
}

const ModernPlayerRow: React.FC<ModernPlayerRowProps> = ({ device, isSelected, onSelectionChange }) => {
  const { devices, changeDeviceName, updateDeviceStatus, setDevices, getDeviceStatus, setDeviceStatus, devicesStatus } = useDevices()
  const { roomList, saveRoomForMac, addRoomToList, removeRoomFromList } = useStorage()
  const { version, showPreset } = useTable()
  const { refreshTime, shouldRefresh } = useRefresh()
  const { toast } = useToast()
  
  // State
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(device.name)
  const [api, setApi] = useState('')
  const [newRoomName, setNewRoomName] = useState('')
  const [volume, setVolume] = useState(0)
  const [status, setStatus] = useState<DeviceStatus | null>(null)
  const [upgradeVersion, setUpgradeVersion] = useState(version || '')
  const [checkingUpdate, setCheckingUpdate] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'current' | 'error'>('idle')
  const [availableVersion, setAvailableVersion] = useState<string | null>(null)
  
  const matchingDevice = devices.find((d: Device) => d?.mac === device.mac)
  const { isMaster, isSlave } = matchingDevice || {}
  const isGrouped = isMaster || isSlave

  // Fetch device status from API
  const fetchStatus = async () => {
    try {
      const res = await window.api.checkStatus(device.ip)
      setDeviceStatus(device.ip, res)
      setVolume((prev) => {
        if (prev === null || prev === 0) {
          return res?.volume || 0
        }
        return prev
      })
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }

  // Get status from context when it updates
  useEffect(() => {
    const deviceStatus = getDeviceStatus(device.ip)
    if (deviceStatus) {
      setStatus(deviceStatus)
      // Don't override volume if user is actively changing it
      if (!document.activeElement?.getAttribute('aria-label')?.includes('volume')) {
        setVolume(deviceStatus.volume || 0)
      }
    }
  }, [device.ip, devicesStatus])

  // Periodic status fetching
  useEffect(() => {
    fetchStatus()
    
    // Fetch status every 1-2 seconds with some randomization to avoid all devices fetching at once
    const interval = setInterval(
      () => {
        if (shouldRefresh) {
          fetchStatus()
        }
      },
      refreshTime * 1000 + 500 + Math.random() * 2000
    )
    
    return () => clearInterval(interval)
  }, [device.ip, refreshTime, shouldRefresh])

  // Sync upgrade version with context version
  useEffect(() => {
    if (version) {
      setUpgradeVersion(version)
    }
  }, [version])

  // Handlers
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runCommandForDevice(device.ip, ':11000/Name', 'POST', { nodename: newName })
    changeDeviceName(device.ip, newName)
    setIsEditingName(false)
  }

  const handleVolumeChange = async (value: number[]) => {
    setVolume(value[0])
    await window.api.playerControl(device.ip, 'volume', value[0])
  }

  const transportControl = async (control: string, param?: any) => {
    await window.api.playerControl(device.ip, control, param)
    // Fetch status immediately after control action
    setTimeout(() => fetchStatus(), 100)
  }

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const command = mapCommandByName(api)
    runCommandForDevice(device.ip, command, 'GET')
    toast({
      title: 'Success',
      description: `Command sent successfully: ${api}`
    })
  }

  const openApiCall = () => {
    const command = mapCommandByName(api)
    try {
      window.open(`http://${device.ip}${command}`, '_blank')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid Command: ' + api
      })
    }
  }

  const upgradePlayer = (customVersion?: string) => {
    const targetVersion = customVersion || upgradeVersion || version
    if (!targetVersion) return
    
    playerControl(device.ip, 'upgrade', targetVersion)
    updateDeviceStatus(device.ip, 'upgrading')
    toast({
      title: 'Player Upgrade',
      description: `Upgrading Player: ${device.name} : ${device.ip} to version ${targetVersion}`
    })
  }

  const rebootPlayer = () => {
    toast({
      title: 'Rebooting Player',
      description: `Rebooting Player: ${device.name} : ${device.ip}`
    })
    setDevices((prevDevices: Device[]) =>
      prevDevices.map((prevDevice: Device) =>
        prevDevice.ip === device.ip
          ? { ...prevDevice, status: 'Rebooting' }
          : prevDevice
      )
    )
    playerControl(device.ip, 'reboot', null)
  }

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return noArtwork
    if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
      return `http://${device.ip}:11000${imagePath}`
    }
    return imagePath
  }

  const checkForUpdate = async () => {
    setCheckingUpdate(true)
    setUpdateStatus('checking')
    try {
      const res = await window.api.checkUpgrade(device.ip)
      if (res?.available === 'true') {
        setUpdateStatus('available')
        setAvailableVersion(res.version)
        setUpgradeVersion(res.version) // Auto-fill the version input
      } else {
        setUpdateStatus('current')
      }
    } catch (error) {
      setUpdateStatus('error')
    }
    setCheckingUpdate(false)
  }

  const isPlaying = status?.state === 'play' || status?.state === 'stream' || status?.state === 'connecting'

  return (
    <div className="group relative bg-background/50 hover:bg-muted/30 rounded-lg border border-border/50 hover:border-border transition-all duration-200 p-4 mb-2">
      {/* Main Row Content */}
      <div className="flex items-center gap-4">
        {/* Selection Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectionChange}
          className="h-5 w-5"
        />

        {/* Album Art & Play Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={getImageUrl(status?.image)}
              alt={status?.title1 || 'Album Art'}
              className="w-16 h-16 rounded-md object-cover ring-1 ring-border/50"
              onError={(e) => {
                e.currentTarget.src = noArtwork
              }}
            />
            {/* Overlay Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              ) : (
                <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              )}
            </div>
            <button
              onClick={() => {
                if (status?.state === 'pause' || status?.state === 'stop' || status?.state === 'nothing') {
                  transportControl('play')
                } else if (status?.state === 'play' || status?.state === 'stream' || status?.state === 'connecting') {
                  transportControl('pause')
                }
              }}
              className="absolute inset-0 bg-black/0 hover:bg-black/40 rounded-md transition-all duration-200"
            />
          </div>

          {/* Transport Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => transportControl('back')}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => transportControl('skip')}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Device Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isEditingName ? (
              <form onSubmit={handleNameSubmit} className="flex items-center gap-1">
                <Input
                  type="text"
                  value={newName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                  className="h-7 w-40"
                  autoFocus
                />
                <Button type="submit" variant="ghost" size="icon" className="h-7 w-7">
                  <Check className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <>
                <h3 className="font-medium text-base truncate">{device.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                {isGrouped && isMaster && (
                  <Badge variant="secondary" className="text-xs">Master</Badge>
                )}
                {isGrouped && isSlave && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    Slave
                    <XCircle
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => {
                        toast({
                          title: 'Ungrouping Device',
                          description: `Ungrouping Device: ${device.name}:${device.ip}`
                        })
                        removeFromGroup(device)
                      }}
                    />
                  </Badge>
                )}
                <AddPlayerToGroup ip={device.ip} />
              </>
            )}
          </div>
          
          {/* Status Line with Room */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Room Assignment Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-foreground transition-colors cursor-pointer flex items-center gap-1">
                <span className={device.room ? '' : 'text-muted-foreground/60'}>
                  {device.room || 'Unassigned'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Assign Room</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roomList.map((room: string) => (
                  <div key={room} className="flex items-center">
                    <DropdownMenuItem
                      className="flex-1"
                      onClick={() => {
                        setDevices((prevDevices: Device[]) =>
                          prevDevices.map((prevDevice: Device) =>
                            prevDevice.ip === device.ip
                              ? { ...prevDevice, room }
                              : prevDevice
                          )
                        )
                        saveRoomForMac(device.mac, room)
                      }}
                    >
                      {room}
                    </DropdownMenuItem>
                    <button
                      className="p-1 hover:text-destructive"
                      onClick={() => removeRoomFromList(room)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <form
                  className="flex gap-1 p-1"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (newRoomName) {
                      addRoomToList(newRoomName)
                      setNewRoomName('')
                    }
                  }}
                >
                  <Input
                    placeholder="New Room"
                    className="h-7"
                    value={newRoomName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRoomName(e.target.value)}
                  />
                  <Button type="submit" size="icon" variant="ghost" className="h-7 w-7">
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="flex items-center gap-1">
              {device.status === 'Online' ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
              {device.status}
            </span>
            <a
              href={`http://${device.ip}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="h-3 w-3" />
              {device.ip}
            </a>
            <span className="text-xs">{device.model} • {matchingDevice?.version || 'N/A'}</span>
          </div>

          {/* Now Playing */}
          {status?.title1 && (
            <div className="mt-1 text-sm truncate">
              <span className="font-medium">{status.title1}</span>
              {status?.title2 && <span className="text-muted-foreground"> • {status.title2}</span>}
            </div>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
            aria-label="volume-slider"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">{volume}</span>
        </div>

        {/* API Command Bar */}
        <div className="flex items-center gap-1">
          <Input
            placeholder="/api"
            className="h-8 w-32"
            value={api}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApi(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleApiSubmit(e as any)
              }
            }}
          />
          <ApiListDropDown ip={device.ip} openApiCall={openApiCall} setApi={setApi} footer={null} />
          <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={handleApiSubmit}>
            <Send className="h-3 w-3" />
          </Button>
        </div>

        {/* Upgrade Section */}
        <div className="flex items-center gap-1">
          <Input
            placeholder="Version"
            className="h-8 w-24"
            value={upgradeVersion}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpgradeVersion(e.target.value)}
          />
          <Button 
            size="sm" 
            className="h-8"
            onClick={() => upgradePlayer()}
            disabled={!upgradeVersion}
          >
            Upgrade
          </Button>
          
          {/* Version Check Button */}
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={checkForUpdate}
            disabled={checkingUpdate}
          >
            {checkingUpdate ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : updateStatus === 'available' ? (
              <AlertCircle className="h-3 w-3 text-orange-500" />
            ) : updateStatus === 'current' ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : updateStatus === 'error' ? (
              <AlertCircle className="h-3 w-3 text-red-500" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
          
          {/* Status Text */}
          {updateStatus !== 'idle' && !checkingUpdate && (
            <span className="text-xs text-muted-foreground">
              {updateStatus === 'available' && availableVersion && `v${availableVersion} available`}
              {updateStatus === 'current' && 'Up to date'}
              {updateStatus === 'error' && 'Check failed'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Reboot Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={rebootPlayer}
          >
            <Power className="h-3 w-3 mr-1" />
            Reboot
          </Button>
          
          {/* Settings Menu */}
          <SettingsMenu ip={device.ip} />
        </div>
      </div>

      {/* Presets Bar - Always visible inline when showPreset is true */}
      {showPreset && (
        <div className="mt-3 flex items-center justify-end">
          <PresetsBar ip={device.ip} />
        </div>
      )}
    </div>
  )
}

export default ModernPlayerRow