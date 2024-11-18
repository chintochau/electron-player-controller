import React from 'react'
import { useDevices } from '../../context/devicesContext'
import CompactPlayer from '../CompactPlayer'

const TrayView = () => {
  const { devices } = useDevices()
  return (
    <div className='flex flex-col px-3 py-2 gap-2'>
      {devices.map((device) => (
        <div className='flex flex-col' key={device.ip}>
            <CompactPlayer ip={device.ip} />
        </div>
      ))}
    </div>
  )
}

export default TrayView
