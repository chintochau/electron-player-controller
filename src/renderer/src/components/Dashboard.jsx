import React from 'react'
import Header from './Header'
import PlayerListModern from './PlayerList/PlayerListModern'
import Footer from './Footer'
import { useTable } from '../context/tableContext'
import { cn } from '../lib/utils'
import BrowsePanel from './BrowsePanel'
import SettingBar from './SettingBar'
import AddPresetPage from './AddPresetPage'

const Dashboard = () => {
  const { isCollapsed } = useTable()

  if (!useTable) return null

  return (
    <>
      <div className="flex">
        <div
          className={cn(
            'duration-300 ease-in overflow-hidden h-screen flex flex-col',
            isCollapsed ? 'min-w-fit w-80 pl-2' : 'pl-10 w-full'
          )}
        >
          <Header isCollapsed={isCollapsed} />
          <div className="flex-1 overflow-hidden">
            <PlayerListModern />
          </div>
        </div>
        <Footer isCollapsed={isCollapsed} />
        <div
          className={cn(
            'duration-300 ease-in',
            isCollapsed ? 'mx-0 w-[calc(100vw-410px)] overflow-x-hidden' : 'w-0'
          )}
        >
          <BrowsePanel isCollapsed={isCollapsed} />
        </div>
        <SettingBar />
      </div>
      <AddPresetPage />
    </>
  )
}

export default Dashboard
