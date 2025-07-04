import React from 'react'
import { useDevices } from '../../context/devicesContext'
import CompactPlayer from '../CompactPlayer'
import { AppWindow, CircleX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PlayerGridView from '../PlayerGridView'
import { useTable } from '../../context/tableContext'
import { cn } from '../../lib/utils'

const TrayView = () => {
  const { isCollapsed, setIsCollapsed, showPreset, setShowPreset } = useTable()
  return (
    <div className="flex flex-col">
      <div className="flex w-full px-3 py-1 sticky top-0 bg-background z-50 justify-between items-center">
        <h3 className="text-xl font-semibold">BluOS Player Controller</h3>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className={cn('text-2xl', showPreset ? '' : 'line-through')}
            onClick={() => setShowPreset(!showPreset)}
          >
            P
          </Button>
          <Button size="icon" variant="ghost" onClick={() => window.api.displayMainWindow()}>
            <AppWindow className="w-6 h-6 mt-1" />
          </Button>
        </div>
      </div>

      <PlayerGridView tray />
      <div className="pb-20" />
    </div>
  )
}

export default TrayView
