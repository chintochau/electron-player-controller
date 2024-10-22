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
import { CirclePlusIcon, Loader2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'

const AddPlayerButton = () => {
  const { shouldRefresh, setShouldRefresh } = useRefresh()
  const [currentWifi, setCurrentWifi] = useState('')
  const [correctWifiFormat, setCorrectWifiFormat] = useState(false)
  const [wifiList, setWifiList] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const [timer, setTimer] = useState(0)

  const getWifi = async () => {
    const wifiList = await window.api.getWifiList()
    setWifiList(wifiList.map((wifi) => {
      return isWifiFormatCorrect(wifi.ssid) ? wifi.ssid : null
    }).filter((wifi) => wifi !== null)
    )
  }

  const isWifiFormatCorrect = (ssid) => {
    if (!ssid || ssid === '') return false
    // * - XXXX
    if (ssid.split(' - ').length > 1 && ssid.split(' - ')[1].length === 4) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (isOpen) {
      const intervalId = setInterval(getWifi, 5000)
      // update timer each second
      const intervalId2 = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1)
      }, 1000)
      return () => {
        clearInterval(intervalId)
        clearInterval(intervalId2)
        setTimer(0)
      }
    }
  }, [isOpen])
  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open)
        if (open) {
          setShouldRefresh(false)
        } else {
          setShouldRefresh(true)
        }
      }}
      open={isOpen}
    >
      <DialogTrigger className="hover:bg-accent p-2 rounded-md">
        <CirclePlusIcon className="h-6 w-6" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to your player</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enable Hotspot Mode on your player.
        </DialogDescription>
        <div className='w-full bg-accent rounded-xl flex flex-col items-center justify-center'>
          {wifiList && wifiList.length > 0 ?
            wifiList.map((wifi) => {
              return (
                <li key={wifi.ssid}>
                  {wifi.ssid}
                </li>
              )
            }) : (
              <div className='flex flex-col items-center justify-center py-14'>
                <Loader2 className='animate-spin size-14' />
                <p className='text-xl'>
                  Searching For BluOS Device...
                </p>
                {timer && <p>{timer}
                </p>}
              </div>
            )
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerButton
