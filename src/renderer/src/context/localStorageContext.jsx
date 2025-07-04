import { createContext, useContext, useState } from 'react'
import { commandList, defaultRoomList } from '../lib/constants'

const StorageContext = createContext()

export const useStorage = () => useContext(StorageContext)

export const StorageProvider = ({ children }) => {
  const [savedPlayers, setSavedPlayers] = useState(
    localStorage.getItem('savedPlayers') ? JSON.parse(localStorage.getItem('savedPlayers')) : {}
  ) // {mac:room, mac:room...}
  const [roomList, setRoomList] = useState(
    localStorage.getItem('roomList')
      ? JSON.parse(localStorage.getItem('roomList'))
      : defaultRoomList
  )
  // read custom api list from local storage, if not found, save commandList to the local storage, and return commandList
  const [customApiList, setCustomApiList] = useState(
    localStorage.getItem('customApiList') ? JSON.parse(localStorage.getItem('customApiList')) : []
  )
  const [bookmarks, setBookmarks] = useState(
    localStorage.getItem('bookmarks')
      ? JSON.parse(localStorage.getItem('bookmarks'))
      : [{ name: 'Home', uri: ':11000/ui/Home?playnum=1' }]
  )
  const [isPresetVisible, setIsPresetVisible] = useState(
    localStorage.getItem('isPresetVisible')
      ? JSON.parse(localStorage.getItem('isPresetVisible'))
      : false
  )
  const [enabledSearchServices, setEnabledSearchServices] = useState(
    localStorage.getItem('enableSearchServices')
      ? JSON.parse(localStorage.getItem('enableSearchServices'))
      : ['Qobuz', 'Tidal']
  )
  const [useModernUI, setUseModernUI] = useState(
    localStorage.getItem('useModernUI') !== null
      ? JSON.parse(localStorage.getItem('useModernUI'))
      : true
  )

  const addServiceToSearchList = (service) => {
    setEnabledSearchServices((enableSearchServices) => [...enableSearchServices, service])
    localStorage.setItem(
      'enableSearchServices',
      JSON.stringify([...enabledSearchServices, service])
    )
  }

  const removeServiceFromSearchList = (service) => {
    setEnabledSearchServices((enableSearchServices) =>
      enableSearchServices.filter((item) => item !== service)
    )
    localStorage.setItem(
      'enableSearchServices',
      JSON.stringify(enabledSearchServices.filter((item) => item !== service))
    )
  }

  const selectAllServicesFromSearchList = (searchableServicesList) => {
    setEnabledSearchServices(searchableServicesList)
    localStorage.setItem('enableSearchServices', JSON.stringify(searchableServicesList))
  }

  const removeAllServicesFromSearchList = () => {
    setEnabledSearchServices([])
    localStorage.setItem('enableSearchServices', JSON.stringify([]))
  }
  const addRoomToList = (room) => {
    // make sure the room is not already in the list
    if (!roomList.includes(room)) {
      setRoomList((roomList) => [...roomList, room])
      localStorage.setItem('roomList', JSON.stringify([...roomList, room]))
    }
  }

  const removeRoomFromList = (room) => {
    setRoomList((roomList) => roomList.filter((item) => item !== room))
    localStorage.setItem('roomList', JSON.stringify(roomList.filter((item) => item !== room)))
  }

  const saveRoomForMac = (mac, room) => {
    setSavedPlayers((savedPlayers) => ({ ...savedPlayers, [mac]: room }))
    localStorage.setItem('savedPlayers', JSON.stringify({ ...savedPlayers, [mac]: room }))
  }

  const addToCustomApiList = (api) => {
    setCustomApiList((customApiList) => [...customApiList, api])
    localStorage.setItem('customApiList', JSON.stringify([...customApiList, api]))
  }

  const removeFromCustomApiList = (index) => {
    setCustomApiList((customApiList) => customApiList.filter((_, i) => i !== index))
    localStorage.setItem(
      'customApiList',
      JSON.stringify(customApiList.filter((_, i) => i !== index))
    )
  }

  const addToBookmarks = (bookmark) => {
    setBookmarks((bookmarks) => [...bookmarks, bookmark])
    localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, bookmark]))
  }

  const removeFromBookmarks = (index) => {
    setBookmarks((bookmarks) => bookmarks.filter((_, i) => i !== index))
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks.filter((_, i) => i !== index)))
  }

  const togglePresetVisibility = () => {
    setIsPresetVisible(!isPresetVisible)
    localStorage.setItem('isPresetVisible', JSON.stringify(!isPresetVisible))
  }

  const toggleModernUI = () => {
    setUseModernUI(!useModernUI)
    localStorage.setItem('useModernUI', JSON.stringify(!useModernUI))
  }

  const checkRoomForMac = (mac) => {
    if (savedPlayers[mac]) {
      return savedPlayers[mac]
    } else {
      return 'Unassigned'
    }
  }
  const value = {
    savedPlayers,
    saveRoomForMac,
    roomList,
    addRoomToList,
    checkRoomForMac,
    removeRoomFromList,
    customApiList,
    addToCustomApiList,
    removeFromCustomApiList,
    addToBookmarks,
    removeFromBookmarks,
    bookmarks,
    isPresetVisible,
    togglePresetVisibility,
    addServiceToSearchList,
    removeServiceFromSearchList,
    selectAllServicesFromSearchList,
    removeAllServicesFromSearchList,
    enabledSearchServices,
    useModernUI,
    toggleModernUI
  }

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}
