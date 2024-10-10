import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ChevronDownIcon,
    SquareArrowOutUpRightIcon,
    PlusIcon,
    MinusIcon
} from 'lucide-react'
import { commandList } from '../lib/constants'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'


const ApiListDropDown = ({ ip, openApiCall, setApi }) => {

    const [isEditMode, setIsEditMode] = useState(false)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className=" outline outline-1 outline-offset-2 outline-accent mx-1 rounded-sm">
                <ChevronDownIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="flex items-center justify-between"><p>Commands</p>
                    <div className='space-x-1'>
                        <button className={cn('p-1 hover:bg-accent rounded-sm', isEditMode ? "bg-accent" : "bg-transparent")}
                            onClick={() => setIsEditMode(!isEditMode)}
                        ><MinusIcon className="h-4 w-4" /></button>
                        <Popover>
                            <PopoverTrigger><PlusIcon className="h-4 w-4" /></PopoverTrigger>
                            <PopoverContent>

                                <h3>Add Command</h3>
                                <Label className="text-sm font-medium">Name</Label>
                                <Input className="" />

                                <Label className="text-sm font-medium">Command</Label>
                                <Input className="" placeholder="ex: /reboot or :11000/Status" />

                            </PopoverContent>
                        </Popover>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {commandList.map((command) => (
                    <div className="flex items-center " key={command.command}>
                        {isEditMode &&
                            <MinusIcon className="h-4 w-4 dark:bg-red-800 bg-red-500 hover:bg-red-700 dark:hover:bg-red-700 rounded-full  text-white mx-1 cursor-pointer" />
                        }
                        <DropdownMenuItem
                            key={command}
                            onClick={() =>
                                setApi(command.command)
                            }
                        >

                            <p>{command.name}</p>
                        </DropdownMenuItem>
                        <Button
                            variant="ghost"
                            className="px-2 ml-1"
                            onClick={() => {
                                openApiCall(ip, command.command)
                            }}
                        >
                            <SquareArrowOutUpRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

export default ApiListDropDown