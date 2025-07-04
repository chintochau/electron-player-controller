import React, { useState } from 'react'
import { useBrowsing } from '../../context/browsingContext'
import { cn } from '@/lib/utils'
import noartwork from '../../assets/noartwork.png'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { PlusCircleIcon } from 'lucide-react'
import { useSdui } from '../../context/sduiContext'
import { renderComponent } from './GUI'
import { getIconForType } from '../../lib/utils'
import { PlayIcon } from '@heroicons/react/24/solid'
import SDUIContextMenu from './SDUIContextMenu'

const PresetItem = ({ item, selector, selectItem }) => {
  // size = 'small' | 'large'
  const { $, action, contextMenu } = item || {}
  const { image, quality, subtext, text, duration, track, service } = $ || {}
  const { getImagePath, loadContextMenu } = useBrowsing()
  const resultType = action?.[0]?.$?.resultType || action?.[0]?.$?.type
  const actionType = action?.[0]?.$?.type
  const IconComponent = getIconForType(resultType)
  const handleClick = () => {
    selectItem()
  }
  return (
    <div
      className={cn(
        'flex  items-center gap-2 w-full hover:bg-accent  cursor-pointer rounded-md',
        selector ? '' : 'px-1.5 py-0.5'
      )}
      onClick={handleClick}
    >
      <div className={cn(selector ? 'w-8 h-8' : 'size-14')}>
        <img
          className=" object-contain size-full"
          src={
            getImagePath(image) || getImagePath('/Sources/images/Default/' + service + 'Icon.png')
          }
          onError={(e) => (e.target.src = noartwork)}
        />
      </div>

      <div className="space-y-1 text-sm pt-1 min-w-20 w-[calc(100%-3.5rem)] xl:w-full">
        <div className="flex justify-between items-center w-full">
          <div className={cn(image ? '' : '')} onClick={handleClick}>
            <h3
              className={cn('font-medium leading-none text-wrap text-lg', image ? '' : 'text-xl')}
            >
              {track && `${track}. `} {text}
            </h3>
            <p
              className="text-xs text-muted-foreground leading-none overflow-hidden line-clamp-4 pb-0.5"
              text={subtext}
            >
              {subtext}
            </p>
          </div>
          <div className="w-8 h-8 pr-2">
            {!image && actionType === 'player-link' && (
              <PlayIcon className="text-primary w-6 h-6 opacity-0 group-hover:opacity-100 pointer-events-none" />
            )}
          </div>
        </div>

        <p className={cn('text-xs text-muted-foreground text-wrap flex justify-between w-full')}>
          {duration && <p className=" text-primary/40 text-sm">{duration}</p>}
          {quality && (
            <p
              className={`text-primary/40 border-accent bg-accent/30 p-0.5 font-bold border ${quality === 'hd' ? 'rounded-sm' : ' rounded-full'}`}
            >
              {quality.toUpperCase()}
            </p>
          )}
        </p>
      </div>
    </div>
  )
}

export default PresetItem
