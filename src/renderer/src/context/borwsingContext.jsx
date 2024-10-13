import { createContext, useContext, useEffect, useState } from 'react'
import { useDevices } from './devicesContext'

const BrowsingContext = createContext()

export const useBrowsing = () => useContext(BrowsingContext)

export const BrowsingProvider = ({ children }) => {
  const { devices } = useDevices()
  const [url, setUrl] = useState('/ui/Home?playnum=1')
  const [serviceList, setServiceList] = useState([])
  const [serviceSubMenus, setServiceSubMenus] = useState({})
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [screen, setScreen] = useState(null)
  const [xmlScreen, setXmlScreen] = useState(null)

  useEffect(() => {
    if (!selectedPlayer) {
      setSelectedPlayer(devices[0])
    }
  }, [devices])

  const loadServiceList = async () => {
    if (devices.length > 0) {
      const ip = selectedPlayer.ip || devices[0].ip
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

  const loadSDUI = async (uri, debug) => {
    if (devices.length === 0) {
      return
    }
    const ip = selectedPlayer.ip || devices[0].ip
    return await window.api.loadSDUIPage(`http://${ip}${uri}`, debug)
  }

  const displayMainScreen = async (uri) => {
    setScreen('Loading...')
    setXmlScreen('<Loading.../>')
    const res = await loadSDUI(uri, true)

    const response = res.json
    if (!response) {
      return
    }
    if (response && response.screen) {
      setScreen(response.screen)
      setXmlScreen(res.xmlText)
    }
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
    xmlScreen
  }

  return <BrowsingContext.Provider value={value}>{children}</BrowsingContext.Provider>
}
