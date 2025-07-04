import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  ChevronDownIcon,
  SquareArrowOutUpRightIcon,
  PlusIcon,
  MinusIcon,
  InfoIcon,
  ArrowUp,
  Send,
  Download
} from 'lucide-react'
import { commandList } from '../lib/constants'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Separator } from '@/components/ui/separator'
import { useStorage } from '../context/localStorageContext'
import { runCommandForDevice } from '../lib/utils'
import { toast } from '@/hooks/use-toast'

const ApiListDropDown = ({ ip, openApiCall, setApi, footer }) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { customApiList, addToCustomApiList, removeFromCustomApiList } = useStorage()
  const [newCommandName, setNewCommandName] = useState('')
  const [newCommand, setNewCommand] = useState('')

  const handleDownloadButton = async (ip, command) => {
    const res = await runCommandForDevice(ip, command)
    const parser = new DOMParser()
    const document = parser.parseFromString(res.data, 'text/html')

    // Convert document to a string if necessary
    const htmlString = new XMLSerializer().serializeToString(document)

    try {
      // Send the content to Electron to trigger the save dialog
      const filePath = await window.api.saveFile(htmlString)
      if (filePath) {
        console.log(`File saved to: ${filePath}`)
      }
    } catch (error) {
      console.error('Failed to save file:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" outline outline-1 outline-offset-2 outline-accent mx-1 rounded-sm">
        <ChevronDownIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[50vh] overflow-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <p> Custom Commands</p>
          <div className="space-x-1">
            <button
              className={cn(
                'p-1 hover:bg-accent rounded-sm',
                isEditMode ? 'bg-accent' : 'bg-transparent'
              )}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger
                className={cn(
                  'p-1 hover:bg-accent rounded-sm',
                  isOpen ? 'bg-accent' : 'bg-transparent'
                )}
              >
                <PlusIcon className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverContent align="start">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Add Command</h3>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="h-5 w-5" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <h4 className="text-lg font-medium">Example 1</h4>
                      <p className="my-1">
                        Name:{' '}
                        <span className="italic bg-accent px-1 py-0.5 rounded-md">
                          Enable Upgrade Popup
                        </span>
                      </p>
                      <p>
                        Command:{' '}
                        <span className="italic bg-accent px-1 py-0.5 rounded-md">
                          /enable?no_upgrade=yes
                        </span>
                      </p>

                      <h4 className="text-lg font-medium pt-4">Example 2</h4>
                      <p className="my-1">
                        Name:{' '}
                        <span className="italic bg-accent px-1 py-0.5 rounded-md">Status</span>
                      </p>
                      <p>
                        Command:{' '}
                        <span className="italic bg-accent px-1 py-0.5 rounded-md">
                          :11000/Status
                        </span>
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <Label className="text-base font-medium">Name </Label>
                  <Input
                    value={newCommandName}
                    onChange={(e) => setNewCommandName(e.target.value)}
                    placeholder="Enable Upgrade Popup"
                    className="text-primary placeholder:text-primary/30"
                  />
                  <Label className="text-base font-medium flex items-center space-x-2">
                    <p>Command</p>
                  </Label>
                  <Input
                    value={newCommand}
                    onChange={(e) => setNewCommand(e.target.value)}
                    placeholder="/enable?no_upgrade=yes"
                    className="text-primary placeholder:text-primary/30"
                  />
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        addToCustomApiList({ name: newCommandName, command: newCommand })
                      }
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {customApiList.length === 0 ? (
          <DropdownMenuItem className="hover:bg-transparent flex items-center justify-between">
            <p className=" text-center flex-1">Click "+" to add</p>
            <ArrowUp className="h-4 w-4 mr-1" />
          </DropdownMenuItem>
        ) : (
          <>
            {customApiList.map((command, index) => (
              <div className="flex items-center " key={command.command}>
                {isEditMode && (
                  <div className="w-5 h-5  flex items-center justify-center">
                    <MinusIcon
                      onClick={() => {
                        removeFromCustomApiList(index)
                      }}
                      className="h-4 w-4 dark:bg-red-800 bg-red-500 hover:bg-red-700 dark:hover:bg-red-700 rounded-full  text-white cursor-pointer"
                    />
                  </div>
                )}
                <DropdownMenuItem
                  className=" w-full"
                  key={command.command}
                  onClick={() => setApi(command.command)}
                >
                  <p>{command.name}</p>
                </DropdownMenuItem>
                {!footer && (
                  <Button
                    variant="ghost"
                    className="px-2 ml-1"
                    onClick={() => {
                      openApiCall(ip, command.command)
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </>
        )}
        <>
          <DropdownMenuLabel
            className="flex items-center justify-between mt-2"
            onClick={() => setIsOpen(true)}
          >
            Default Commands
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {commandList.map((command) => (
            <div className={cn('', footer ? '' : 'flex items-center ')} key={command.command}>
              <DropdownMenuItem
                key={command}
                onClick={() => setApi('API:' + command.name)}
                className=" w-full"
              >
                <p>{command.name}</p>
              </DropdownMenuItem>

              {!footer && (
                <>
                  {command.download ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-1"
                      onClick={() => {
                        handleDownloadButton(ip, command.command)
                        toast({
                          title: 'Downloading Result',
                          description: `Downloading ${command.name} on ${ip}, it may take a few seconds...`,
                          status: 'success'
                        })
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      runCommandForDevice(ip, command.command)
                      toast({
                        title: 'Running Command',
                        description: `Running Command ${command.name} on ${ip}`,
                        status: 'success'
                      })
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ApiListDropDown
