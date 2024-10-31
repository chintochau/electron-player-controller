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
import { ArrowLeftIcon, ChevronDownIcon, SearchIcon, SendHorizonalIcon } from 'lucide-react'
import { Input } from '../../../../components/ui/input'
import ServiceMenuList from './ServiceMenuList'
import { useBrowsing } from '../../context/browsingContext'
import JsonView from 'react18-json-view'

import 'react18-json-view/src/style.css'
import { Button } from '../../../../components/ui/button'
import XMLViewer from 'react-xml-viewer'
import GUI from '../BrowseView/GUI'
import SearchView from '../SearchView/SearchView'
import { enabledFeatures } from '../../lib/constants'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

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
    displayMode,
    setDisplayMode,
    searchText,
    setSearchText,
    isSearchMode,
    setIsSearchMode,
    performSearching,
    goToPreviousUrl,
    containerRef,
    searchableServices
  } = useBrowsing()

  useEffect(() => {
    if (serviceList.length === 0) {
      loadServiceList()
      displayMainScreen('/ui/Home?playnum=1')
    }
  }, [selectedPlayer])

  useEffect(() => {
    if (devices && devices.length > 0 && !selectedPlayer) {
      setSelectedPlayer(devices[0])
    }
  }, [])

  const handleSearchClick = (e) => {
    e.preventDefault()
    performSearching()
    setIsSearchMode(true)
  }

  return (
    <ScrollArea className="w-full h-full p-4 overflow-x-hidden" ref={containerRef}>
      <div id="urlBar" className="flex items-center justify-between sticky top-0 z-50">
        {!enabledFeatures.urlBar && (
          <Button
            variant="outline"
            type="button"
            className="rounded-full mr-2"
            onClick={(e) => {
              e.preventDefault()
              goToPreviousUrl()
            }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
        )}
        <Select
          value={selectedPlayer && selectedPlayer.mac}
          onValueChange={(value) =>
            setSelectedPlayer(devices.find((device) => device.mac === value))
          }
        >
          <SelectTrigger className="w-fit m-1  rounded-full">
            <SelectValue placeholder="Player" />
          </SelectTrigger>
          <SelectContent>
            {devices &&
              devices.map((device) => {
                return (
                  <SelectItem key={device.mac} value={device.mac}>
                    <div className="flex flex-col items-start text-left">
                      <p>{device.name}</p>
                    </div>
                  </SelectItem>
                )
              })}
          </SelectContent>
        </Select>
        {enabledFeatures.urlBar && (
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
        )}
        <form
          className={`flex items-center ml-4 flex-auto w-20 ${enabledFeatures.urlBar && 'max-w-[400px]'}`}
        >
          <div className="relative w-full">
            <Input
              className="w-full rounded-l-full border-r-0"
              placeholder="Search"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <div className='absolute top-0 right-0 h-full w-10 flex items-center justify-center'>
              <DropdownMenu >
                <DropdownMenuTrigger className=" outline outline-1 outline-offset-2 outline-accent mx-1 rounded-sm">
                  <ChevronDownIcon className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault()
                  }}>
                    <Checkbox checked />
                    <p className='ml-2 text-base'>All</p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {searchableServices && searchableServices.length > 0 && searchableServices.map((service) => {
                    return (
                      <DropdownMenuItem
                        key={service}
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <Checkbox checked />
                        <p className='ml-2 text-base'>{service}</p>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Button
            type="submit"
            variant="ghost"
            className="border rounded-r-full bg-background"
            onClick={handleSearchClick}
          >
            <SearchIcon className="w-4 h-4" />
          </Button>
        </form>
        {enabledFeatures.xmlMode && (
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
        )}
      </div>
      {isSearchMode ? (
        <SearchView />
      ) : (
        <>
          <ServiceMenuList musicServiceList={serviceList} />
          {displayMode === 'xml' && <XMLViewer xml={xmlScreen} />}
          {displayMode === 'json' && <JsonView src={screen} />}
          {displayMode === 'gui' && <GUI screen={screen} />}
        </>
      )}
    </ScrollArea>
  )
}

export default BrowsePage
