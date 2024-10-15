import { EarthIcon, MusicIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../../../components/ui/button'
import ThemeControlButton from './ThemeControlButton'
import { useTable } from '../context/tableContext'
import { cn } from '../lib/utils'
import AddPlayerButton from './AddPlayerButton'
import { enabledFeatures } from '../lib/constants'

const SettingBar = () => {
  const { isCollapsed, setIsCollapsed,showPreset,setShowPreset } = useTable()
  return (
    <div className="h-screen flex flex-col justify-start mx-auto  bgred gap-y-2 w-10">
      {enabledFeatures.browser && <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="ghost"
        size="icon"
        className={cn('p-1 hover:bg-accent rounded-md', isCollapsed ? 'bg-accent' : '')}
      >
        <EarthIcon className="w-6 h-6" />
      </Button>}
      {enabledFeatures.darkMode && <Button variant="ghost" className="p-1 hover:bg-accent rounded-md">
        <ThemeControlButton />
      </Button>}
      {enabledFeatures.addPlayer && <AddPlayerButton />}
      {/* <Button variant="ghost" size="icon" className={cn("text-2xl", showPreset ? '' : 'line-through')} onClick={() => setShowPreset(!showPreset)}>P</Button> */}

    </div>
  )
}

export default SettingBar
