import React from 'react'
import Header from './Header'
import PlayerList from './PlayerList'
import Footer from './Footer'
import { useTable } from '../context/tableContext'
import { cn } from '../lib/utils'
import BrowsePanel from './BrowsePanel'
import SettingBar from './SettingBar'

const Dashboard = () => {
  const { isCollapsed } = useTable()
  
  if (!useTable) return null

  return (
    <div className="flex">
      <div
        className={cn(
          ' duration-300 ease-in overflow-hidden h-screen',
          isCollapsed ? ' min-w-fit w-96 px-2' : 'pl-10 w-full'
        )}
      >
        <Header isCollapsed={isCollapsed} />
        <PlayerList isCollapsed={isCollapsed} />
      </div>
      <Footer isCollapsed={isCollapsed} />
      <div
        className={cn(
          'duration-300 ease-in',
          isCollapsed ? 'mx-0 w-[calc(100vw-430px)] overflow-x-hidden' : 'w-0'
        )}
      >
        <BrowsePanel isCollapsed={isCollapsed} />
      </div>
      <SettingBar />
    </div>
  )
}

export default Dashboard
