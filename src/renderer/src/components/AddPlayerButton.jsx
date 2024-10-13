import React, { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useRefresh } from '../context/refreshContext'
import { cn } from '@/lib/utils'
import { CirclePlusIcon } from 'lucide-react'
import { Button } from '../../../components/ui/button'

const AddPlayerButton = () => {
  const { shouldRefresh, setShouldRefresh } = useRefresh()
  const [currentWifi, setCurrentWifi] = useState('')
  const [correctWifiFormat, setCorrectWifiFormat] = useState(false)

  const getWifi = async () => {
    const wifi = await window.api.getCurrentWifi()
    setCurrentWifi(wifi)
    checkWifiFormat(wifi)
  }

  useEffect(() => {
    getWifi()
  }, [])

  const checkWifiFormat = (ssid) => {
    if (!ssid) return
    // * - XXXX
    if (ssid.split(' - ').length > 1 && ssid.split(' - ')[1].length === 4) {
      setCorrectWifiFormat(true)
    } else {
      setCorrectWifiFormat(false)
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setShouldRefresh(false)
        } else {
          setShouldRefresh(true)
        }
      }}
    >
      <DialogTrigger className="hover:bg-accent p-2 rounded-md">
        <CirclePlusIcon className="h-6 w-6" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to your player</DialogTitle>
          <DialogDescription></DialogDescription>
          <ul className="list-disc list-inside space-y-2">
            <li>Enable Hotspot Mode on your player.</li>
            <li>Connect to the Player’s Wi-Fi: </li>
            <li>
              Look for a Wi-Fi network (SSID) named{' '}
              <span className=" italic bg-primary/40 w-fit rounded-sm px-1">
                PRODUCT NAME - XXXX
              </span>{' '}
              in your Wi-Fi settings and connect to it.
            </li>
            <li>
              Currently Connected Wifi:
              <p
                className={cn(
                  'inline  w-fit rounded-sm px-1.5 py-1',
                  correctWifiFormat ? 'text-green-500 bg-green-200' : 'text-red-500 bg-red-100'
                )}
              >
                {currentWifi || 'Not Connected'}
              </p>
              <p className="inline"></p>
            </li>
            {correctWifiFormat ? (
              <li>
                Click{' '}
                <button
                  className="underline text-blue-500"
                  onClick={
                    // open http://10.1.2.3/wificfg
                    () => {
                      window.open(`http://10.1.2.3/wificfg`, '_blank')
                    }
                  }
                >
                  here
                </button>{' '}
                to setup the WiFi.
              </li>
            ) : (
              <li className="underline text-red-400">
                It seems you’re not connected to the player yet. Please connect to the player by following the steps above.
              </li>
            )}
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerButton
