import { createContext, useContext, useState } from 'react'
import { useBrowsing } from './browsingContext'
import {
  buildUrl,
  decomposeUrlIntoParamsObject,
  encodeUrl,
  runCommandForDevice
} from '../lib/utils'
import { useToast } from '@/hooks/use-toast'
import { usePreset } from './presetContext'

const SDUIContext = createContext()

export const useSdui = () => useContext(SDUIContext)

export const mapValueToKey = (value) => {
  return value
}

export const SDUIProvider = ({ children }) => {
  const { displayMainScreen, setUrl, selectedPlayer } = useBrowsing() || {}
  const [isAddpresetPageShown, setIsAddpresetPageShown] = useState(false)
  const { setSelectedPreset, setPresetName } = usePreset() || {}

  const mapToURL = ({ URI, resultType, title, service }) => {
    // Map the given parameters to the new format
    const params = {
      playnum: 1, // You mentioned playnum should be 1
      type: resultType,
      title: title,
      service: service,
      url: URI
    }

    // Construct the query string
    const queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')

    // Return the full URL
    return `/ui/browseContext?${queryString}`
  }

  const performAction = (action) => {
    const { $ } = action[0] || {}
    const { URI, type, resultType, service, title, haptic } = $ || {}
    let url

    if (URI && type) {
      switch (type) {
        case 'context-browse':
          url = mapToURL($)
          setUrl(url)
          displayMainScreen(url, true)
          break
        case 'player-link':
          url = ':11000' + URI
          runCommandForDevice(selectedPlayer?.ip, url, 'GET')
          break
        case 'browse':
          switch (resultType) {
            case 'Info':
              //TODO : handle Info
              break
            default:
              url = ':11000' + URI
              setUrl(url)
              displayMainScreen(url)
              break
          }
          break
        case 'deep-link':
          // URI = "/music-service/Tidal"
          // split URI by / and get the first part
          url = URI.split('/')[1]
          const parsedURI = url.split('?')?.[0] || url
          const parsedParams = url.split('?')?.[1]

          switch (parsedURI) {
            case 'music-service':
              url = '/ui/browseMenuGroup?service=' + service + '&playnum=1'
              setUrl(url)
              displayMainScreen(url)
              break
            case 'add-preset':
              // TODO show add preset page
              setIsAddpresetPageShown(true)

              if (parsedParams) {
                const object = decomposeUrlIntoParamsObject(parsedParams)
                const { name, URL, image } = object || {}
                setPresetName(name)
                setSelectedPreset((prev) => {
                  return {
                    $: {
                      ...object,
                      URL: object.url,
                      text: name
                    }
                  }
                })
              }

              break
            default:
              console.log('not supported url type', url)
              break
          }

          break
        default:
          console.log('not supported type', action[0].$)
          break
      }
    }
  }

  const browseContext = (data) => {
    const { $, name } = data || {}
    const { service } = $ || {}
    return `:11000/BrowseContext?service=${service}&title=${name[0]._}&id=${name[0].$.id}`.replaceAll(
      ' ',
      '+'
    )
  }

  const value = {
    performAction,
    browseContext,
    isAddpresetPageShown,
    setIsAddpresetPageShown
  }

  return <SDUIContext.Provider value={value}>{children}</SDUIContext.Provider>
}
