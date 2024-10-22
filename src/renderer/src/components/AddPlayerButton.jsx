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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const AddPlayerButton = () => {
  const { shouldRefresh, setShouldRefresh } = useRefresh()
  const [bluosDevicesList, setBluosDevicesList] = useState([])
  const [wifiList, setWifiList] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [timer, setTimer] = useState(0)

  const [selectedWifi, setSelectedWifi] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')

  const getWifi = async () => {
    const wifiList = await window.api.getWifiList()
    const allWifiList = wifiList.map((wifi) => {
      if (wifi.ssid.length === 0) { return null }
      return isWifiFormatCorrect(wifi.ssid) ? { ...wifi, correctFormat: true } : { ...wifi, correctFormat: false }
    }).filter((wifi) => wifi !== null)

    setBluosDevicesList(allWifiList.map((wifi) => wifi.correctFormat ? wifi : null).filter((wifi) => wifi !== null))
    setWifiList(allWifiList.map((wifi) => wifi.correctFormat ? null : wifi).filter((wifi) => wifi !== null))
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
          <DialogTitle>Connect your player(s)</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enable Hotspot Mode on your player.
        </DialogDescription>
        <div className='w-full bg-accent rounded-xl flex flex-col justify-center'>
          {bluosDevicesList && bluosDevicesList.length > 0 ?
            bluosDevicesList.map((wifi) => {
              return (
                <div className='w-full' key={wifi.ssid}>
                  {wifi.ssid}
                </div>
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
        {wifiList && wifiList.length > 0 ? <form className='w-full flex gap-2'>
          <Select value={selectedWifi} onValueChange={setSelectedWifi}  >
            <SelectTrigger className="w-fit min-w-40">
              <SelectValue placeholder="Select Wifi"/>
            </SelectTrigger>
            <SelectContent>
              {
                wifiList.map((wifi) => {
                  return (
                    <SelectItem key={wifi.ssid} value={wifi.ssid}>
                      {wifi.ssid}
                    </SelectItem>
                  )
                })
              }
            </SelectContent>
          </Select>
          <Input
            value={wifiPassword}
            onChange={(e) => setWifiPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="flex-1 w-40"
          /><Button
            type="submit"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            Connect
          </Button>
        </form> : <p>
          Looking for available Wifi Network...
        </p>
        }
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerButton
