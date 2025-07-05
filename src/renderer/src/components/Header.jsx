import React from 'react'
import { cn } from '../lib/utils'
import { useStorage } from '../context/localStorageContext'
import { Button } from '@/components/ui/button'
import { LayoutGrid, LayoutList } from 'lucide-react'

const Header = ({ isCollapsed }) => {
  const { useModernUI, toggleModernUI } = useStorage()
  
  return (
    <div className="flex h-14 items-center px-6 border-b">
      <h1 className="text-xl font-semibold flex-1">
        BluOS <span className={cn('text-muted-foreground', isCollapsed ? 'hidden' : 'inline')}>Player Controller</span>
      </h1>
      {!isCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleModernUI}
          className="flex items-center gap-2 text-sm"
        >
          {useModernUI ? (
            <>
              <LayoutGrid className="h-4 w-4" />
              Modern View
            </>
          ) : (
            <>
              <LayoutList className="h-4 w-4" />
              Classic View
            </>
          )}
        </Button>
      )}
    </div>
  )
}

export default Header
