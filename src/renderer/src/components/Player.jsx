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
    PlusIcon,
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
import { goToIpAddress, playerControl } from './PlayList'
import { Progress } from '@/components/ui/progress'
import AddPlayerToGroup from './AddPlayerToGroup'
import ApiListDropDown from './ApiListDropDown'
import { useDevices } from '../context/devicesContext'



const Player = ({ device, index, setDeviceGroupingStatus, version }) => {
    const { updateDeviceStatus, devices, setDevices } = useDevices()
    const { savedPlayers, saveRoomForMac, roomList, saveRoomList, checkRoomForMac } = useStorage()
    const [api, setApi] = useState('')
    const { refreshTime, setRefreshTime } = useRefresh()
    const { toast } = useToast()
    const [isSlaveListOpen, setIsSlaveListOpen] = useState(false)


    const upgradePlayer = () => {
        playerControl(device.ip, 'upgrade', version)
        updateDeviceStatus(device.ip, 'upgrading')
        toast({
            title: 'Player Upgrade',
            description: 'Upgrading Player: ' + device.name + " : " + device.ip
        })
    }

    const openApiCall = (ip, command) => {
        window.open(`http://${ip}${command}`, '_blank')
    }

    const removeFromGroup = (slaveDevice) => {
        toast({
            title: 'Ungrouping Device',
            description: 'Ungrouping Device: ' + slaveDevice.name + " : " + slaveDevice.ip
        })
        console.log(slaveDevice);

        ///RemoveSlave?slave=secondaryPlayerIP&port=secondaryPlayerPor
        playerControl(slaveDevice.master, 'removeSlave', slaveDevice.ip)
    }

    const rebootPlayer = () => {
        toast({
            title: 'Rebooting Player',
            description: 'Rebooting Player: ' + device.name + " : " + device.ip
        })
        // find the device with ip, and set status to rebooting
        setDevices((prevDevices) => {
            // Create a new array by mapping over the previous state
            return prevDevices.map((prevDevice) => {
                if (prevDevice.ip === device.ip) {
                    // Return a new object with updated values
                    return {
                        ...prevDevice,
                        status: 'rebooting'
                    }
                }
                return prevDevice // No changes, return the device as is
            })
        })
        playerControl(device.ip, 'reboot', null)
    }

    return (
        <>
            <TableRow className={cn("hover:bg-transparent")} >
                <TableCell className="font-medium">
                    <div className="flex items-center">
                        <p>
                            {device.isMaster && <ChevronUp className={cn("h-6 w-6 duration-300 cursor-pointer hover:bg-primary/5 rounded-md m-2", isSlaveListOpen && "rotate-180")} onClick={() => setIsSlaveListOpen(!isSlaveListOpen)} />}
                        </p>
                        <p>{device.name}</p>
                        <AddPlayerToGroup ip={device.ip} />
                    </div>
                    <a
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => goToIpAddress(device.ip)}
                    >
                        {device.ip}
                    </a>
                </TableCell>
                <TableCell>
                    <div className="flex gap-1 items-center">

                        <Input
                            placeholder="API"
                            className="h-7 w-40"
                            value={api}
                            onChange={(e) =>
                                setApi(e.target.value)
                            }
                        />

                        <ApiListDropDown ip={device.ip} openApiCall={openApiCall} setApi={setApi} />

                        <Button
                            variant="outline"
                            className="h-7"
                            onClick={() => {
                                openApiCall(device.ip, api)
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
                            <DropdownMenuTrigger className=" outline outline-1 outline-offset-2 outline-accent mx-1 rounded-sm ">
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
                    <SyncStatus ip={device.ip} setDeviceGroupingStatus={setDeviceGroupingStatus} index={index} />
                </TableCell>
                <TableCell>
                    <PlayStatus ip={device.ip} />
                </TableCell>
                <TableCell className="text-center">
                    <p>{device.model}</p>
                    <p> {device.version}</p>
                </TableCell>
                <TableCell className="text-center">
                    <div className="flex flex-col gap-1 items-center">
                        <Button
                            onClick={upgradePlayer}
                            disabled={!version}
                        >
                            Upgrade
                        </Button>
                        <CheckUpgrade ip={device.ip} />
                    </div>
                </TableCell>
                <TableCell>
                    <Button onClick={rebootPlayer} variant="outline">Reboot</Button>
                </TableCell>
                <TableCell className="px-1 mx-1">
                    <Dialog>
                        <DialogTrigger className="text-red-300 duration-300 transition hover:text-red-600">
                            Reset
                        </DialogTrigger>
                        <DialogContent className="">
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
                                    onClick={() => playerControl(device.ip, 'factoryreset')}
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
                            <TableCell className="pl-12" key={slave.ip}>
                                <div className="flex gap-4 items-center">
                                    <CornerDownRight className="h-6 w-6" />
                                    <Button
                                        onClick={() => {
                                            removeFromGroup(slave)
                                        }}
                                        variant="outline"
                                    >Upgroup</Button>
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
                            <TableCell>
                            </TableCell>
                            <TableCell>
                                <SyncStatus ip={slave.ip} setDeviceGroupingStatus={setDeviceGroupingStatus} />
                            </TableCell>
                            <TableCell>
                                <PlayStatus ip={slave.ip} />
                            </TableCell>
                        </TableRow>)
                    }
                })

            )}
        </>
    )
}

export default Player