import React, { useState } from 'react'

import { useSdui } from '../../context/sduiContext'
import { useBrowsing } from '../../context/browsingContext'
import { BeakerIcon, PlayIcon } from '@heroicons/react/24/solid'
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
import { cn, getIconForType } from '../../lib/utils'
import { PlusCircleIcon } from 'lucide-react'
import { getHoverEffectForType } from '../../lib/utilComponents'
import { renderComponent } from './GUI'
import SDUIContextMenu from './SDUIContextMenu'

const playlists = [
  'Playlist 1',
  'Playlist 2',
  'Playlist 3',
  'Playlist 4',
  'Playlist 5',
  'Playlist 6',
  'Playlist 7',
  'Playlist 8',
  'Playlist 9',
  'Playlist 10'
]



const LargeThumbnail = ({
  largeThumbnail,
  className,
  aspectRatio = 'portrait',
  size,
  isArtist,
  ...props
}) => {
  const { performAction } = useSdui()
  const { getImagePath,loadContextMenu } = useBrowsing()
  
  const { $, action,contextMenu } = largeThumbnail || {}

  const resultType = action[0]?.$?.resultType || action[0]?.$?.type
  const actionType = action[0]?.$?.type

  const IconComponent = getIconForType(resultType)
  const [contextMenuWithItems, setContextMenuWithItems] = useState(null)

  const handleClick = () => {
    performAction(action)
  }

  const sizes = {
    small: 'h-40 w-40',
    large: 'h-80 w-60',
    smallWidth: 'w-40',
    largeWidth: 'w-60'
  }


  return (
    <div className={cn('space-y-3', className)} {...props}>
      <ContextMenu onOpenChange={async (e) => {
        if (e && !contextMenuWithItems) {
          const menuItems = await loadContextMenu(contextMenu?.[0])
          setContextMenuWithItems(menuItems)
        }
      }}>
        <ContextMenuTrigger onClick={handleClick} className="">
          <div className="transition ease-out duration-300 active:scale-110 relative overflow-hidden rounded-md group">
            <img
              src={getImagePath(largeThumbnail?.$?.image)}
              className={cn(
                ' object-cover transition-all hover:scale-105',
                aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
                size === 'small' ? sizes.small : sizes.large,
                isArtist ? 'rounded-full' : ''
              )}
              onError={(e) => {
                e.target.src = noartwork
              }}
            />
           {IconComponent &&  <div className="absolute bottom-0 right-0 p-1 m-2 bg-accent/80 rounded-md">
              <IconComponent className="h-6 w-6" />
            </div>}
            {renderComponent(actionType)}
          </div>
        </ContextMenuTrigger>
        {contextMenuWithItems && <SDUIContextMenu contextMenu={contextMenuWithItems} itemsOnly/>}

      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3
          className={cn(
            'font-medium leading-none text-wrap',
            size === 'small' ? sizes.smallWidth : sizes.largeWidth
          )}
        >
          {largeThumbnail.$?.title}
        </h3>
        <p
          className={cn(
            'text-xs text-muted-foreground w-60 text-wrap',
            size === 'small' ? sizes.smallWidth : sizes.largeWidth
          )}
        >
          {largeThumbnail.$?.subTitle}
        </p>
      </div>
    </div>
  )
}

export default LargeThumbnail
