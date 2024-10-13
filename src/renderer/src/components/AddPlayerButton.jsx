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
      <DialogTrigger ><Button variant="ghost" size="icon"><CirclePlusIcon className="h-6 w-6" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to your player</DialogTitle>
          <DialogDescription>
            <ul className="list-disc list-inside space-y-1">
              <li>Put your player in hotspot mode</li>
              <li>Connect to the new Player through Wifi, a SSID that looks like <p className=" italic  bg-gray-200 w-fit rounded-sm px-1">PRODUCT NAME - XXXX</p></li>
              <li>Currently Connected Wifi: <p className={cn("inline  w-fit rounded-sm px-1.5 py-1", correctWifiFormat ? 'text-green-500 bg-green-200' : 'text-red-500 bg-red-200')}>{currentWifi}</p><p className="inline"></p></li>
              {correctWifiFormat ? <li>
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
              </li> :
                <li className="underline text-red-400">It does not seem like the player is connected. In order to setup the player, please connect to the hotspot.</li>
              }
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerButton
