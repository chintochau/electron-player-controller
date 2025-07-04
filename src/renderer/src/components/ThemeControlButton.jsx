import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu'
import { useTheme } from '../context/themeContext'
import { Button } from '../../../components/ui/button'
import {
  Moon,
  Sun,
  Droplet,
  Waves,
  Flame,
  Flower,
  Flower2,
  Clover,
  Rainbow,
  Mountain
} from 'lucide-react'
import { DropdownMenuLabel, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'

const ThemeControlButton = () => {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun
            className={`h-6 w-6 rotate-0 scale-100 transition-all ${theme !== 'light' && 'scale-0 hidden'}`}
          />
          <Moon
            className={`absolute h-6 w-6  scale-0 transition-all ${theme === 'dark' && 'rotate-0 scale-100'}`}
          />
          <Droplet
            className={`absolute h-6 w-6  scale-0 transition-all ${theme === 'ocean' && 'rotate-0 scale-100'}`}
          />
          <Waves
            className={`absolute h-6 w-6  scale-0 transition-all ${theme === 'darkOcean' && 'rotate-0 scale-100'}`}
          />
          <Flame
            className={`absolute h-6 w-6  scale-0 transition-all ${theme === 'rose' && 'rotate-0 scale-100'}`}
          />
          <Clover
            className={`absolute h-6 w-6  scale-0 transition-all ${theme === 'darkRose' && 'rotate-0 scale-100'}`}
          />

          <Flower
            className={`absolute h-6 w-6  scale-0 transition-all ${theme === 'lavender' && 'rotate-0 scale-100'}`}
          />
          <Flower2
            className={`absolute h-6 w-6  scale-0 transition-all ${theme === 'darkLavender' && 'rotate-0 scale-100'}`}
          />
          <Mountain
            className={`absolute h-6 w-6  scale-0 transition-all ${theme === 'darkMountain' && 'rotate-0 scale-100'}`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ocean')}>Ocean</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('darkOcean')}>Dark Ocean</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('rose')}>Rose</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('darkRose')}>Dark Rose</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('lavender')}>Lavender</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('darkLavender')}>Dark Lavender</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('darkMountain')}>Mountain</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeControlButton
