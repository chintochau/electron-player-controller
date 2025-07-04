import React from 'react'
import { useBrowsing } from '../../context/browsingContext'
import { cn } from '@/lib/utils'

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

const SDUIService = ({ service, isArtist, onlyOneListWithHeader }) => {
  // size = 'small' | 'large'
  const { $, action } = service || {}
  const { icon, quality, subTitle, title, duration, track } = $ || {}
  const { getImagePath } = useBrowsing()
  const { performAction } = useSdui()

  const resultType = action?.[0]?.$?.resultType || action?.[0]?.$?.type
  const actionType = action?.[0]?.$?.type

  const IconComponent = getIconForType(resultType)

  const handleClick = () => {
    performAction(action)
  }

  return (
    <div
      className={cn(
        'flex lg:rounded-lg gap-2 w-ful xl:flex-col group ease-out duration-300 active:scale-110 ',
        onlyOneListWithHeader
          ? 'flex-row xl:flex-row hover:bg-accent cursor-pointer p-2 rounded-md'
          : ''
      )}
      onClick={handleClick}
    >
      <ContextMenu>
        <ContextMenuTrigger onClick={handleClick}>
          {icon && (
            <div
              className={cn(
                'relative group shadow-md',
                onlyOneListWithHeader
                  ? 'h-20 w-20 overflow-hidden rounded-md'
                  : ' w-20 h-20 rounded-lg xl:rounded-3xl overflow-hidden object-cover flex-shrink-0 xl:flex-1 items-center justify-center flex  lg:w-20 lg:h-20 xl:w-full xl:h-full',
                isArtist ? 'rounded-full' : ''
              )}
            >
              <img
                className="transition-all group-hover:scale-105 w-full h-full object-cover aspect-square "
                src={icon && getImagePath(icon)}
              />
              {IconComponent && (
                <div className="absolute bottom-0 right-0 p-1 m-2 bg-accent/80 rounded-md">
                  <IconComponent className="h-6 w-6" />
                </div>
              )}
              {renderComponent(actionType, 10)}
            </div>
          )}
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

      <div className="space-y-1 text-sm pt-1 min-w-20 w-[calc(100%-3.5rem)] xl:w-full">
        <div className="flex justify-between items-center w-full">
          <div
            className={cn(icon ? '' : 'underline hover:text-primary cursor-pointer')}
            onClick={handleClick}
          >
            <h3 className={cn('font-medium leading-none text-wrap text-lg', icon ? '' : 'text-xl')}>
              {track && `${track}. `} {title}
            </h3>
            <p
              className="text-xs text-muted-foreground leading-none overflow-hidden line-clamp-4"
              title={subTitle}
            >
              {subTitle}
            </p>
          </div>
          <div className="w-8 h-8 pr-2">
            {!icon && actionType === 'player-link' && (
              <PlayIcon className="text-primary w-6 h-6 opacity-0 group-hover:opacity-100 pointer-events-none" />
            )}
          </div>
        </div>

        <p
          className={cn(
            'text-xs text-muted-foreground w-60 text-wrap flex justify-between',
            onlyOneListWithHeader ? 'w-full' : ''
          )}
        >
          <p>{duration}</p>
          <p>{quality}</p>
        </p>
      </div>
    </div>
  )
}

export default SDUIService
