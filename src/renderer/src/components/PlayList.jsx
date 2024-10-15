import React, { useEffect, useState } from 'react'
import { useDevices } from '../context/devicesContext'
import { columns } from './PlayerList/colums'
import { DataTable } from './PlayerList/data-table'
import { cn } from '../lib/utils'

export const goToIpAddress = (ip) => {
  window.open(`http://${ip}/`, '_blank')
}


const PlayList = ({ isCollapsed }) => {
  const { devices } = useDevices()
  return (
      <DataTable columns={columns} data={devices} isCollapsed={isCollapsed} />
  )
}

export default PlayList
