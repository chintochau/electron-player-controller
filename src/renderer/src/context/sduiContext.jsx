import { createContext, useContext, useState } from 'react'
import { useBrowsing } from './borwsingContext'
import { runCommandForDevice } from '../lib/utils'
import { useToast } from '@/hooks/use-toast'

const SDUIContext = createContext()

export const useSdui = () => useContext(SDUIContext)

export const mapValueToKey = (value) => {
  return value
}

export const SDUIProvider = ({ children }) => {
  const { displayMainScreen, setUrl, selectedPlayer } = useBrowsing()
  const { toast } = useToast()


  const mapToURL = ({ URI, resultType, title, service }) => {
    // Map the given parameters to the new format
    const params = {
      playnum: 1, // You mentioned playnum should be 1
      type: resultType,
      title: title,
      service: service,
      url: URI
    };

    // Construct the query string
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    // Return the full URL
    return `/ui/browseContext?${queryString}`;
  }

  const performAction = (action) => {
    const { $ } = action[0] || {}
    const { URI, type, resultType, service, title, haptic } = $ || {}
    let url

    if (URI && type) {
      switch (type) {
        case "context-browse":
          url = mapToURL($)
          setUrl(url)
          displayMainScreen(url, true)
          break
        case 'player-link':
          url = ":11000" + URI
          runCommandForDevice(selectedPlayer.ip, url, 'GET')
          break
        case 'browse':
          url = URI + '&playnum=1'
          setUrl(url)
          displayMainScreen(url)
          break
        default:
          console.log('not supported type', action[0].$)
          break
      }
    }
  }
  const browseContext = (data) => {
    console.log(data);
    const { $, name } = data || {}
    const { service } = $ || {}
    return `:11000/BrowseContext?service=${service}&title=${name[0]._}&id=${name[0].$.id}`.replaceAll(' ', '+')
  }

  const value = {
    performAction,
    browseContext
  }

  return <SDUIContext.Provider value={value}>{children}</SDUIContext.Provider>
}
