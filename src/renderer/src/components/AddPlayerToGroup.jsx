import { UngroupIcon } from 'lucide-react'
import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDevices } from '../context/devicesContext'
import { playerControl } from './PlayList'
import { useToast } from '@/hooks/use-toast'



const AddPlayerToGroup = ({ ip }) => {
    const { devices, setDevices } = useDevices()
    const { toast } = useToast()

    const addPlayerToThisGroup = (slaveIp) => {
        playerControl(ip, 'addSlave', slaveIp)
        toast({
            title: 'Added Player',
            description: 'Adding Player To Group' 
        })
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='hover:bg-accent p-2 rounded-md'><UngroupIcon className="h-4 w-4" /></DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-96 overflow-y-auto">
                <DropdownMenuLabel>Add Player To This Group</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {devices.filter(d => d.ip !== ip).map((device, index) => (
                    <DropdownMenuItem
                        className="cursor-pointer"
                        key={index}
                        onClick={() => {
                            addPlayerToThisGroup(device.ip)
                        }}
                    >
                        {device.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AddPlayerToGroup