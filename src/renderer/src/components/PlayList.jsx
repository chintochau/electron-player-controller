import React, { useEffect, useState } from 'react'
import { useDevices } from '../context/devicesContext'
import { columns } from './PlayerList/colums'
import { DataTable } from './PlayerList/data-table'
import { cn } from '../lib/utils'

export const goToIpAddress = (ip) => {
  window.open(`http://${ip}/`, '_blank')
}

export const playerControl = async (ip, control, param) => {
  const res = await window.api.playerControl(ip, control, param)
}

const PlayList = ({ isCollapsed }) => {
  const { devices } = useDevices()
  return (
    <div
      className={cn(
        ' ease-in-out duration-300',
        isCollapsed ? 'pb-0 h-[calc(100vh-48px)]' : 'pb-40 h-[calc(100vh-192px)]'
      )}
    >
      <DataTable columns={columns} data={devices} isCollapsed={isCollapsed} />
    </div>
  )
}

export default PlayList
