import { MusicIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../../../components/ui/button'
import ThemeControlButton from './ThemeControlButton'
import { useTable } from '../context/tableContext'
import { cn } from '../lib/utils'

const SettingBar = () => {
  const { isCollapsed, setIsCollapsed } = useTable()
  return (
    <div className="h-screen flex flex-col justify-start mx-auto  bgred gap-y-2">
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="ghost"
        className={cn('p-1 hover:bg-accent rounded-md', isCollapsed ? 'bg-accent' : '')}
      >
        <MusicIcon className="w-6 h-6" />
      </Button>
      <Button variant="ghost" className="p-1 hover:bg-accent rounded-md">
        <SettingsIcon className="w-6 h-6" />
      </Button>
      <ThemeControlButton />
    </div>
  )
}

export default SettingBar
