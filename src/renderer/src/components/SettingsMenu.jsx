import React, { Fragment, useEffect, useState } from 'react'
import { Button } from '../../../components/ui/button'
import { EllipsisVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { helpList, settingsList } from '../lib/constants'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { playerControl } from '../lib/utils'
import { useDevices } from '../context/devicesContext'
import { useBrowsing } from '../context/browsingContext'
import MenuGroup from './BrowseView/MenuGroup'

const SettingsMenu = ({ ip }) => {
  const { searchDeviceByIp } = useDevices()
  // const { loadSDUI } = useBrowsing()
  const [deviceName, setDeviceName] = useState()
  const [settingsMenu, setSettingsMenu] = useState(null)

  useEffect(() => {
    setDeviceName(searchDeviceByIp(ip)?.name)
  }, [ip, searchDeviceByIp])

  const fetchSettings = async () => {
    const res = await loadSDUI(`:11000/Settings`, ip)
    setSettingsMenu(res.json)
  }

  return (
    <DropdownMenu >
      <DropdownMenuTrigger className="hover:bg-accent p-2 rounded-md">
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        {settingsList.map((item, index) => {
          const IconComponent = item.icon
          return (
            <DropdownMenuItem
              className="cursor-pointer"
              key={index}
              onClick={() => {
                window.api.openOverlay(`http://${ip}/${item.path}`)
              }}
            >
              <IconComponent className=" h-4 w-4 mr-2" />
              <p>{item.name}</p>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuLabel>Help</DropdownMenuLabel>
        {helpList.map((item, index) => {
          const IconComponent = item.icon
          return (
            <DropdownMenuItem
              className="cursor-pointer"
              key={index}
              onClick={() => {
                window.api.openOverlay(`http://${ip}/${item.path}`)
              }}
            >
              <IconComponent className=" h-4 w-4 mr-2" />
              <p>{item.name}</p>
            </DropdownMenuItem>
          )
        })}
        <Dialog>
          <DialogTrigger className="text-red-300 duration-300 transition hover:text-red-600 px-2 text-sm py-2">
            Reset
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Do you want to reset {deviceName}?</DialogTitle>
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
                onClick={() => playerControl(ip, 'factoryreset')}
              >
                Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SettingsMenu
