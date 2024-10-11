import React, { useState } from 'react'
import { useTable } from '../context/tableContext'
import { useDevices } from '../context/devicesContext'
import { playerControl } from '../lib/utils'
import { Button } from '@/components/ui/button'
import ApiListDropDown from './ApiListDropDown'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { RefreshCcw } from 'lucide-react'

const Footer = () => {
    const { version, setVersion } = useTable()
    const [apiCommand, setApiCommand] = useState('')
    const { devices, selectedDevices } = useDevices()

    const {toast} = useToast()

    const runCommandForDevices = (IPs, command, param) => {
        for (const IP of IPs) {
            playerControl(IP, command, param)
        }
    }


    const upgradeAllPlayers = () => {
        for (const device of devices) {
            // playerControl(device.ip, 'upgrade', version)
            toast({
                title: 'Upgrade All Players',
                description: `Upgrading All ${devices.length} Players to ${version}`,
                status: 'success',
            })
        }
    }

    const rebootAllPlayers = () => {
        for (const device of devices) {
            playerControl(device.ip, 'reboot', null)
            toast({
                title: 'Reboot All Players',
                description: `Rebooting All ${devices.length} Players`,
                status: 'success',
            })
        }
    }

    return (
        <div
            className='fixed bottom-0 flex h-36 w-full items-center justify-center text-sm text-foreground px-10 bg-background'
        ><div className='w-full border-foreground h-full px-2 bg-background'>

                <div className='flex h-full items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                        <p className='text-foreground text-lg'>
                            {selectedDevices.length} of {devices.length} Device(s) selected
                        </p>
                        <RefreshCcw className='h-4 w-4 cursor-pointer' onClick={() => window.location.reload()} />
                    </div >
                    <div className='flex justify-end gap-x-4'>

                        <div className='flex'>
                            <div className='flex flex-col gap-y-1 border-r mx-2 px-2'>
                                <Label htmlFor="apiCommand">API Command</Label>
                                <div className='flex items-start space-x-2'>
                                    <div className='flex  items-center'>
                                        <Input onChange={(e) => setApiCommand(e.target.value)} value={apiCommand} className="h-8" placeholder="/api" />
                                        <ApiListDropDown setApi={setApiCommand} />
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        <Button variant="outline" onClick={() => runCommandForDevices(selectedDevices, apiCommand, apiCommand)} className="h-8" disabled={selectedDevices.length === 0}>
                                            Run Command for Selected
                                        </Button>
                                        <Button variant="outline" onClick={() => runCommandForDevices(devices, apiCommand, apiCommand)} className="h-8" disabled={devices.length === 0}>
                                            Run Command for All
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-y-1 mx-2 px-2'>
                                <Label htmlFor="version">Reboot</Label>
                                <Button disabled={selectedDevices.length === 0} onClick={() => runCommandForDevices(selectedDevices, 'reboot')} className="h-8">
                                    Reboot Selected
                                </Button>
                                <Button className="h-8" disabled={devices.length === 0} onClick={() => rebootAllPlayers()}>Reboot All</Button>
                            </div>

                            <div className='flex flex-col gap-y-1 mx-2 px-2 border-l'>
                                <Label htmlFor="version">Upgrade</Label>
                                <div className='flex items-start space-x-2'>
                                    <Input onChange={(e) => setVersion(e.target.value)} value={version} className="h-8" placeholder="version" />
                                    <div className='flex flex-col gap-y-1'>
                                        <Button className="h-8" disabled={selectedDevices.length === 0 || version.length === 0} onClick={() => runCommandForDevices(selectedDevices, 'update', version)}>
                                            Updated Selected
                                        </Button>
                                        <Button className="h-8" disabled={devices.length === 0 || version.length === 0} onClick={upgradeAllPlayers}>Update All</Button>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div></div>
    )
}

export default Footer