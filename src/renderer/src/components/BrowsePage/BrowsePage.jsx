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
import JsonView from 'react18-json-view'

import 'react18-json-view/src/style.css'
import { Button } from '../../../../components/ui/button'
import XMLViewer from 'react-xml-viewer'

const BrowsePage = () => {
  const { devices } = useDevices()
  const {
    url,
    setUrl,
    serviceList,
    loadServiceList,
    selectedPlayer,
    setSelectedPlayer,
    screen,
    displayMainScreen,
    xmlScreen
  } = useBrowsing()

  const [displayMode, setDisplayMode] = useState('xml') // json or xml or gui

  useEffect(() => {
    if (serviceList.length === 0) {
      loadServiceList()
      displayMainScreen('/ui/Home?playnum=1')
    }
  }, [selectedPlayer])

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
              displayMainScreen(url)
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

      <div className="flex justify-between">
        <ServiceMenuList musicServiceList={serviceList} />

        <Select value={displayMode} onValueChange={(value) => setDisplayMode(value)}>
          <SelectTrigger className="w-fit h-8 m-1 border-none">
            <SelectValue placeholder="Display Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json" onClick={() => setDisplayMode('json')}>
              JSON
            </SelectItem>
            <SelectItem value="xml" onClick={() => setDisplayMode('xml')}>
              XML
            </SelectItem>
            <SelectItem value="gui" onClick={() => setDisplayMode('gui')}>
              GUI
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {displayMode === 'xml' && <XMLViewer xml={xmlScreen} />}
      {displayMode === 'json' && <JsonView src={screen} />}
    </ScrollArea>
  )
}

export default BrowsePage

const demoDFata = {}
