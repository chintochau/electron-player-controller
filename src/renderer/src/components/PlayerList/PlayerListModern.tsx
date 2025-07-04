import React, { useState } from 'react'
import { useDevices } from '../../context/devicesContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Search, Filter, Download, Power, Send } from 'lucide-react'
import ModernPlayerRow from './ModernPlayerRow'
import { runCommandForDevice } from '../../lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useTable } from '../../context/tableContext'

import type { Device } from '../../types'

const PlayerListModern: React.FC = () => {
  const { devices, selectedDevices, selectDeviceByIp, removeSelectedDeviceByIp } = useDevices() as {
    devices: Device[]
    selectedDevices: string[]
    selectDeviceByIp: (ip: string) => void
    removeSelectedDeviceByIp: (ip: string) => void
  }
  const { version } = useTable()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRoom, setFilterRoom] = useState('all')
  const [apiCommand, setApiCommand] = useState('')

  // Get unique rooms
  const deviceRooms = devices
    .map((d: Device) => d.room)
    .filter((room): room is string => typeof room === 'string' && room.length > 0)
  const uniqueRooms = Array.from(new Set(deviceRooms))
  const rooms: string[] = ['all', ...uniqueRooms]

  // Filter devices
  const filteredDevices = devices.filter((device: Device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.ip.includes(searchQuery) ||
                         device.model?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRoom = filterRoom === 'all' || device.room === filterRoom
    
    return matchesSearch && matchesRoom
  })

  // Batch actions
  const runCommandForSelected = () => {
    if (!apiCommand || selectedDevices.length === 0) return
    
    selectedDevices.forEach((deviceIp: string) => {
      runCommandForDevice(deviceIp, `:11000/${apiCommand}`, 'GET')
    })
    
    toast({
      title: 'Commands Sent',
      description: `Sent "${apiCommand}" to ${selectedDevices.length} device(s)`
    })
  }

  const upgradeSelected = () => {
    if (selectedDevices.length === 0 || !version) return
    
    selectedDevices.forEach((deviceIp: string) => {
      const device = devices.find((d: Device) => d.ip === deviceIp)
      if (device) {
        runCommandForDevice(deviceIp, ':11000/Upgrade', 'GET')
        toast({
          title: 'Upgrading',
          description: `Upgrading ${device.name}`
        })
      }
    })
  }

  const rebootSelected = () => {
    if (selectedDevices.length === 0) return
    
    selectedDevices.forEach((deviceIp: string) => {
      const device = devices.find((d: Device) => d.ip === deviceIp)
      if (device) {
        runCommandForDevice(deviceIp, ':11000/Reboot', 'GET')
        toast({
          title: 'Rebooting',
          description: `Rebooting ${device.name}`
        })
      }
    })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Controls - Fixed */}
      <div className="bg-muted/20 rounded-lg p-4 border border-border/50 mb-4 flex-shrink-0">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label className="text-sm mb-1">Search Devices</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, IP, or model..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="w-48">
              <Label className="text-sm mb-1">Filter by Room</Label>
              <Select value={filterRoom} onValueChange={setFilterRoom}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room: string) => (
                    <SelectItem key={room} value={room}>
                      {room === 'all' ? 'All Rooms' : room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Batch Actions Row */}
          {selectedDevices.length > 0 && (
            <div className="border-t border-border/50 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedDevices.length} device{selectedDevices.length !== 1 ? 's' : ''} selected
                </div>
                
                <div className="flex gap-2">
                  {/* API Command for Selected */}
                  <div className="flex gap-1">
                    <Input
                      placeholder="/api"
                      value={apiCommand}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiCommand(e.target.value)}
                      className="h-8 w-32"
                    />
                    <Button
                      size="sm"
                      onClick={runCommandForSelected}
                      disabled={!apiCommand}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Run Command for All
                    </Button>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={upgradeSelected}
                    disabled={!version}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Upgrade All
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={rebootSelected}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    Reboot All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0">
          {filteredDevices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || filterRoom !== 'all' 
                ? 'No devices match your filters' 
                : 'No devices found'}
            </div>
          ) : (
            filteredDevices.map((device: Device) => (
              <ModernPlayerRow
                key={device.ip}
                device={device}
                isSelected={selectedDevices.includes(device.ip)}
                onSelectionChange={(selected) => {
                  if (selected) {
                    selectDeviceByIp(device.ip)
                  } else {
                    removeSelectedDeviceByIp(device.ip)
                  }
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer Info - Fixed */}
      <div className="text-center text-sm text-muted-foreground py-2 border-t border-border/50 mt-2 flex-shrink-0">
        {devices.length} device{devices.length !== 1 ? 's' : ''} discovered
      </div>
    </div>
  )
}

export default PlayerListModern