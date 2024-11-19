// device = { name, ip, mac, model, version, room, status, isMaster, isSlave, master, slave }
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

import {
  AppWindow,
  ArrowDownNarrowWide,
  ArrowUpDown,
  CheckIcon,
  ChevronDownIcon,
  MinusCircleIcon,
  MoreHorizontal,
  PencilLineIcon,
  PlusIcon,
  Send,
  XCircle
} from 'lucide-react'
import SettingsMenu from '../SettingsMenu'
import PlayStatus from '../PlayStatus'
import SyncStatus from '../SyncStatus'
import { useStorage } from '../../context/localStorageContext'
import { useDevices } from '../../context/devicesContext'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import ApiListDropDown from '../ApiListDropDown'
import { useTable } from '../../context/tableContext'
import CheckUpgrade from '../CheckUpgrade'
import { playerControl, removeFromGroup, runCommandForDevice } from '../../lib/utils'
import { toast, useToast } from '@/hooks/use-toast'
import { goToIpAddress } from '../PlayerList'
import { Checkbox } from '@/components/ui/checkbox'
import CompactPlayer from '../CompactPlayer'
import AddPlayerToGroup from '../AddPlayerToGroup'
import { mapCommandByName } from '../../lib/constants'
import { Label } from '@/components/ui/label'

export const columns = [
  {
    id: 'select',
    header: ({ table }) => {
      const { selectAllDevices, removeAllSelectedDevices } = useDevices()
      if (!useDevices) return null
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            if (value) {
              selectAllDevices()
            } else {
              removeAllSelectedDevices()
            }
          }}
          aria-label="Select all"
        />
      )
    },
    cell: ({ row }) => {
      const { selectDeviceByIp, removeSelectedDeviceByIp } = useDevices()
      if (!useDevices) return null

      const device = row.original
      if (!device) return null
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            if (value) {
              selectDeviceByIp(device.ip)
            } else {
              removeSelectedDeviceByIp(device.ip)
            }
          }}
          aria-label="Select row"
        />
      )
    }
  },
  {
    id: 'compact',
    header: 'Devices',
    cell: ({ row }) => {
      const device = row.original
      if (!device) return null
      return (
        <div className="flex items-center justify-center">
          <CompactPlayer ip={device.ip} className="w-80" />
        </div>
      )
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const device = row.original
      if (!device) return null
      const { devices, changeDeviceName } = useDevices() || []

      //TODO: show master/slave

      if (!useDevices) return null
      const matchingDevice = devices.find((d) => {
        if (!d) return false
        return d.mac === device.mac
      })

      const { isMaster, isSlave, name } = matchingDevice || {}
      const [newName, setNewName] = useState(name)
      const [menuOpen, setMenuOpen] = useState(false)

      const isGrouped = isMaster || isSlave
      return (
        <>
          <div className="flex items-center ">
            <div className="flex items-center">
              <p>{name}</p>
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger className="ml-2 h-4 w-4 mr-2">
                  <PencilLineIcon className="h-4 w-4  text-foreground/20 hover:text-foreground duration-300 transition " />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setMenuOpen(false)
                      runCommandForDevice(device.ip, `:11000/Name`, 'POST', { nodename: newName })
                      changeDeviceName(device.ip, newName)
                    }}
                  >
                    <Label htmlFor="name">Change Name:</Label>
                    <div className="flex items-center gap-1 py-1">
                      <Input
                        type="text"
                        className="h-7 w-40"
                        value={newName}
                        onChange={(e) => {
                          setNewName(e.target.value)
                        }}
                      />
                      <Button variant="outline" size="sm" className="h-7">
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <AddPlayerToGroup ip={device.ip} />
          </div>
          <a
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => goToIpAddress(device.ip)}
          >
            {device.ip}
          </a>
          {isGrouped && isMaster && (
            <div className="flex items-center">
              <Badge variant="secondary">Master</Badge>
            </div>
          )}
          {isGrouped && isSlave && (
            <div className="flex items-center">
              <Badge variant="outline">Slave</Badge>
              <XCircle
                className="ml-1 h-4 w-4 cursor-pointer text-primary/10 hover:text-red-500"
                onClick={() => {
                  toast({
                    title: 'Ungrouping Device',
                    description: 'Ungrouping Device: ' + device.name + ':' + device.ip
                  })
                  removeFromGroup(device)
                }}
              />
            </div>
          )}
        </>
      )
    }
  },

  {
    accessorKey: 'room',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Room
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { roomList, saveRoomForMac, addRoomToList, removeRoomFromList } = useStorage()
      const { setDevices } = useDevices()
      if (!useDevices || !useStorage) return null
      const device = row.original
      if (!device) return null
      const [newRoomName, setNewRoomName] = useState('')
      return (
        <div className="flex gap-1 items-center">
          <p>{device.room}</p>
          <DropdownMenu>
            <DropdownMenuTrigger className=" outline outline-1 outline-offset-2 outline-accent mx-1 rounded-sm ">
              <ChevronDownIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Room</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roomList.map((room) => (
                <div key={room} className="grid gap-1 grid-cols-4">
                  <div className="grid-cols-subgrid col-span-3">
                    <DropdownMenuItem
                      onClick={() => {
                        setDevices((prevDevices) =>
                          prevDevices.map((prevDevice) => {
                            if (prevDevice.ip === device.ip) {
                              return {
                                ...prevDevice,
                                room
                              }
                            }
                            return prevDevice
                          })
                        )
                        saveRoomForMac(device.mac, room)
                      }}
                    >
                      {room}
                    </DropdownMenuItem>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button className="h-6 w-6 rounded-sm flex items-center justify-center hover:text-red-500 text-accent">
                      <MinusCircleIcon
                        className="h-4 w-4"
                        onClick={() => removeRoomFromList(room)}
                      />
                    </button>
                  </div>
                </div>
              ))}
              <form className="flex gap-1" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                  placeholder="New Room"
                  className="h-7 w-28"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                <Button
                  variant="ghost"
                  type="submit"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.preventDefault()
                    addRoomToList(newRoomName)
                    setNewRoomName('')
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  },
  {
    id: 'api',
    header: 'API',
    cell: ({ row }) => {
      const [api, setApi] = useState('')
      const device = row.original
      if (!device) return null
      const openApiCall = (ip, apiCommand) => {
        const command = mapCommandByName(apiCommand)
        try {
          window.open(`http://${ip}${command}`, '_blank')
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Invalid Command:' + apiCommand
          })
        }
      }
      return (
        <form className="flex gap-1 items-center">
          <Input
            placeholder="API"
            className="h-7 w-40"
            value={api}
            onChange={(e) => setApi(e.target.value)}
          />

          <ApiListDropDown ip={device.ip} openApiCall={openApiCall} setApi={setApi} />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="h-7"
            onClick={(e) => {
              e.preventDefault()
              const command = mapCommandByName(api)
              runCommandForDevice(device.ip, command, 'GET')
              toast({
                title: 'Success',
                description: `Command sent successfully: ${api}`
              })
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="h-7"
            onClick={(e) => {
              e.preventDefault()
              openApiCall(device.ip, api)
            }}
          >
            <AppWindow className="h-4 w-4" />
          </Button>
        </form>
      )
    }
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const device = row.original
      if (!device) return null
      return (
        <div className="text-center">
          <SyncStatus ip={device.ip} />
        </div>
      )
    }
  },
  {
    id: 'playStatus',
    header: 'Play Status',
    cell: ({ row }) => {
      const device = row.original
      if (!device) return null
      return (
        <div className=" flex justify-center mx-auto">
          <PlayStatus ip={device.ip} />
        </div>
      )
    }
  },
  {
    accessorKey: 'model',
    header: 'Model: Version',
    cell: ({ row }) => {
      const device = row.original
      if (!device) return null
      const { devices } = useDevices() || []

      if (!useDevices) return null
      const matchingDevice = devices.find((d) => {
        if (!d) return false
        return d.mac === device.mac
      })
      const version = matchingDevice?.version

      return (
        <div className="text-center">
          <p>{device.model}</p>
          <p>{version || 'N/A'}</p>
        </div>
      )
    }
  },
  {
    id: 'upgrade',
    header: 'Upgrade',
    cell: ({ row }) => {
      const device = row.original
      if (!device) return null
      const { version } = useTable()
      const { updateDeviceStatus } = useDevices()
      const { toast } = useToast()

      if (!useDevices || !useToast) return null

      const upgradePlayer = () => {
        playerControl(device.ip, 'upgrade', version)
        updateDeviceStatus(device.ip, 'upgrading')
        toast({
          title: 'Player Upgrade',
          description: 'Upgrading Player: ' + device.name + ' : ' + device.ip
        })
      }
      return (
        <div className="flex flex-col gap-1 items-center">
          <Button onClick={upgradePlayer} disabled={!version}>
            Upgrade
          </Button>
          <CheckUpgrade ip={device.ip} />
        </div>
      )
    }
  },
  {
    id: 'reboot',
    header: 'Reboot',
    cell: ({ row }) => {
      const device = row.original
      if (!device) return null
      const { toast } = useToast()
      const { setDevices } = useDevices()
      if (!useDevices || !useToast) return null

      const rebootPlayer = () => {
        toast({
          title: 'Rebooting Player',
          description: 'Rebooting Player: ' + device.name + ' : ' + device.ip
        })
        // find the device with ip, and set status to rebooting
        setDevices((prevDevices) => {
          // Create a new array by mapping over the previous state
          return prevDevices.map((prevDevice) => {
            if (prevDevice.ip === device.ip) {
              // Return a new object with updated values
              return {
                ...prevDevice,
                status: 'Rebooting'
              }
            }
            return prevDevice // No changes, return the device as is
          })
        })
        playerControl(device.ip, 'reboot', null)
      }

      return (
        <div className="text-center">
          <Button onClick={rebootPlayer} variant="outline">
            Reboot
          </Button>
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const device = row.original
      if (!device) return null

      return (
        <div className="text-center">
          <SettingsMenu ip={device.ip} />
        </div>
      )
    }
  },
  {
    accessorKey: 'version',
    header: null,
    cell: null
  },
  {
    accessorKey: 'ip',
    header: null,
    cell: null
  }
]
