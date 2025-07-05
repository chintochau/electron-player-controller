import React, { useState } from 'react'
import { useDevices } from '../../context/devicesContext'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import ModernPlayerRow from './ModernPlayerRow'

import type { Device } from '../../types'

type SortOption = 'name' | 'ip' | 'room' | 'status' | 'none'

const PlayerListModern: React.FC = () => {
  const { devices, selectedDevices, setSelectedDevices } = useDevices() as {
    devices: Device[]
    selectedDevices: string[]
    setSelectedDevices: (devices: string[]) => void
  }
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRoom, setFilterRoom] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('none')

  // Get unique rooms
  const deviceRooms = devices
    .map((d: Device) => d.room)
    .filter((room): room is string => typeof room === 'string' && room.length > 0)
  const uniqueRooms = Array.from(new Set(deviceRooms))
  const rooms: string[] = ['all', ...uniqueRooms]

  // Filter and sort devices
  const filteredDevices = devices
    .filter((device: Device) => {
      const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           device.ip.includes(searchQuery) ||
                           device.model?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRoom = filterRoom === 'all' || device.room === filterRoom
      
      return matchesSearch && matchesRoom
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'ip':
          return a.ip.localeCompare(b.ip)
        case 'room':
          return (a.room || '').localeCompare(b.room || '')
        case 'status':
          return (a.status || '').localeCompare(b.status || '')
        default:
          return 0
      }
    })

  // Check if all filtered devices are selected
  const allFilteredSelected = filteredDevices.length > 0 && 
    filteredDevices.every(device => selectedDevices.includes(device.ip))

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Controls - Fixed */}
      <div className="px-6 py-4 flex-shrink-0">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="flex gap-4 items-center">
            {/* Select All Checkbox */}
            <Checkbox
              checked={allFilteredSelected}
              onCheckedChange={() => {
                if (!allFilteredSelected) {
                  // Select all filtered devices
                  const filteredIps = filteredDevices.map(d => d.ip)
                  const newSelection = Array.from(new Set([...selectedDevices, ...filteredIps]))
                  setSelectedDevices(newSelection)
                } else {
                  // Deselect all filtered devices
                  const filteredIps = filteredDevices.map(d => d.ip)
                  const newSelection = selectedDevices.filter(ip => !filteredIps.includes(ip))
                  setSelectedDevices(newSelection)
                }
              }}
              className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              aria-label="Select all devices"
            />
            
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-11 h-9 bg-background border-border focus:bg-background transition-colors"
                />
              </div>
            </div>
            
            {/* Sort By */}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] h-9 bg-background border-border">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="ip">IP Address</SelectItem>
                <SelectItem value="room">Room</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter by Room */}
            <Select value={filterRoom} onValueChange={setFilterRoom}>
              <SelectTrigger className="w-[180px] h-9 bg-background border-border">
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
      </div>

      {/* Device List - Scrollable */}
      <div className="flex-1 overflow-x-auto overflow-y-auto px-6 pb-4">
        <div className="min-w-[1000px]">
          {filteredDevices.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-lg font-medium mb-1">
                {searchQuery || filterRoom !== 'all' 
                  ? 'No devices match your filters' 
                  : 'No devices found'}
              </div>
              <div className="text-sm">
                {searchQuery || filterRoom !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Make sure your devices are powered on and connected to the network'}
              </div>
            </div>
          ) : (
            <>
              {filteredDevices.map((device: Device, index: number) => (
                <React.Fragment key={device.ip}>
                  <ModernPlayerRow
                    device={device}
                    isSelected={selectedDevices.includes(device.ip)}
                    onSelectionChange={(selected) => {
                      if (selected) {
                        setSelectedDevices([...selectedDevices, device.ip])
                      } else {
                        setSelectedDevices(selectedDevices.filter(ip => ip !== device.ip))
                      }
                    }}
                  />
                  {index < filteredDevices.length - 1 && (
                    <hr className="border-t border-border/50" />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Footer Info - Fixed */}
      <div className="text-center text-sm text-muted-foreground py-3 flex-shrink-0">
        {devices.length} device{devices.length !== 1 ? 's' : ''} discovered
      </div>
    </div>
  )
}

export default PlayerListModern