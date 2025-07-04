import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useDevices } from '../context/devicesContext'

const CheckUpgrade = ({ ip }) => {
  const [upgradeResponse, setUpgradeResponse] = useState({})
  const [checking, setChecking] = useState(false)
  const [open, setOpen] = useState(false)
  const { updateDeviceStatus } = useDevices()
  const checkUpgrade = async (ip) => {
    setChecking(true)
    const res = await window.api.checkUpgrade(ip)
    setUpgradeResponse(res)
    setChecking(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (open) {
          checkUpgrade(ip)
        }
      }}
    >
      <DialogTrigger className="text-sm hover:text-blue-500">Check</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checking for updates</DialogTitle>
          <DialogDescription>
            {checking ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              </div>
            ) : upgradeResponse?.available === 'true' ? (
              <div className="space-y-2">
                <p className="text-lg">BluOS version: {upgradeResponse?.version} is available</p>
                <Button
                  onClick={() => {
                    window.api.playerControl(ip, 'upgrade', upgradeResponse?.version)
                    setOpen(false)
                    updateDeviceStatus(ip, 'upgrading')
                  }}
                >
                  Update Now
                </Button>
              </div>
            ) : (
              <div className="">
                <p className="text-lg">Player is up to date</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CheckUpgrade
