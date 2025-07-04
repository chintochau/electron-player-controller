import React, { useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

const appMenuList = [
  { name: 'Home', uri: ':11000/ui/Home?playnum=1', icon: Home },
  {
    name: 'Favourites',
    uri: ':11000/ui/Favourites?service=Tunein&sort=alpha&playnum=1',
    icon: Star
  },
  { name: 'Sources', uri: ':11000/ui/Sources?playnum=1', icon: Music }
]

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'

import ServiceNevigationMenu from './ServiceNevigationMenu'
import { useBrowsing } from '../../context/browsingContext'
import { useStorage } from '../../context/localStorageContext'
import { BookmarkIcon, Home, Music, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
const ServiceMenuList = ({ musicServiceList }) => {
  const { displayMainScreen, setUrl, url } = useBrowsing()
  const { bookmarks, addToBookmarks, removeFromBookmarks } = useStorage()
  const [bookmarkName, setBookmarkName] = useState('')
  return (
    <div className="flex">
      <NavigationMenu>
        <NavigationMenuList className="w-full flex justify-start flex-wrap gap-0 xl:gap-3 ">
          {appMenuList.map((app) => {
            const IconComponent = app.icon
            return (
              <NavigationMenuItem key={app.name}>
                <NavigationMenuLink
                  className={
                    navigationMenuTriggerStyle() + ' cursor-pointer h-6 px-1 xl:h-10 xl:px-2 '
                  }
                  onClick={() => {
                    setUrl(app.uri)
                    displayMainScreen(app.uri)
                  }}
                >
                  {app.icon && <IconComponent className="size-5 mr-2 text-primary/90" />}
                  {app.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
          {musicServiceList
            .filter((service) => service.name !== 'Spotify')
            .map((service) => {
              return <ServiceNevigationMenu key={service.name} service={service} />
            })}
          {bookmarks.map((bookmark, index) => {
            return (
              <ContextMenu key={bookmark.name + index}>
                <ContextMenuTrigger>
                  <NavigationMenuItem key={bookmark.name + index}>
                    <NavigationMenuLink
                      className={
                        navigationMenuTriggerStyle() + ' cursor-pointer h-6 px-1 xl:h-10 xl:px-2 '
                      }
                      onClick={() => {
                        setUrl(bookmark.uri)
                        displayMainScreen(bookmark.uri)
                      }}
                    >
                      <BookmarkIcon className="w-4 h-4 mr-1" /> {bookmark.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => removeFromBookmarks(index)}
                    className=" text-red-500"
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost" size="icon">
            <BookmarkIcon className="w-6 h-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex gap-x-2">
          <Input
            placeholder="Enter name to bookmark"
            value={bookmarkName}
            onChange={(e) => setBookmarkName(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (bookmarkName.length > 0) {
                addToBookmarks({ name: bookmarkName, uri: url })
              }
            }}
          >
            Save
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ServiceMenuList
