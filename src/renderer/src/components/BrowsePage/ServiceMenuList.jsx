import React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { useEffect } from 'react'
import { useBrowsing } from '../../context/borwsingContext'
import { getMusicServiceString } from '../../lib/utils'
import { Button } from '../../../../components/ui/button'
import ServiceNevigationMenu from './ServiceNevigationMenu'
const ServiceMenuList = ({ musicServiceList }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-full flex justify-start flex-wrap gap-3">
        {musicServiceList.map((service) => (
          <ServiceNevigationMenu key={service.name} service={service} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default ServiceMenuList
