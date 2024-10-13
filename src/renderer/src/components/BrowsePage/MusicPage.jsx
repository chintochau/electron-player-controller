import React, { useEffect, useState } from 'react'
import { useDevices } from '../../context/devicesContext'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Loader2, SearchIcon } from 'lucide-react'
import { Input } from '../../../../components/ui/input'
import ServiceMenuList from './ServiceMenuList'
import { useBrowsing } from '../../context/borwsingContext'
import { getMusicServiceString } from '../../lib/utils'
import JsonView from 'react18-json-view'

import 'react18-json-view/src/style.css'
import { Button } from '../../../../components/ui/button'

const MusicPage = () => {
  const { devices } = useDevices()
  const {
    url,
    setUrl,
    serviceSubMenus,
    serviceList,
    loadSDUI,
    loadServiceList,
    loadSubmenuForService,
    selectedPlayer,
    setSelectedPlayer,
    screen, setScreen
  } = useBrowsing()

  const [selectedService, setSelectedService] = useState('Tidal')

  const loadMainScreen = async (uri) => {
    const response = await loadSDUI(uri, true)
    if (!response) {
      return
    }
    if (response && response.screen) {
      setScreen(response.screen)
    }
  }

  useEffect(() => {
    if (serviceList.length === 0) {
      loadServiceList()
    }
  }, [selectedPlayer])

  useEffect(() => {
    loadSubmenuForService(selectedService)
  }, [selectedService])

  const submenu = serviceSubMenus[selectedService]
  return (
    <ScrollArea className="w-full h-full p-4 overflow-x-hidden">
      <div id="urlBar" className="flex items-center justify-between sticky top-0 z-50">
        <Select
          value={selectedPlayer && selectedPlayer.mac}
          onValueChange={(value) =>
            setSelectedPlayer(devices.find((device) => device.mac === value))
          }
        >
          <SelectTrigger className="w-fit h-14 m-1 border-none">
            <SelectValue placeholder="Player" />
          </SelectTrigger>
          <SelectContent>
            {devices &&
              devices.map((device) => {
                return (
                  <SelectItem key={device.mac} value={device.mac}>
                    <div className="flex flex-col items-start text-left">
                      <p>{device.name}</p>
                      <p>{device.ip}</p>
                    </div>
                  </SelectItem>
                )
              })}
          </SelectContent>
        </Select>
        <form className="flex-auto w-96  flex items-center">
          <Input
            className="rounded-l-full"
            placeholder="path"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            variant="outline"
            className="rounded-r-full"
            onClick={(e) => {
              e.preventDefault()
              loadMainScreen(url)
            }}
          >
            Load
          </Button>
        </form>
        <div className="flex items-center gap-2 ml-4 flex-auto w-20 max-w-[400px]">
          <SearchIcon className="w-4 h-4" />
          <Input className="w-full rounded-full" placeholder="Search" />
        </div>
      </div>

      <div className="hidden xl:block">
        <ServiceMenuList musicServiceList={serviceList} />
      </div>

      <div id="musicPageControlBar" className="flex items-center flex-wrap xl:hidden ">
        <Select
          defaultValue="TIDAL"
          onValueChange={(value) => {
            loadSubmenuForService(value)
            setSelectedService(getMusicServiceString(value))
          }}
        >
          <SelectTrigger className="w-fit h-8 m-1 border-none">
            <SelectValue placeholder="Music Service" />
          </SelectTrigger>
          <SelectContent>
            {serviceList.map((service) => {
              return (
                <SelectItem value={service.name} key={service.name}>
                  <div className="flex items-center gap-2 ">
                    <div className="w-6 h-6">
                      <img src={service.iconSrc} />
                    </div>
                    <p>{service.name}</p>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {submenu && submenu.screen.$.service && (
          <div className="flex justify-start items-center gap-2 flex-wrap pl-4">
            {submenu && submenu.screen && submenu.screen.row && (
              <>
                {submenu.screen.row.map((row) => {
                  return (
                    <Button className="text-sm" variant="outline" size="sm" key={row.$.title}>
                      {row.$.title}
                    </Button>
                  )
                })}
              </>
            )}
            {submenu && submenu.screen && submenu.screen.list && (
              <>
                {submenu.screen.list.map((list) => {
                  return (
                    <div
                      className="flex justify-start items-center gap-2 flex-wrap"
                      key={list.$.id}
                    >
                      {list &&
                        list.item &&
                        list.item.map((item) => {
                          return (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-sm"
                              key={item.$.title}
                            >
                              {item.$.title}
                            </Button>
                          )
                        })}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}
      </div>
      <div>
        <JsonView src={screen} className="text-sm" />
      </div>
    </ScrollArea>
  )
}

export default MusicPage

const demoDFata = {}
