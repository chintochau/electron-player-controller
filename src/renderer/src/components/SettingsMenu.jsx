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
import { settingsList } from '../lib/constants'

const SettingsMenu = ({ ip }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {
            settingsList.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  window.api.openOverlay(`http://${ip}/${item.path}`)
                }}
              >
                {item.name}
              </DropdownMenuItem>
            ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SettingsMenu
