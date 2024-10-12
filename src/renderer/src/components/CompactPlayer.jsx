import React from 'react'
import { useDevices } from '../context/devicesContext'
import SyncStatus from './SyncStatus'
import PlayStatus from './PlayStatus'

const CompactPlayer = ({ ip }) => {
  const { devices } = useDevices()
  const device = devices.find((device) => device.ip === ip)
  return (
    <div className="flex flex-col w-68 outline outline-1  outline-accent rounded-md p-2 hover:bg-secondary">
      <div className="flex items-center">
        <SyncStatus ip={ip} compact={true} />
        <h3>{device.name}</h3>
      </div>
      <div className="flex  w-full">
        <PlayStatus ip={ip} />
      </div>
    </div>
  )
}

export default CompactPlayer
