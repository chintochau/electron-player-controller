import React from 'react'
import { Button } from '../../../components/ui/button'
import Header from './Header'
import PlayList from './PlayList'
import Footer from './Footer'
import { useTable } from '../context/tableContext'
import { cn } from '../lib/utils'

const Dashboard = () => {
  const { isCollapsed, setIsCollapsed } = useTable()
  return (
    <>
      <Button variant="ghost" className="fixed" onClick={() => setIsCollapsed(!isCollapsed)}>
        Set Collapse
      </Button>
      <div className="flex">
        <div
          className={cn(
            'duration-300 ease-in overflow-hidden',
            isCollapsed ? ' w-96 px-2' : 'px-10 w-full'
          )}
        >
          <Header isCollapsed={isCollapsed} />
          <PlayList isCollapsed={isCollapsed} />
          <Footer isCollapsed={isCollapsed} />
        </div>
        <div className={cn('duration-300 ease-in', isCollapsed ? 'mx-0' : '')}>123321</div>
      </div>
    </>
  )
}

export default Dashboard
