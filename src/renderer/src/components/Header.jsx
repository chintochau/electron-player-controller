import React from 'react'
import AddPlayerButton from './AddPlayerButton'
import { ChevronRight, Moon, Sun } from 'lucide-react'

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
import { useTable } from '../context/tableContext'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons'

const Header = ({ isCollapsed }) => {
  const { setIsCollapsed } = useTable()
  return (
    <div className="flex h-12 items-center">
      <h1 className="text-3xl font-bold  text-center py-2 flex-1">
        BluOS <span className={cn(isCollapsed ? 'hidden' : 'inline')}>Player Controller</span>
      </h1>
      <AddPlayerButton />
      <Button variant="ghost" className="px-2" onClick={() => setIsCollapsed(!isCollapsed)}>
        <DoubleArrowRightIcon className={cn("duration-300 ease-out",!isCollapsed ? 'rotate-180' : 'rotate-0', 'h-4 w-4')} />
      </Button>
    </div>
  )
}

export default Header
