import React from 'react'
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu'

import ServiceNevigationMenu from './ServiceNevigationMenu'
const ServiceMenuList = ({ musicServiceList }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-full flex justify-start flex-wrap gap-0 xl:gap-3">
        {musicServiceList
          .filter((service) => service.name !== 'Spotify')
          .map((service) => {            
            return (
                <ServiceNevigationMenu key={service.name} service={service} />
            )
          })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default ServiceMenuList
