import { createContext, useContext, useEffect, useState } from 'react'
import { useDevices } from './devicesContext'
import { getMusicServiceString } from '../lib/utils'

const BrowsingContext = createContext()

export const useBrowsing = () => useContext(BrowsingContext)

export const BrowsingProvider = ({ children }) => {
  const { devices } = useDevices()
  const [url, setUrl] = useState('/ui/Home?playnum=1')
  const [serviceList, setServiceList] = useState([])
  const [serviceSubMenus, setServiceSubMenus] = useState({})
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [screen, setScreen] = useState(null)

  useEffect(() => {
    if (!selectedPlayer) {
      setSelectedPlayer(devices[0])
    }
  }, [devices])

  const loadServiceList = async () => {
    if (devices.length > 0) {
      const ip = selectedPlayer.ip || devices[0].ip
      const response = await loadSDUI(`/ui/Sources?playnum=1`)
      if (response && response.screen && response.screen.row && response.screen.row.length > 0) {
        const musicServiceArray = response.screen.row[1].list[0].service
        const musicServiceList = musicServiceArray.map((service) => {
          return {
            name: service.$.title,
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
    const service = getMusicServiceString(musicService)
    // check if service is already loaded
    if (serviceSubMenus[service]) {
      console.log('already loaded', service)
      return
    }
    let uri
    switch (service) {
      case 'Tidal':
        uri = `/ui/browseMenuGroup?service=${getMusicServiceString('Tidal')}&playnum=1`
        break
        case 'Qobuz':
        uri = `/ui/browseMenuGroup?service=${getMusicServiceString('Qobuz')}&playnum=1`
        break
      default:
        uri = `/ui/browseMenuGroup?service=${getMusicServiceString('TuneIn')}&playnum=1`
        break
    }

    if (devices.length > 0) {
      const ip = devices[0].ip
      const response = await loadSDUI(uri)
      if (response && response.screen) {
        setServiceSubMenus((prev) => ({ ...prev, [service]: { screen: response.screen } }))
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

  const loadMainScreen = async (uri) => {
    setScreen("Loading...")
    const response = await loadSDUI(uri, true)
    if (!response) {
      return
    }
    if (response && response.screen) {
      setScreen(response.screen)
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
    loadMainScreen
  }

  return <BrowsingContext.Provider value={value}>{children}</BrowsingContext.Provider>
}
