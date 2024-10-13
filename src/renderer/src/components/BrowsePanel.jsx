import React from 'react'
import SettingBar from './SettingBar'
import MusicPage from './BrowsePage/MusicPage'

const BrowsePanel = ({ isCollapsed }) => {
  return (
    <div className="h-screen flex">
      {isCollapsed ? (
        <>
          <MusicPage />
        </>
      ) : null}
    </div>
  )
}

export default BrowsePanel
