import React from 'react'
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

const SettingsMenu = ({ ip }) => {
  return (
    <DropdownMenu>
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SettingsMenu
