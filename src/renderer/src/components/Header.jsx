import React from 'react'
import { cn } from '../lib/utils'

const Header = ({ isCollapsed }) => {
  return (
    <div className="flex h-12 items-center">
      <h1 className="text-3xl font-bold  text-center py-2 flex-1">
        BluOS <span className={cn(isCollapsed ? 'hidden' : 'inline')}>Player Controller</span>
      </h1>
    </div>
  )
}

export default Header
