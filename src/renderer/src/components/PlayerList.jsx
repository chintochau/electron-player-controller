import React from 'react'
import { useDevices } from '../context/devicesContext'
import { columns } from './PlayerList/colums'
import { DataTable } from './PlayerList/data-table'
import { cn } from '../lib/utils'
import { useTable } from '../context/tableContext'
import CompactPlayer from './CompactPlayer'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { useStorage } from '../context/localStorageContext'

export const goToIpAddress = (ip) => {
  window.open(`http://${ip}/`, '_blank')
}

const PlayerList = () => {
  const { devices } = useDevices()
  const { roomList } = useStorage()
  const { isGridMode, isCollapsed } = useTable()
  if (!useDevices) return null

  return (
    <>
      <DataTable columns={columns} data={devices} isCollapsed={isCollapsed} />
      <ScrollArea>
        {isGridMode && !isCollapsed && (
          <>
            {roomList.sort().map((room) => (
              <div className={cn('p-2 min-w-80')}>{room}</div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 auto-cols-min max-h-[calc(100vh-300px)]">
              {devices.map((device) => (
                <div className={cn('p-2 min-w-80')}>
                  <CompactPlayer ip={device.ip} />
                </div>
              ))}
            </div>
          </>
        )}
      </ScrollArea>
    </>
  )
}

export default PlayerList
