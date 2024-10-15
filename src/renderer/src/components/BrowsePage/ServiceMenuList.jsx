import React from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

const appMenuList = [
  { name: 'Home', uri: '/ui/Home?playnum=1' },
  { name: 'Favourites', uri: '/ui/Favourites?service=Tunein&sort=alpha&playnum=1' },
  { name: 'Sources', uri: '/ui/Sources?playnum=1' }
]

import ServiceNevigationMenu from './ServiceNevigationMenu'
import { useBrowsing } from '../../context/browsingContext'
const ServiceMenuList = ({ musicServiceList }) => {
  const { displayMainScreen, setUrl } = useBrowsing()
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-full flex justify-start flex-wrap gap-0 xl:gap-3">
        {appMenuList.map((app) => {
          return (
            <NavigationMenuItem key={app.name}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle() + ' cursor-pointer h-6 px-1 xl:h-10 xl:px-2' }
                onClick={() => {
                  setUrl(app.uri)
                  displayMainScreen(app.uri)
                }}
              >
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
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default ServiceMenuList
