import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useBrowsing } from '../../context/browsingContext'

// TODO: implement MenuGroup

const MenuGroup = ({ menuGroup, ip }) => {
    const {} = useBrowsing()
    return (
        <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
                console.log(`http://${ip}${menuGroup?.$?.url}`)
                window.api.openOverlay(`http://${ip}${menuGroup?.$?.url}`)
            }}>
            <div className='h-4 w-4 mr-2'>
                <img
                src={`http://${ip}:11000${menuGroup?.$?.icon}`}
                />
            </div>
            {menuGroup?.$?.displayName}
        </DropdownMenuItem>
    )
}

export default MenuGroup