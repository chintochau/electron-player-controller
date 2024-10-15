import React, { useEffect, useState } from 'react'
import { useTable } from '../context/tableContext'
import { useDevices } from '../context/devicesContext'
import { cn, playerControl, runCommandForDevice } from '../lib/utils'
import { Button } from '@/components/ui/button'
import ApiListDropDown from './ApiListDropDown'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { RefreshCcw } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const Footer = ({ isCollapsed }) => {
  const { version, setVersion } = useTable()
  const [apiCommand, setApiCommand] = useState('')
  const { devices, selectedDevices, refreshDevices, updateDeviceStatus } = useDevices()
  const [requestType, setRequestType] = useState('GET')

  const { toast } = useToast()

  const runCommandForDevices = () => {
    for (const IP of selectedDevices) {
      runCommandForDevice(IP, apiCommand, requestType)
      updateDeviceStatus(IP, `running ${apiCommand}`)
    }
    toast({
      title: 'Run Command For Devices',
      description: `Running Command ${apiCommand} on ${selectedDevices.length} Devices`,
      status: 'success'
    })
  }

  const runCommandOnAllDevices = () => {
    for (const device of devices) {
      runCommandForDevice(device.ip, apiCommand, requestType)
      updateDeviceStatus(device.ip, `running ${apiCommand}`)
    }
    toast({
      title: 'Run Command On All Devices',
      description: `Running Command ${apiCommand} on ${devices.length} Devices`,
      status: 'success'
    })
  }

  const upgradeAllPlayers = () => {
    for (const device of devices) {
      playerControl(device.ip, 'upgrade', version)
      updateDeviceStatus(device.ip, 'upgrading')
    }

    toast({
      title: 'Upgrade All Players',
      description: `Upgrading All ${devices.length} Players to ${version}`,
      status: 'success'
    })
  }

  const upgradeSelectedPlayers = () => {
    for (const device of selectedDevices) {
      playerControl(device, 'upgrade', version)
      updateDeviceStatus(device, 'upgrading')
    }
    toast({
      title: 'Upgrade Selected Players',
      description: `Upgrading ${selectedDevices.length} Selected Players`,
      status: 'success'
    })
  }

  const rebootSelectedPlayers = () => {
    for (const device of selectedDevices) {
      playerControl(device, 'reboot', null)
      updateDeviceStatus(device, 'rebooting')
    }
    toast({
      title: 'Reboot Selected Players',
      description: `Rebooting ${selectedDevices.length} Selected Players`,
      status: 'success'
    })
  }

  const rebootAllPlayers = () => {
    for (const device of devices) {
      playerControl(device.ip, 'reboot', null)
      updateDeviceStatus(device.ip, 'rebooting')
    }
    toast({
      title: 'Reboot All Players',
      description: `Rebooting All ${devices.length} Players`,
      status: 'success'
    })
  }

  return (
    <div
      className={cn(
        'flex h-36 w-full items-center justify-center text-sm text-foreground duration-300 ease-in absolute bottom-0 pl-4 lg:px-10',
        isCollapsed ? ' translate-y-full fixed' : ''
      )}
    >
      <div className="w-full border-foreground h-full px-2 bg-background">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-foreground text-lg">
              {selectedDevices.length} of {devices.length} Device(s) selected
            </p>
            <RefreshCcw
              className="h-4 w-4 cursor-pointer duration-300 hover:animate-spin"
              onClick={refreshDevices}
            />
          </div>
          <div className="flex justify-end gap-x-4">
            <div className="flex">
              <div className="flex flex-col gap-y-1 border-r mx-2 px-2">
                <Label htmlFor="apiCommand">API Command</Label>
                <div className="flex items-start space-x-2">
                  <div className="flex flex-col">
                    <div className="flex  items-start">
                      <div className="flex flex-col">
                        <Input
                          onChange={(e) => setApiCommand(e.target.value)}
                          value={apiCommand}
                          className="h-8"
                          placeholder="/api"
                        />
                        <Select
                          onValueChange={(value) => setRequestType(value)}
                          value={requestType}
                        >
                          <SelectTrigger className="h-8 my-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-2 px-1">
                        <ApiListDropDown setApi={setApiCommand} footer={true} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <Button
                      variant="outline"
                      onClick={() => runCommandForDevices(selectedDevices, apiCommand, apiCommand)}
                      className="h-8"
                      disabled={selectedDevices.length === 0}
                    >
                      Run Command for Selected
                    </Button>
                    <Button
                      onClick={runCommandOnAllDevices}
                      className="h-8"
                      disabled={devices.length === 0}
                    >
                      Run Command for All
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-1 mx-2 px-2">
                <Label htmlFor="version">Reboot</Label>
                <Button
                  disabled={selectedDevices.length === 0}
                  onClick={rebootSelectedPlayers}
                  variant="outline"
                  className="h-8"
                >
                  Reboot Selected
                </Button>
                <Button className="h-8" disabled={devices.length === 0} onClick={rebootAllPlayers}>
                  Reboot All
                </Button>
              </div>

              <div className="flex flex-col gap-y-1 mx-2 px-2 border-l">
                <Label htmlFor="version">Upgrade</Label>
                <div className="flex items-start space-x-2">
                  <Input
                    onChange={(e) => setVersion(e.target.value)}
                    value={version}
                    className="h-8"
                    placeholder="version"
                  />
                  <div className="flex flex-col gap-y-1">
                    <Button
                      variant="outline"
                      className="h-8"
                      disabled={selectedDevices.length === 0 || version.length === 0}
                      onClick={upgradeSelectedPlayers}
                    >
                      Updated Selected
                    </Button>
                    <Button
                      className="h-8"
                      disabled={devices.length === 0 || version.length === 0}
                      onClick={upgradeAllPlayers}
                    >
                      Update All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
