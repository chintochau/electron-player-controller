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
import { mapCommandByName } from '../lib/constants'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import Markdown from 'markdown-to-jsx'
import { ScrollArea } from '@/components/ui/scroll-area'

const Footer = ({ isCollapsed }) => {
  const { version, setVersion } = useTable()
  const [apiCommand, setApiCommand] = useState('')
  const { devices, selectedDevices, refreshDevices, updateDeviceStatus } = useDevices()
  const [appVersion, setAppVersion] = useState()

  const [upgradeMessage, setUpgradeMessage] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [downloadingUpdate, setDownloadingUpdate] = useState(false)
  const [releaseNotes, setReleaseNotes] = useState(null)

  const getAppVersion = async () => {
    const version = await window.api.getAppVersion()
    setAppVersion(version)
  }

  useEffect(() => {
    getAppVersion()
    checkForAppUpdate()
  }, [])

  const checkForAppUpdate = async () => {
    const message = await window.api.checkForAppUpdate()
    setUpgradeMessage(message?.message)
    setReleaseNotes(message?.releaseNotes)
  }

  const performAppUpdate = async () => {
    setUpgradeMessage('Downloading Update...')
    setDownloadingUpdate(true)
    const messaage = await window.api.performAppUpdate()
  }

  const [requestType, setRequestType] = useState('GET')
  const { toast } = useToast()

  const runCommandForDevices = () => {
    const command = mapCommandByName(apiCommand)

    for (const IP of selectedDevices) {
      runCommandForDevice(IP, command, requestType)
      updateDeviceStatus(IP, `running ${command}`)
    }
    toast({
      title: 'Run Command For Devices',
      description: `Running Command ${apiCommand} on ${selectedDevices.length} Devices`,
      status: 'success'
    })
  }

  const runCommandOnAllDevices = () => {
    const command = mapCommandByName(apiCommand)

    for (const device of devices) {
      runCommandForDevice(device.ip, command, requestType)
      updateDeviceStatus(device.ip, `running ${command}`)
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
        'flex h-32 w-full items-center justify-center text-sm text-foreground duration-300 ease-in absolute bottom-0 border-t',
        isCollapsed ? ' translate-y-full fixed' : ''
      )}
    >
      <div className="w-full border-foreground h-full px-6 bg-background">
        <div className="flex h-full items-center justify-between gap-8">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <p className="text-foreground text-xs sm:text-sm md:text-lg">
                {selectedDevices.length} of {devices.length} Device(s) selected
              </p>
              <RefreshCcw
                className="h-4 w-4 min-w-4 cursor-pointer duration-300 hover:animate-spin"
                onClick={refreshDevices}
              />
            </div>
            <p className="text-xs text-muted-foreground">v{appVersion}</p>
            {upgradeMessage && (
              <div className="flex gap-2 items-center pt-1">
                <p className="text-xs text-muted-foreground">{upgradeMessage}</p>
                {!downloadingUpdate && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger className="text-left w-fit hover:underline hover:text-primary text-primary/40 text-xs">
                      Update Now
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>App Update</DialogTitle>
                        <DialogDescription>
                          Do you want to update now?
                          <br /> This will automatically download and install the latest version.
                          {releaseNotes && (
                            <ScrollArea className="h-96 pt-4 rounded-md bg-gray-800/70 p-2 mt-2">
                              <Markdown className="prose prose-invert">{releaseNotes}</Markdown>
                            </ScrollArea>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" size="sm" onClick={performAppUpdate}>
                          Update Now
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <div className="flex gap-4">
              <div className="flex flex-col gap-y-2 pr-6 border-r">
                <Label htmlFor="apiCommand">API Command</Label>
                <div className="flex items-start gap-3">
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
                          <SelectTrigger className="h-8 mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-2">
                        <ApiListDropDown setApi={setApiCommand} footer={true} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
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

              <div className="flex flex-col gap-y-2 px-6 border-r">
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

              <div className="flex flex-col gap-y-2 pl-6">
                <Label htmlFor="version">Upgrade</Label>
                <div className="flex items-start gap-3">
                  <Input
                    onChange={(e) => setVersion(e.target.value)}
                    value={version}
                    className="h-8"
                    placeholder="version"
                  />
                  <div className="flex flex-col gap-y-2">
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
