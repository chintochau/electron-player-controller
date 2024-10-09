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
import CheckUpgrade from './CheckUpgrade'
import Player from './Player'


export const goToIpAddress = (ip) => {
  window.open(`http://${ip}/`, '_blank')
}
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
        room,
      })
    }

    devicesList = sortAndSaveDevicesList(devicesList)
    return devicesList
  }

  useEffect(() => {
    // log when devcies change
    console.log("Devices", devices)
  }, [devices])

  const setDeviceGroupingStatus = (ip, status) => {
    const { isMaster, isSlave, master, slave } = status;

    setDevices((prevDevices) => {
      // Create a new array by mapping over the previous state
      return prevDevices.map((device) => {
        if (device.ip === ip) {
          // Return a new object with updated values
          return {
            ...device,
            isMaster,
            isSlave,
            master,
            slave
          };
        }
        return device; // No changes, return the device as is
      });
    });
  };

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
          <TableCell colSpan={7} className="text-center py-1">
            <div className="flex gap-1 items-center">
              <p className="text-lg mr-2">Room: {room}</p>
              <Button
                className="h-6"

                onClick={() => {
                  // loop through all devices, and call playerControl(play)
                  for (const device of devices) {
                    if (device.room === room && !device.isSlave) {
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
                className="h-6"
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
          .filter((device) => device.room === room && !device.isSlave)
          .map((device, index) => (
            <Player key={index} device={device} index={index} setDeviceGroupingStatus={setDeviceGroupingStatus} devices={devices} setDevices={setDevices} />
          ))}
      </>
    )
  }
}

export default PlayList
