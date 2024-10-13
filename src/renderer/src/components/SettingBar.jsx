import { MusicIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../../../components/ui/button'
import ThemeControlButton from './ThemeControlButton'

const SettingBar = () => {
  return (
    <div className="h-screen flex flex-col justify-start mx-auto  bgred gap-y-2">
      <button className="p-1 hover:bg-accent rounded-md">
        <MusicIcon className="w-6 h-6" />
      </button>
      <button className="p-1 hover:bg-accent rounded-md">
        <SettingsIcon className="w-6 h-6" />
      </button>
      <ThemeControlButton />
    </div>
  )
}

export default SettingBar
