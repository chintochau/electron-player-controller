import React, { useState } from 'react'
import { useDevices } from '../context/devicesContext'
import SyncStatus from './SyncStatus'
import PlayStatus from './PlayStatus'
import { useBrowsing } from '../context/browsingContext'
import { cn } from '@/lib/utils'
import PlayQueue from './PlayQueue'


const CompactPlayer = ({ ip }) => {
  const { devices } = useDevices()
  const { selectedPlayer, setSelectedPlayer } = useBrowsing()
  const device = devices.find((device) => device.ip === ip)

  return (
    <div
      onClick={() => setSelectedPlayer(device)}
      className={cn(
        'flex flex-col w-68 outline outline-1 outline-accent rounded-md p-2 shadow-md',
        selectedPlayer?.ip === ip ? 'bg-primary/20' : ''
      )}
    >
      <div className="flex items-center">
        <SyncStatus ip={ip} compact={true} />
        <h3>{device.name}</h3>
      </div>
      <div className="flex  w-full">
        <PlayStatus ip={ip} />
      </div>
      <PlayQueue ip={ip} />

    </div>
  )
}

export default CompactPlayer
