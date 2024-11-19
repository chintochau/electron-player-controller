import React from 'react'
import { useDevices } from '../../context/devicesContext'
import CompactPlayer from '../CompactPlayer'
import { AppWindow, CircleX } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TrayView = () => {
  const { devices } = useDevices()
  return (
    <div className='flex flex-col'>
      <div className='flex w-full px-3 py-1 sticky top-0 bg-background z-50 justify-between items-center'>
        <h3 className='text-xl font-semibold'>BluOS Player Controller</h3>
        <Button size='icon' variant='ghost' onClick={() => window.api.displayMainWindow()
        }>
          <AppWindow />
        </Button>
      </div>
      <div className='flex flex-col px-3 py-2 gap-2'>
        {devices.map((device) => (
          <div className='flex flex-col' key={device.ip}>
            <CompactPlayer ip={device.ip} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrayView
