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
import { CirclePlusIcon, Loader2, PlusCircle, XCircle } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useSetup } from '../context/setupContext'
import { Checkbox } from '@/components/ui/checkbox'

const AddPlayerButton = () => {
  const { setShouldRefresh } = useRefresh()
  const [bluosDevicesList, setBluosDevicesList] = useState([])
  const [wifiList, setWifiList] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [timer, setTimer] = useState(0)
  const {
    selectedWifi,
    setSelectedWifi,
    wifiPassword,
    setWifiPassword,
    setupMatrix,
    createMatrixAndStart,
    selectDevice,
    deselectDevice,
    inProgress,
    isDeviceSelected,
    currentConnectedWifi,
    addToAdditionalDevices,
    removeFromAdditionalDevices
  } = useSetup()

  const getWifi = async () => {
    const wifiList = await window.api.getWifiList()
    const allWifiList = wifiList.map((wifi) => {
      if (wifi.ssid.length === 0) { return null }
      return isWifiFormatCorrect(wifi.ssid, wifi.security) ? { ...wifi, correctFormat: true } : { ...wifi, correctFormat: false }
    }).filter((wifi) => wifi !== null)

    setBluosDevicesList(allWifiList.map((wifi) => wifi.correctFormat ? wifi : null).filter((wifi) => wifi !== null))
    setWifiList(allWifiList.map((wifi) => wifi.correctFormat ? null : wifi).filter((wifi) => wifi !== null))
  }

  const isWifiFormatCorrect = (ssid,security) => {
    if (!ssid || ssid === '') return false
    // * - XXXX
    if (ssid.split('-').length > 1 && ssid.split('-').length < 3 && ssid.split('-')[1].length === 4 && security === 'Open') {
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
      <DialogTrigger className="hover:bg-accent p-2 rounded-md ">
        <CirclePlusIcon className="h-6 w-6" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connect your player(s)</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p>Enable Hotspot Mode on your player.</p>
          <p> Currently Connected Wifi: {currentConnectedWifi ? currentConnectedWifi : 'None'}</p>
        </DialogDescription>

        <div className='w-full rounded-xl flex flex-col justify-center gap-1'>

          {!inProgress && <>
            {bluosDevicesList && bluosDevicesList.length > 0 ?
              bluosDevicesList.map((wifi) => {
                return (
                  <div className='w-full rounded-md p-3 cursor-pointer flex items-center gap-3 bg-accent ' key={wifi.ssid} onClick={() => isDeviceSelected(wifi.ssid) ? deselectDevice(wifi.ssid) : selectDevice(wifi.ssid)}>
                    <Checkbox checked={isDeviceSelected(wifi.ssid)} onCheckedChange={(e) => e ? selectDevice(wifi.ssid) : deselectDevice(wifi.ssid)} />
                    <p className='text-xl'>{wifi.ssid}</p>
                  </div>
                )
              }) : (
                <div className='flex flex-col items-center justify-center py-14'>
                  <Loader2 className='animate-spin size-12' />
                  <p className='text-xl'>
                    Searching For BluOS Device...  {timer}
                  </p>
                  <p className='text-xm text-primary/50'>
                    *If your device does not show, click on windows wifi button to enable wifi scan
                  </p>
                </div>
              )
            }
          </>}

          {
            inProgress && <div className='border border-accent rounded-md bg-accent px-2 py-1'>
              {bluosDevicesList && bluosDevicesList.filter((wifi) => !isDeviceSelected(wifi.ssid)).length > 0 ?
                bluosDevicesList.filter((wifi) => !isDeviceSelected(wifi.ssid)).map((wifi) => {
                  return (
                    <div className='w-full p-3 flex items-center gap-3' key={wifi.ssid}>
                      <PlusCircle className='w-4 h-4 cursor-pointer  text-primary/50 hover:text-primary' onClick={() => addToAdditionalDevices(wifi.ssid)} />
                      <p className='text-xl'>{wifi.ssid}</p>
                    </div>
                  )
                }) : <div className='flex items-center gap-2' ><Loader2 className='animate-spin size-6' />Searching for more BluOS Devices...</div>
              }
            </div >
          }

          {
            inProgress && setupMatrix && setupMatrix.length > 0 ? setupMatrix.map((device) => {
              return (
                <div className='flex gap-2 text-xs p-2 border border-accent rounded-md  bg-accent '>
                  <h3>{device.name}</h3>
                  <p>{device.ip}</p>
                  <p>{device.version}</p>
                  <p>{device.isConnected ? "Connected" : ""}</p>
                  <p>{device.isUpgraded ? 'Upgraded' : ''}</p>
                  <p>{device.isInitialized ? 'Initialized' : ''}</p>
                  <p>{device.isRebooted ? 'Rebooted' : ''}</p>
                  <p>{device.currentStatus}</p>
                  <XCircle className='w-4 h-4 cursor-pointer  text-primary/50 hover:text-red-500 duration-300 ease-in transition-colors' onClick={() => removeFromAdditionalDevices(device.name)} />
                </div>
              )
            }) : null
          }
        </div>

        {!inProgress &&
          <>
            {wifiList && wifiList.length > 0 ? <form className='w-full flex gap-2'>
              <Select value={selectedWifi} onValueChange={setSelectedWifi}  >
                <SelectTrigger className="w-fit min-w-40">
                  <SelectValue placeholder="Select Wifi" />
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
                  createMatrixAndStart()
                }}
              >
                Connect
              </Button>
            </form> : <p>
              Looking for available Wifi Network...
            </p>
            }
          </>}
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayerButton
