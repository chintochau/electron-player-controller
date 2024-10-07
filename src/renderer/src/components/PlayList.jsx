import React, { useEffect, useState } from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  ChevronDownIcon,
  EllipsisVertical,
  Loader2,
  RefreshCw,
  SquareArrowOutUpRightIcon
} from 'lucide-react'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { commandList } from '../lib/constants'
import SyncStatus from './SyncStatus'
import PlayStatus from './PlayStatus'
import { useToast } from '../../../hooks/use-toast'
import SettingsMenu from './SettingsMenu'
import { useStorage } from '../context/localStorageContext'
import { useRefresh } from '../context/refreshContext'

const PlayList = () => {
  const { savedPlayers, saveRoomForMac, roomList, saveRoomList, checkRoomForMac } = useStorage()
  const [devices, setDevices] = useState([]) // {name, ip, mac, model, version}
  const [version, setVersion] = useState('')
  // create an array of empty strings, length 200
  const [apiList, setApiList] = useState(new Array(200).fill(''))
  const { refreshTime, setRefreshTime } = useRefresh()
  const { toast } = useToast()

  const sortAndSaveDevicesList = (devices) => {
    // sort by room, and then by name
    devices.sort((a, b) => {
      if (a.room < b.room) return -1
      if (a.room > b.room) return 1
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    setDevices(devices)
    return devices
  }

  async function fetchDevices() {
    const discoveredDevices = await window.api.discoverDevices()
    let devicesList = []
    for (const device of discoveredDevices) {
      const { name, txt, addresses, referer } = device
      const ip = referer.address

      const room = checkRoomForMac(txt.mac)

      devicesList.push({
        name,
        ip,
        mac: txt.mac,
        model: txt.model,
        version: txt.version,
        room
      })
    }

    devicesList = sortAndSaveDevicesList(devicesList)
    return devicesList
  }

  useEffect(() => {
    fetchDevices()
    // const interval = setInterval(() => {
    //   fetchDevices();
    // }, refreshTime * 1000);
    // return () => clearInterval(interval);
  }, [refreshTime])

  const refreshPage = () => {
    setDevices([])
    fetchDevices()
  }

  const playerControl = async (ip, control, param) => {
    const res = await window.api.playerControl(ip, control, param)
  }

  const goToIpAddress = (ip) => {
    window.open(`http://${ip}/`, '_blank')
  }

  return (
    <Table>
      <TableCaption>
        <div className="flex w-fit items-center m-1">
          <p className="text-lg mr-2">BluOS Devices</p>
          <p className=" text-sm"> Refresh Time: (Seconds) </p>
          <Input
            className="ml-2 w-20 h-7"
            value={refreshTime}
            onChange={(e) => setRefreshTime(e.target.value)}
            placeholder="seconds"
          />
          <Button variant="ghost" onClick={refreshPage}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-60">Name</TableHead>
          <TableHead className="text-center w-40">API</TableHead>
          <TableHead className="text-center w-20">room</TableHead>
          <TableHead className="text-center">Status </TableHead>
          <TableHead className="text-center">Now Playing </TableHead>
          <TableHead className="text-center">Model:Version </TableHead>
          <TableHead className="p-0 m-0 text-center flex flex-col items-center  h-14">
            Upgrade:
            <Input
              className="ml-2 w-20 h-7"
              onChange={(e) => setVersion(e.target.value)}
              placeholder="Version"
            />
          </TableHead>
          <TableHead className="p-0 m-0 text-center">reset</TableHead>
          <TableHead className="p-0 m-0 text-center">settings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            </TableCell>
          </TableRow>
        ) : (
          <>
            {roomList
              .sort(
                // sort by room
                (a, b) => a.localeCompare(b)
              )
              .map((room) => renderDevicesByRoom(room))}
          </>
        )}
      </TableBody>
    </Table>
  )

  function renderDevicesByRoom(room) {
    return (
      <>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={7} className="text-center">
            <div className="flex gap-1 items-center">
              <p className="text-lg mr-2">Room: {room}</p>
              <Button
                onClick={() => {
                  // loop through all devices, and call playerControl(play)
                  for (const device of devices) {
                    if (device.room === room) {
                      playerControl(device.ip, 'play', null)
                    }
                  }
                  toast({
                    title: 'All Devices',
                    description: 'Playing All Devices in Room: ' + room
                  })
                }}
                variant="outline"
              >
                Play All
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // loop through all devices, and call playerControl(stop)
                  for (const device of devices) {
                    if (device.room === room) {
                      playerControl(device.ip, 'pause', null)
                    }
                  }
                  toast({
                    title: 'All Devices',
                    description: 'Pausing All Devices in Room: ' + room
                  })
                }}
              >
                Pause All
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {devices
          .filter((device) => device.room === room)
          .map((device, index) => (
            <TableRow key={device.ip} className="hover:bg-transparent">
              <TableCell className="font-medium ">
                <p>{device.name}</p>
                <a
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => goToIpAddress(device.ip)}
                >
                  {device.ip}
                </a>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  <p>/</p>
                  <Input
                    placeholder="API"
                    className="h-7 w-40"
                    value={apiList[index]}
                    onChange={(e) =>
                      setApiList([
                        ...apiList.slice(0, index),
                        e.target.value,
                        ...apiList.slice(index + 1)
                      ])
                    }
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger className=" outline outline-1 outline-offset-2 outline-accent mx-1 rounded-sm">
                      <ChevronDownIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {commandList.map((command) => (
                        <div className="flex items-center " key={command.command}>
                          <DropdownMenuItem
                            key={command}
                            onClick={() =>
                              setApiList([
                                ...apiList.slice(0, index),
                                command.command,
                                ...apiList.slice(index + 1)
                              ])
                            }
                          >
                            <p>{command.name}</p>
                          </DropdownMenuItem>
                          <Button
                            variant="ghost"
                            className="px-2 ml-1"
                            onClick={() => {
                              window.open(`http://${device.ip}:11000/${command.command}`, '_blank')
                            }}
                          >
                            <SquareArrowOutUpRightIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    className="h-7"
                    onClick={() => {
                      window.open(`http://${device.ip}:11000/${apiList[index]}`, '_blank')
                    }}
                  >
                    Go
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  <p>{device.room}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger className=" outline outline-1 outline-offset-2 outline-accent mx-1 rounded-sm">
                      <ChevronDownIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {roomList.map((room) => (
                        <DropdownMenuItem
                          key={room}
                          onClick={() => {
                            setDevices((prevDevices) =>
                              prevDevices
                                .map((prevDevice) => {
                                  if (prevDevice.ip === device.ip) {
                                    return {
                                      ...prevDevice,
                                      room
                                    }
                                  }
                                  return prevDevice
                                })
                                .sort((a, b) => {
                                  // sort by room, and then by name
                                  if (a.room < b.room) return -1
                                  if (a.room > b.room) return 1
                                  if (a.name < b.name) return -1
                                  if (a.name > b.name) return 1
                                  return 0
                                })
                            )
                            saveRoomForMac(device.mac, room)
                          }}
                        >
                          {room}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
              <TableCell>
                <SyncStatus ip={device.ip} />
              </TableCell>
              <TableCell>
                <PlayStatus ip={device.ip} />
              </TableCell>
              <TableCell className="text-center">
                <p>{device.model}</p>
                <p> {device.version}</p>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  onClick={() => playerControl(device.ip, 'upgrade', version)}
                  disabled={!version}
                >
                  Upgrade
                </Button>
              </TableCell>
              <TableCell className="px-1 mx-1">
                <Dialog>
                  <DialogTrigger className="text-red-300 duration-300 transition hover:text-red-600">
                    Reset
                  </DialogTrigger>
                  <DialogContent className=" bg-white">
                    <DialogHeader>
                      <DialogTitle>Do you want to reset {device.name}?</DialogTitle>
                      <DialogDescription>
                        This will run a /factoryreset command on the device.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => controlPlayer(device.ip, 'factoryreset')}
                      >
                        Reset
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <SettingsMenu ip={device.ip} />
              </TableCell>
            </TableRow>
          ))}
      </>
    )
  }
}

export default PlayList
