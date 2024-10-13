import React from 'react'
import Header from './Header'
import PlayList from './PlayList'
import Footer from './Footer'
import { useTable } from '../context/tableContext'
import { cn } from '../lib/utils'
import BrowsePanel from './BrowsePanel'
import SettingBar from './SettingBar'

const Dashboard = () => {
  const { isCollapsed } = useTable()
  return (
      <div className="flex">
        <div
          className={cn(
            'duration-300 ease-in overflow-hidden',
            isCollapsed ? ' min-w-fit w-96 px-2' : 'pl-10 w-full'
          )}
        >
          <Header isCollapsed={isCollapsed} />
          <PlayList isCollapsed={isCollapsed} />
          <Footer isCollapsed={isCollapsed} />
        </div>
        <div className={cn('duration-300 ease-in', isCollapsed ? 'mx-0 w-[calc(100vw-450px)] overflow-x-hidden' : 'w-0')}>
          <BrowsePanel isCollapsed={isCollapsed}/>
        </div>
        <SettingBar />
      </div>
  )
}

export default Dashboard
