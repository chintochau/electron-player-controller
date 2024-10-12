import React from 'react'
import AddPlayerButton from './AddPlayerButton'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '../context/themeContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ThemeControlButton from './ThemeControlButton'
import { cn } from '../lib/utils'

const Header = ({ isCollapsed }) => {
  const { setTheme } = useTheme()
  return (
    <div className="flex h-12">
      <ThemeControlButton />
      <h1 className="text-3xl font-bold  text-center py-2 flex-1">BluOS <span className={cn(isCollapsed ? 'hidden' : 'inline')}>Player Controller</span></h1>
      <AddPlayerButton />
    </div>
  )
}

export default Header
