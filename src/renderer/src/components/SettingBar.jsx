import { EarthIcon, MusicIcon, SettingsIcon, Rows3, Layout } from 'lucide-react'
import React from 'react'
import { Button } from '../../../components/ui/button'
import ThemeControlButton from './ThemeControlButton'
import { useTable } from '../context/tableContext'
import { useStorage } from '../context/localStorageContext'
import { cn } from '../lib/utils'
import AddPlayerButton from './AddPlayerButton'
import { enabledFeatures } from '../lib/constants'

const SettingBar = () => {
  const isMacOS = window.electron.process.platform === 'darwin'
  const { isCollapsed, setIsCollapsed, showPreset, setShowPreset } = useTable()
  const { useModernUI, toggleModernUI } = useStorage()
  return (
    <div className="h-screen flex flex-col justify-start mx-auto  bgred gap-y-2 w-10">
      {enabledFeatures.browser && (
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="icon"
          className={cn('p-1 hover:bg-accent rounded-md', isCollapsed ? 'bg-accent' : '')}
        >
          <EarthIcon className="w-6 h-6" />
        </Button>
      )}
      {enabledFeatures.darkMode && (
        <Button variant="ghost" className="p-1 hover:bg-accent rounded-md">
          <ThemeControlButton />
        </Button>
      )}
      {enabledFeatures.addPlayer && !isMacOS && <AddPlayerButton />}
      <Button
        variant="ghost"
        size="icon"
        className={cn('text-2xl', showPreset ? '' : 'line-through')}
        onClick={() => setShowPreset(!showPreset)}
      >
        P
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleModernUI}
        className={cn("p-1 hover:bg-accent rounded-md", useModernUI ? "bg-accent/50" : "")}
        title={useModernUI ? "Switch to Classic Table View" : "Switch to Modern Card View"}
      >
        {useModernUI ? <Layout className="w-6 h-6" /> : <Rows3 className="w-6 h-6" />}
      </Button>
    </div>
  )
}

export default SettingBar
