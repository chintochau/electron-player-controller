import React, { useEffect, useState } from 'react'
import { useDevices } from '../../context/devicesContext'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useBrowsing } from '../../context/borwsingContext'
import JsonView from 'react18-json-view'

import 'react18-json-view/src/style.css'
import { Button } from '../../../../components/ui/button'
import XMLViewer from 'react-xml-viewer'
import GUI from '../BrowseView/GUI'
import { XCircleIcon } from 'lucide-react'


const SearchView = () => {
    const {
        serviceList,
        loadServiceList,
        selectedPlayer,
        displayMainScreen,
        searchResult,
        setSearchResult,
        xmlSearchResult,
        setXmlSearchResult,
        displayMode,
    } = useBrowsing()

    useEffect(() => {
        if (serviceList.length === 0) {
            loadServiceList()
            displayMainScreen('/ui/Home?playnum=1')
        }
    }, [selectedPlayer])

    return (
        <ScrollArea className="w-full h-full p-4 overflow-x-hidden pt-16">
            <div className='w-[calc(100vw-550px)] flex items-center justify-between fixed top-24'>
                <h3
                    className="text-2xl font-bold">
                    Search Result
                </h3>
                <XCircleIcon className='h-6 w-6 cursor-pointer duration-300 hover:text-red-500' onClick={() => setSearchResult(null)} />
            </div>
            {displayMode === 'xml' && <XMLViewer xml={xmlSearchResult} />}
            {displayMode === 'json' && <JsonView src={searchResult} />}
            {displayMode === 'gui' && searchResult && searchResult.length > 0 && searchResult.map((screen, index) => <GUI key={index} screen={screen} />)}
        </ScrollArea>
    )
}

export default SearchView