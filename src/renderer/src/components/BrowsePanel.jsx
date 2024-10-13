import React from 'react'
import SettingBar from './SettingBar'

const BrowsePanel = ({ isCollapsed }) => {
  return <div className="h-screen flex">{isCollapsed ? <></> : <></>}</div>
}

export default BrowsePanel
