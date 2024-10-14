import React from 'react'
import { useSdui } from '../../context/sduiContext'
import { useBrowsing } from '../../context/borwsingContext'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { cn } from '../../lib/utils'
import { PlusCircleIcon } from 'lucide-react'

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
    'Playlist 10',
]

const LargeThumbnail = ({ largeThumbnail, className, aspectRatio = 'portrait', size,isArtist, ...props }) => {
  const { performAction } = useSdui()
  const { getImagePath } = useBrowsing()

  const sizes = {
    small: "h-40 w-40",
    large: "h-80 w-60",
    smallWidth: "w-40",
    largeWidth: "w-60"
  }
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <img
              src={getImagePath(largeThumbnail?.$?.image)}
              className={cn(
                ' object-cover transition-all hover:scale-105',
                aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
                size === "small" ? sizes.small : sizes.large,
                isArtist ? "rounded-full" : ""
              )}
            />
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
        <h3 className={cn("font-medium leading-none text-wrap", size === "small" ? sizes.smallWidth : sizes.largeWidth)}>{largeThumbnail.$?.title}</h3>
        <p className={cn("text-xs text-muted-foreground w-60 text-wrap", size === "small" ? sizes.smallWidth : sizes.largeWidth)}>{largeThumbnail.$?.subTitle}</p>
      </div>
    </div>
  )
}

export default LargeThumbnail
