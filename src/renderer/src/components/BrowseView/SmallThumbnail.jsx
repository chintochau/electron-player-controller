import React from 'react'
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

const SmallThumbnail = ({
  smallThumbnail,
  className,
  aspectRatio = 'portrait',
  isArtist,
  ...props
}) => {
  const { performAction } = useSdui()
  const { getImagePath } = useBrowsing()

  const { $, action } = smallThumbnail || {}
  const { title } = $ || {}

  const resultType = action[0]?.$?.resultType || action[0]?.$?.type
  const actionType = action[0]?.$?.type

  const IconComponent = getIconForType(resultType)

  const handleClick = () => {
    performAction(action)
  }

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger onClick={handleClick}>
          <div className="relative overflow-hidden rounded-md group transition ease-out duration-300 active:scale-110">
            <img
              src={getImagePath(smallThumbnail?.$?.icon)}
              className={cn(
                'h-40 w-40 object-cover transition-all hover:scale-105',
                aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
                isArtist ? 'rounded-full' : ''
              )}
            />
            <div className="absolute bottom-0 right-0 p-1 m-2 bg-accent/80 rounded-md">
              {IconComponent && <IconComponent className="h-6 w-6" />}
            </div>
            {renderComponent(actionType)}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Add to Library</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
              {playlists.map((playlist) => (
                <ContextMenuItem key={playlist}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                  </svg>
                  {playlist}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Play Later</ContextMenuItem>
          <ContextMenuItem>Create Station</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none w-40 text-wrap">{smallThumbnail.$?.title}</h3>
        <p className="text-xs text-muted-foreground w-40 text-wrap">{smallThumbnail.$?.subTitle}</p>
      </div>
    </div>
  )
}

export default SmallThumbnail
