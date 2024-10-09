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
    ChevronUp,
    CornerDownRight,
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
import { cn } from '@/lib/utils'
import { goToIpAddress } from './PlayList'



const Player = ({ device, index, setDeviceGroupingStatus, devices, setDevices }) => {

    const { savedPlayers, saveRoomForMac, roomList, saveRoomList, checkRoomForMac } = useStorage()
    const [version, setVersion] = useState('')
    // create an array of empty strings, length 200
    const [apiList, setApiList] = useState(new Array(200).fill(''))
    const { refreshTime, setRefreshTime } = useRefresh()
    const { toast } = useToast()
    const [isSlaveListOpen, setIsSlaveListOpen] = useState(false)


    return (
        <>
            <TableRow className={cn("hover:bg-transparent")} >
                <TableCell className="font-medium ">
                    <div className="flex gap-1 items-center">
                        {device.isMaster && <ChevronUp className={cn("h-12 w-12 duration-300 cursor-pointer hover:bg-primary/5 rounded-md m-2", isSlaveListOpen && "rotate-180")} onClick={() => setIsSlaveListOpen(!isSlaveListOpen)} />}
                        <p>{device.name}</p>
                        <a
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={() => goToIpAddress(device.ip)}
                        >
                            {device.ip}
                        </a>
                    </div>
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
                    <SyncStatus ip={device.ip} setDeviceGroupingStatus={setDeviceGroupingStatus} />
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
                    <CheckUpgrade ip={device.ip} />
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
            {device.isMaster && isSlaveListOpen && (
                // render slaves
                devices.map((slave) => {
                    if (slave.master === device.ip) {
                        return (<TableRow className="hover:bg-transparent">
                            <TableCell className="pl-8" key={slave.ip}>
                                <div className="flex gap-4 items-center">
                                    <CornerDownRight className="h-6 w-6" />
                                    <Button variant="outline" >Upgroup</Button>
                                </div>
                            </TableCell>
                            <TableCell><div className="flex gap-1 items-center">
                                <p>{slave.name}</p>
                                <a
                                    className="text-blue-500 hover:underline cursor-pointer"
                                    onClick={() => goToIpAddress(slave.ip)}
                                >
                                    {slave.ip}
                                </a>
                            </div>

                            </TableCell>
                        </TableRow>)
                    }
                })

            )}
        </>
    )
}

export default Player