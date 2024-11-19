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

const Item = ({ item, isArtist, onlyOneListWithHeader,index }) => {
  // size = 'small' | 'large'
  const { $, action, contextMenu } = item || {}
  const { image, quality, subTitle, title, duration, track,counter } = $ || {}
  const { getImagePath,loadContextMenu } = useBrowsing()
  const { performAction } = useSdui()

  const resultType = action?.[0]?.$?.resultType || action?.[0]?.$?.type
  const actionType = action?.[0]?.$?.type

  const IconComponent = getIconForType(resultType)
  const [contextMenuWithItems, setContextMenuWithItems] = useState(null)
  const handleClick = () => {
    performAction(action)
  }

  return (
    <div
      className={cn(
        'flex lg:rounded-md gap-2 w-full xl:flex-col group ease-out duration-300 active:scale-110',
        onlyOneListWithHeader
          ? 'flex-row xl:flex-row hover:bg-accent cursor-pointer p-2 rounded-md'
          : '',
          !onlyOneListWithHeader&&!image
            ? `${index % 2 === 0 ? 'bg-primary/10' : ' bg-primary/20'} shadow-md lg:pl-2.5 pb-2.5 pt-5 hover:bg-primary/50 cursor-pointer rounded-md items-end justify-end duration-300 ease-out active:scale-110 transition-all`
            : ''
      )}
      onClick={handleClick}
    >
      <ContextMenu onOpenChange={async (e) => {
        if (e && !contextMenuWithItems) {
          const menuItems = await loadContextMenu(contextMenu?.[0])
          setContextMenuWithItems(menuItems)
        }
      }}>
        <ContextMenuTrigger onClick={handleClick} >
          {image && (
            <div
              className={cn(
                'relative group shadow-md',
                onlyOneListWithHeader
                  ? 'h-20 w-20 overflow-hidden rounded-md'
                  : ' w-20 h-20 rounded-md overflow-hidden object-cover flex-shrink-0 xl:flex-1 items-center justify-center flex  lg:w-20 lg:h-20 xl:w-full xl:h-full',
                isArtist ? 'rounded-full' : ''
              )}
            >
              <img
                className="transition-all group-hover:scale-105 w-full h-full object-cover aspect-square "
                src={image && getImagePath(image)}
                onError={(e) => (e.target.src = noartwork)}
              />
              {IconComponent && <div className="absolute bottom-0 right-0 p-1 m-2 bg-accent/80 rounded-md">
                <IconComponent className="h-6 w-6" />
              </div>}
              {renderComponent(actionType, 10)}
            </div>
          )}
        </ContextMenuTrigger>
        {contextMenuWithItems && <SDUIContextMenu contextMenu={contextMenuWithItems} itemsOnly/>}
      </ContextMenu>

      <div className="space-y-1 text-sm pt-1 min-w-20 w-[calc(100%-3.5rem)] xl:w-full">
        <div className="flex justify-between items-center w-full">
          <div
            className={cn(image ? '' : 'underline hover:text-primary cursor-pointer')}
            onClick={handleClick}
          >
            <h3
              className={cn('font-medium leading-none text-wrap text-lg', image ? '' : 'text-xl')}
            >
              {track && `${track}. `} {title}
            </h3>
            <p
              className="text-xs text-muted-foreground leading-none overflow-hidden line-clamp-4 pb-0.5"
              title={subTitle}
            >
              {subTitle}
            </p>
          </div>
          <div className="w-8 h-8 pr-2">
            {!image && actionType === "player-link" && <PlayIcon className="text-primary w-6 h-6 opacity-0 group-hover:opacity-100 pointer-events-none" />}
          </div>
        </div>

        <p
          className={cn(
            'text-xs text-muted-foreground text-wrap flex justify-between w-full',
            onlyOneListWithHeader ? 'w-full' : ''
          )}
        >
          {duration && <p className=' text-primary/40 text-sm'>{duration}</p>}
          {quality && <p className={`text-primary/40 border-accent bg-accent/30 p-0.5 font-bold border ${quality === "hd" ? "rounded-sm" : " rounded-full"}`}>{quality.toUpperCase()}</p>}
        </p>
      </div>
    </div>
  )
}

export default Item
