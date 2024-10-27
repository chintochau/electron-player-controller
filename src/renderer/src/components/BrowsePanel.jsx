import React from 'react'
import SettingBar from './SettingBar'
import BrowsePage from './BrowsePage/BrowsePage'

const BrowsePanel = ({ isCollapsed }) => {
  return (
    <div className="h-screen flex">
      {isCollapsed && (
        <>
          <BrowsePage />
        </>
      ) }
    </div>
  )
}

export default BrowsePanel
