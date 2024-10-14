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
import { ArrowLeftIcon, Loader2, SearchIcon, SendHorizonalIcon } from 'lucide-react'
import { Input } from '../../../../components/ui/input'
import ServiceMenuList from './ServiceMenuList'
import { useBrowsing } from '../../context/borwsingContext'
import JsonView from 'react18-json-view'

import 'react18-json-view/src/style.css'
import { Button } from '../../../../components/ui/button'
import XMLViewer from 'react-xml-viewer'
import GUI from '../BrowseView/GUI'
import SearchView from '../SearchView/SearchView'

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
    xmlScreen,
    displayMode, setDisplayMode,
    searchText,
    setSearchText,
    isSearchMode,
    setIsSearchMode,
    performSearching,
    goToPreviousUrl
  } = useBrowsing()

  useEffect(() => {
    if (serviceList.length === 0) {
      loadServiceList()
      displayMainScreen('/ui/Home?playnum=1')
    }
  }, [selectedPlayer])

  const handleSearchClick = (e) => {
    e.preventDefault()
    performSearching()
    setIsSearchMode(true)
  }

  return (
    <ScrollArea className="w-full h-full p-4 overflow-x-hidden">
      <div id="urlBar" className="flex items-center justify-between sticky top-0 z-50">
        <Select
          value={selectedPlayer && selectedPlayer.mac}
          onValueChange={(value) =>
            setSelectedPlayer(devices.find((device) => device.mac === value))
          }
        >
          <SelectTrigger className="w-fit h-14 m-1 border-none rounded-full">
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
          <Button
            variant="outline"
            type="button"
            className="rounded-l-full"
            onClick={(e) => {
              e.preventDefault()
              goToPreviousUrl()
            }}
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          <Input
            className="border-x-0  rounded-none"
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
            <SendHorizonalIcon className="w-4 h-4" />
          </Button>
        </form>
        <form className="flex items-center ml-4 flex-auto w-20 max-w-[400px]">
          <Input className="w-full rounded-l-full border-r-0" placeholder="Search" onChange={(e) => setSearchText(e.target.value)} value={searchText} />
          <Button type="submit" variant="ghost" className="border rounded-r-full bg-background" onClick={handleSearchClick}><SearchIcon className="w-4 h-4" /></Button>
        </form>
        <Select value={displayMode} onValueChange={(value) => setDisplayMode(value)}>
          <SelectTrigger className="w-fit h-8 m-1 border-none rounded-full">
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

      {isSearchMode ?
        <SearchView />
        :
        <>
          <ServiceMenuList musicServiceList={serviceList} />
          {displayMode === 'xml' && <XMLViewer xml={xmlScreen} />}
          {displayMode === 'json' && <JsonView src={screen} />}
          {displayMode === 'gui' && <GUI screen={screen} />}
        </>
      }

    </ScrollArea>
  )
}

export default BrowsePage