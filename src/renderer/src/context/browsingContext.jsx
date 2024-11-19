import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useDevices } from './devicesContext'
import { sduiSchemaVersion, searchableServicesList } from '../lib/constants'
import { useStorage } from './localStorageContext'

const BrowsingContext = createContext()

export const useBrowsing = () => useContext(BrowsingContext)

export const BrowsingProvider = ({ children }) => {
  if (!useDevices) return null
  const { devices } = useDevices()
  const [url, setUrl] = useState('/ui/Home?playnum=1')
  const [serviceList, setServiceList] = useState([])
  const [serviceSubMenus, setServiceSubMenus] = useState({})
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [screen, setScreen] = useState(null)
  const [xmlScreen, setXmlScreen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [xmlSearchResult, setXmlSearchResult] = useState('')
  const [displayMode, setDisplayMode] = useState('gui')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [historyUrl, setHistoryUrl] = useState([])
  const containerRef = useRef(null)

  const { enabledSearchServices } = useStorage()

  const [searchableServices, setSearchableServices] = useState(
    searchableServicesList.map((service) => ({
      service: service,
      selected: enabledSearchServices.includes(service)
    }))
  )

  useEffect(() => {
    if (serviceList.length === 0) {
      // initially load service list
      loadServiceList()
      displayMainScreen('/ui/Home?playnum=1')
      loadSearchableServices()
    }
  }, [selectedPlayer])

  useEffect(() => {
    // when enabled search services changes, update searchable services
    setSearchableServices((prevState) =>
      prevState.map((item) => ({ ...item, selected: enabledSearchServices.includes(item.service) }))
    )
  }, [enabledSearchServices, searchableServicesList])

  const addToHistory = (url, url2) => {
    // check if previous url is same as current url
    if (historyUrl[historyUrl.length - 1] !== url) {
      if (url2) {
        setHistoryUrl([...historyUrl, url, url2])
      } else {
        setHistoryUrl([...historyUrl, url])
      }
    }
  }

  const loadSearchableServices = async () => {
    const res = await loadSDUI('/ui/Search?playnum=1')
    if (!res) return
    const data = res?.json?.screen?.selectorMenu?.[0]?.item
      ?.map((item) => item?.action?.[0]?.$?.URI?.split('service=')[1])
      .filter((item) => item != null)
    if (data) {
      setSearchableServices(
        data.map((service) => ({
          service: service,
          selected: enabledSearchServices.includes(service)
        }))
      )
    }
  }
  const goToPreviousUrl = () => {
    if (historyUrl.length > 0) {
      if (url === 'search') {
        setUrl(historyUrl[historyUrl.length - 1])
        displayMainScreen(historyUrl[historyUrl.length - 1])
        setHistoryUrl(historyUrl.slice(0, -1))
      } else if (isSearchMode) {
        setIsSearchMode(false)
      } else if (historyUrl[historyUrl.length - 1] === 'search') {
        setIsSearchMode(true)
        setHistoryUrl(historyUrl.slice(0, -1))
        setUrl(historyUrl[historyUrl.length - 1])
      } else {
        setUrl(historyUrl[historyUrl.length - 1])
        displayMainScreen(historyUrl[historyUrl.length - 1])
        setHistoryUrl(historyUrl.slice(0, -1))
      }
    }
  }

  const displayMainScreen = async (uri, debug) => {
    if (debug) {
      console.log(uri)
    }
    setIsSearchMode(false)
    setScreen('Loading...')
    setXmlScreen('<Loading.../>')
    setLoading(true)
    if (isSearchMode) {
      addToHistory(url, 'search')
    } else {
      addToHistory(url)
    }
    const res = await loadSDUI(uri, null, debug,sduiSchemaVersion)
    if (!res) {
      return
    }
    const response = res.json
    if (!response) {
      setScreen('No Response')
      setXmlScreen('<NoResponse/>')
      setLoading(false)
      return
    }

    if (response && response.screen) {
      setScreen(response.screen)
      setXmlScreen(res.xmlText)
      setLoading(false)
    } else {
      setScreen(response)
      setXmlScreen(res.xmlText)
      setLoading(false)
    }
  }

  const getImagePath = (uri) => {
    if (!uri) return null
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return uri
    }
    return `http://${selectedPlayer?.ip}:11000${uri}`
  }

  const loadServiceList = async () => {
    if (devices.length > 0) {
      const ip = selectedPlayer?.ip || devices[0]?.ip
      const res = await loadSDUI(`/ui/Sources?playnum=1`)
      const response = res.json
      if (response && response.screen && response.screen.row && response.screen.row.length > 0) {
        const musicServiceArray = response.screen.row[1].list[0].service
        const musicServiceList = musicServiceArray.map((service) => {
          return {
            name: service.$.title,
            id: service.action[0].$.service,
            icon: service.$.icon,
            iconSrc: `http://${ip}:11000${service.$.icon}`,
            uri: service.action[0].$.URI
          }
        })
        setServiceList(musicServiceList)
      }
    }
  }

  const loadSubmenuForService = async (musicService) => {
    if (serviceSubMenus[musicService]) {
      return
    }
    let uri = `/ui/browseMenuGroup?service=${musicService}&playnum=1`

    if (devices.length > 0) {
      const ip = selectedPlayer.ip || devices[0].ip
      const res = await loadSDUI(uri)
      const response = res.json
      if (response && response.screen) {
        setServiceSubMenus((prev) => ({ ...prev, [musicService]: { screen: response.screen } }))
      }
    }
  }

  const loadSDUI = async (uri, deviceIp, debug, schema) => {
    console.log(uri, deviceIp, debug, schema)

    if (devices.length === 0) {
      return
    }
    const ip = deviceIp || selectedPlayer?.ip || devices[0]?.ip
    return await window.api.loadSDUIPage(`http://${ip}${uri}`, debug, schema)
  }

  const performSearching = async () => {
    const ip = selectedPlayer.ip || devices[0].ip
    //ui/Search?playnum=1&service=SOUNDMACHINE&q="Michael"
    let uri = `/ui/Search?playnum=1&q="${searchText}"`
    let xmlResult = ''
    let jsonResult = []
    setXmlSearchResult('<Searching.../>')
    setSearchResult([
      {
        $: { screenTitle: '🎶 Tune Hunt' },
        infoPanel: [
          {
            $: {
              icon: '',
              text: "Hold on, we're tracking down the jams!",
              subText:
                'Our musical sleuths are hard at work... a killer playlist is just a few beats away!'
            }
          }
        ]
      }
    ])

    for (let i = 0; i < searchableServices.length; i++) {
      if (searchableServices[i].selected === false) {
        // if service is not selected, skip it
        continue
      }
      const res = await loadSDUI(uri + '&service=' + searchableServices[i].service, ip)
      const response = res.json
      if (response && response.screen) {
        xmlResult += `<${searchableServices[i].service}>${res.xmlText}</${searchableServices[i].service}>`
        jsonResult.push({ ...response.screen, searchId: searchableServices[i].service })
        setXmlSearchResult(xmlResult)
        setSearchResult(jsonResult)
      }
    }
    setXmlSearchResult(xmlResult)
    setSearchResult(jsonResult)
  }

  const loadNextLink = async (nextLink) => {
    const result = await loadSDUI(':11000' + nextLink)
    const { list: newList } = result.json || {}
    const { item: newItems, nextLink: newNextLink } = newList || {}

    setScreen((prev) => {
      const { list: oldList } = prev || {}
      if (newList) {
        const { item: oldItems } = oldList?.[0] || {}
        return {
          ...prev,
          list: [
            {
              item: [...oldItems, ...newItems],
              nextLink: newNextLink
            }
          ]
        }
      }
      return prev
    })
  }

  const loadContextMenu = async (contextMenu) => {
    const { $ } = contextMenu || {}
    const { URI, type, resultType } = $ || {}
    const response = await loadSDUI(':11000' + URI)
    return response?.json?.contextMenu
  }

  const SDUIfetch = async (fetch, id) => {
    const { $ } = fetch || {}
    const { url, itemType } = $ || {}
    // schema v6
    const result = await loadSDUI(':11000' + url + '&playnum=1', null, null, '6')

    const { list: newList, row: newRow } = result.json || {}

    if (!newList && !newRow) {
      if (!id) return

      return setScreen((prev) => {
        return {
          ...prev,
          row: prev.row?.map((row) => {
            if (row?.$?.id === id) {
              return { ...row, fetch: null, message: 'No items found' }
            }
            return row
          }),
          list: prev.list?.map((list) => {
            if (list?.$?.id === id) {
              return { ...list, fetch: null, message: 'No items found' }
            }
            return list
          })
        }
      })
    }

    setScreen((prev) => {
      if (newList) {
        const listId = newList?.$?.id
        // replace list from list array with new list, identify by list.id
        return {
          ...prev,
          list: prev.list?.map((list) => {
            if (list.$.id === listId) {
              return newList
            }
            return list
          })
        }
      }
      if (newRow) {
        const rowId = newRow?.$?.id
        // replace row from row array with new row, identify by row.id
        return {
          ...prev,
          row: prev.row?.map((row) => {
            if (row.$.id === rowId) {
              return newRow
            }
            return row
          })
        }
      }
      return prev
    })
  }

  const value = {
    url,
    setUrl,
    serviceSubMenus,
    setServiceSubMenus,
    serviceList,
    loadSDUI,
    loadServiceList,
    loadSubmenuForService,
    selectedPlayer,
    setSelectedPlayer,
    screen,
    setScreen,
    displayMainScreen,
    xmlScreen,
    loading,
    setLoading,
    getImagePath,
    searchText,
    setSearchText,
    searchResult,
    setSearchResult,
    xmlSearchResult,
    setXmlSearchResult,
    displayMode,
    setDisplayMode,
    searchableServices,
    setSearchableServices,
    performSearching,
    isSearchMode,
    setIsSearchMode,
    goToPreviousUrl,
    historyUrl,
    loadNextLink,
    containerRef,
    loadContextMenu,
    SDUIfetch
  }

  return <BrowsingContext.Provider value={value}>{children}</BrowsingContext.Provider>
}
