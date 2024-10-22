import React, { useState } from 'react'
import { useSdui } from '../../context/sduiContext'
import { useBrowsing } from '../../context/browsingContext'

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
import { renderComponent } from './GUI'
import placeholder from "../../assets/noartwork.png"
import SDUIContextMenu from './SDUIContextMenu'

const SmallThumbnail = ({
  smallThumbnail,
  className,
  aspectRatio = 'portrait',
  isArtist,
  ...props
}) => {
  const { performAction } = useSdui()
  const { getImagePath,loadContextMenu } = useBrowsing()

  const { $, action,contextMenu } = smallThumbnail || {}
  const { title } = $ || {}

  const resultType = action?.[0]?.$?.resultType ?? action?.[0]?.$?.type ?? 'defaultType'
  const actionType = action?.[0]?.$?.type ?? 'defaultType'

  const IconComponent = getIconForType(resultType)
  const [contextMenuWithItems, setContextMenuWithItems] = useState(null)

  const handleClick = () => {
    performAction(action)
  }

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <ContextMenu onOpenChange={async (e) => {
        if (e && !contextMenuWithItems) {
          const menuItems = await loadContextMenu(contextMenu?.[0])
          setContextMenuWithItems(menuItems)
        }
      }}>
        <ContextMenuTrigger onClick={handleClick}>
          <div className="relative overflow-hidden rounded-md group transition ease-out duration-300 active:scale-110">
            <img
              src={getImagePath(smallThumbnail?.$?.icon)}
              className={cn(
                'h-40 w-40 object-cover transition-all hover:scale-105',
                aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
                isArtist ? 'rounded-full' : ''
              )}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = placeholder
              }}
            />
            {IconComponent && (
              <div className="absolute bottom-0 right-0 p-1 m-2 bg-accent/80 rounded-md">
                <IconComponent className="h-6 w-6" />
              </div>
            )}
            {renderComponent(actionType)}
          </div>
        </ContextMenuTrigger>
        {contextMenuWithItems && <SDUIContextMenu contextMenu={contextMenuWithItems} itemsOnly/>}

      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none w-40 text-wrap">{smallThumbnail.$?.title}</h3>
        <p className="text-xs text-muted-foreground w-40 text-wrap">{smallThumbnail.$?.subTitle}</p>
      </div>
    </div>
  )
}

export default SmallThumbnail
