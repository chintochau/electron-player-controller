// device = { name, ip, mac, model, version, room, status, isMaster, isSlave, master, slave }
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDownIcon, MoreHorizontal } from "lucide-react"
import SettingsMenu from "../SettingsMenu"
import PlayStatus from "../PlayStatus"
import SyncStatus from "../SyncStatus"
import { useStorage } from "../../context/localStorageContext"
import { useDevices } from "../../context/devicesContext"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import ApiListDropDown from "../ApiListDropDown"
import { useTable } from "../../context/tableContext"
import CheckUpgrade from "../CheckUpgrade"
import { playerControl } from "../../lib/utils"
import { useToast } from "@/hooks/use-toast"
import { goToIpAddress } from "../PlayList"

export const columns = [
    {
        id: "name",
        header: "Name",
        cell: ({ row }) => {
            const device = row.original
            return (
                <div className="">
                    <p>{device.name}</p>
                    <a
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => goToIpAddress(device.ip)}
                    >
                        {device.ip}
                    </a>
                </div>
            )
        },
    },

    {
        id: "room",
        header: "Room",
        cell: ({ row }) => {
            const { roomList, saveRoomForMac } = useStorage()
            const { setDevices } = useDevices()
            const device = row.original
            return (
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
            )
        },
    }, {
        id: "api",
        header: "API",
        cell: ({ row }) => {
            const [api, setApi] = useState('')
            const device = row.original
            const openApiCall = (ip, command) => {
                try {

                    window.open(`http://${ip}${command}`, '_blank')
                } catch (error) {
                    toast({
                        title: 'Error',
                        description: 'Invalid Command:' + command,
                    })
                }
            }
            return (
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
            )
        },
    }, {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            const device = row.original
            return (
                <div className="text-center">
                    <SyncStatus ip={device.ip} />
                </div>
            )
        },
    },
    {
        id: "playStatus",
        header: "Play Status",
        cell: ({ row }) => {
            const device = row.original
            return (
                <div className=" flex justify-center mx-auto">
                    <PlayStatus ip={device.ip} />
                </div>
            )
        },

    },
    {
        id: "version",
        header: "Model: Version",
        cell: ({ row }) => {
            const device = row.original
            return (
                <div className="text-center">
                    <p>{device.model}</p>
                    <p>{device.version}</p>
                </div>
            )
        },
    }, {
        id: "upgrade", header: "Upgrade",
        cell: ({ row }) => {
            const device = row.original
            const { version } = useTable()
            const upgradePlayer = () => {
                playerControl(device.ip, 'upgrade', version)
                updateDeviceStatus(device.ip, 'upgrading')
                toast({
                    title: 'Player Upgrade',
                    description: 'Upgrading Player: ' + device.name + " : " + device.ip
                })
            }
            return (
                <div className="flex flex-col gap-1 items-center">
                    <Button
                        onClick={upgradePlayer}
                        disabled={!version}
                    >
                        Upgrade
                    </Button>
                    <CheckUpgrade ip={device.ip} />
                </div>
            )
        }
    }, {
        id: "reboot", header: "Reboot",

        cell: ({ row }) => {
            const device = row.original
            const { toast } = useToast()
            const { setDevices } = useDevices()
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
                    <Button onClick={rebootPlayer} variant="outline">Reboot</Button>
                </div>
            )
        },
    }, {
        id: "actions",
        cell: ({ row }) => {
            const device = row.original

            return (
                <div className="text-center">
                    <SettingsMenu ip={device.ip} />
                </div>
            )
        },
    },
]