import { createContext, useContext, useState } from 'react'
import { useBrowsing } from './borwsingContext'

const SDUIContext = createContext()

export const useSdui = () => useContext(SDUIContext)

export const SDUIProvider = ({ children }) => {
  const { displayMainScreen } = useBrowsing()

  const performAction = (action) => {
    if (action && action[0] && action[0].$) {
      switch (action[0].$.type) {
        case 'browse':
          displayMainScreen(action[0].$.URI + '&playnum=1')
          break
        default:
          console.log('not supported type', action[0].$)
          break
      }
    }
  }

  const value = {
    performAction,
  }

  return <SDUIContext.Provider value={value}>{children}</SDUIContext.Provider>
}
