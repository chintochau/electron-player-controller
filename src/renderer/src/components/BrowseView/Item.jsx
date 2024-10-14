import React from 'react'
import { useBrowsing } from '../../context/borwsingContext'
import { cn } from '@/lib/utils'


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


const Item = ({ item, large }) => {
    // size = 'small' | 'large' 
    const { $ } = item
    const { image, quality, subTitle, title, duration } = $
    const { getImagePath } = useBrowsing()
    return (
        <div className={cn('flex lg:rounded-md gap-2 w-ful xl:flex-col')}>
            <ContextMenu>
                <ContextMenuTrigger>
                {image && <div className={
                cn(' rounded-md overflow-hidden object-cover flex-shrink-0 xl:flex-1 items-center justify-center flex w-14 h-14 lg:w-20 lg:h-20 xl:w-full xl:h-full')}>
                <img className='transition-all hover:scale-105 w-full h-full object-cover ' src={image && getImagePath(image)} />
            </div>}
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

                <div className={cn(image ? "" : "underline hover:text-primary cursor-pointer")}>
                    <h3 className={cn("font-medium leading-none text-wrap", image ? "" : "text-xl")}>{title}</h3>
                    <p className="text-xs text-muted-foreground w-60 text-wrap">
                        {subTitle}
                    </p>
                </div>

                <p
                    className="text-xs text-muted-foreground w-60 text-wrap">
                    {duration}
                </p>

            </div>
        </div>
    )
}

export default Item