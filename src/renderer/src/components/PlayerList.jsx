import React from 'react'
import { useDevices } from '../context/devicesContext'
import { columns } from './PlayerList/colums'
import { DataTable } from './PlayerList/data-table'
import { cn } from '../lib/utils'
import { useTable } from '../context/tableContext'
import CompactPlayer from './CompactPlayer'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { useStorage } from '../context/localStorageContext'
import PlayerGridView from './PlayerGridView'

export const goToIpAddress = (ip) => {
  window.open(`http://${ip}/`, '_blank')
}

const PlayerList = () => {
  const { devices } = useDevices()
  const { isCollapsed } = useTable()
  if (!useDevices) return null

  return (
    <>
      <DataTable columns={columns} data={devices} isCollapsed={isCollapsed} />
      <PlayerGridView />
    </>
  )
}

export default PlayerList
