import React, { useEffect, useState } from 'react'
import { useDevices } from '../../context/devicesContext'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useBrowsing } from '../../context/browsingContext'
import JsonView from 'react18-json-view'

import 'react18-json-view/src/style.css'
import { Button } from '../../../../components/ui/button'
import XMLViewer from 'react-xml-viewer'
import GUI from '../BrowseView/GUI'
import { XCircleIcon } from 'lucide-react'

const SearchView = () => {
  const {
    searchResult,
    setSearchResult,
    xmlSearchResult,
    displayMode,
    setIsSearchMode,
    searchableServices
  } = useBrowsing()

  const exitSearch = () => {
    setSearchResult(null)
    setIsSearchMode(false)
  }

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full h-full p-4 overflow-x-hidden pt-16">
      <div className="w-[calc(100vw-460px)] h-32 bg-background fixed top-0 z-10 flex items-end pr-20 pb-2">
        <div className='flex items-center w-full justify-between gap-2'>
          <h3 className="text-2xl font-bold">Search</h3>
          <div className="flex gap-2 w-full overflow-x-scroll">
            {searchResult &&
              searchResult.length > 1 &&
              searchResult.map((result, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-fit rounded-full"
                  onClick={() => scrollToSection(result.searchId)}
                >
                  {result.searchId}
                </Button>
              ))}
          </div>
          <XCircleIcon
            className="h-6 w-6 cursor-pointer duration-300 hover:text-red-500"
            onClick={exitSearch}
          />
        </div>
      </div>
      {displayMode === 'xml' && <XMLViewer xml={xmlSearchResult} />}
      {displayMode === 'json' && <JsonView src={searchResult} />}
      {displayMode === 'gui' &&
        searchResult &&
        searchResult.length > 0 &&
        searchResult.map((screen, index) => <GUI key={index} screen={screen} />)}
    </div>
  )
}

export default SearchView
