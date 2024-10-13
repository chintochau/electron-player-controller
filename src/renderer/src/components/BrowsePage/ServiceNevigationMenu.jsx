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

const ServiceNevigationMenu = ({ service }) => {
  const { serviceSubMenus, loadSubmenuForService, setUrl, displayMainScreen } = useBrowsing()
  const submenu = serviceSubMenus[service.id]
  const handleTriggerHover = () => {
    loadSubmenuForService(service.id)
  }

  const handleLinkClick = (uri) => {
    setUrl(uri)
    displayMainScreen(uri)
  }

  return (
    <NavigationMenuItem key={service.name}>
      <NavigationMenuTrigger
        onPointerOver={handleTriggerHover}
        onClick={() => {
          handleLinkClick(`/ui/browseMenuGroup?service=${service.id}&playnum=1`)
        }}
        className="px-1 h-6 xl:px-2 xl:h-10"
      >
        <div className="flex items-center">
          <img src={service.iconSrc} className="w-4 h-4 mr-2" />
          {service.name}
        </div>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="flex flex-col z-10 px-4 py-2">
        {submenu && submenu.screen && submenu.screen.row && (
          <>
            {submenu.screen.row.map((row) => {
              return (
                <NavigationMenuLink
                  onClick={() => handleLinkClick(row.action[0].$.URI + '&playnum=1')}
                  key={row.$.title}
                  className="text-sm cursor-pointer"
                >
                  {row.$.title}
                </NavigationMenuLink>
              )
            })}
          </>
        )}
        {submenu && submenu.screen && submenu.screen.list && (
          <>
            {submenu.screen.list.map((list, listIndex) => (
              <React.Fragment key={`list-${listIndex}`}>
                {list?.item?.map((item, itemIndex) => (
                  <NavigationMenuLink
                    key={`item-${item.$.title}-${itemIndex}`} // Combines title and index for uniqueness
                    variant="outline"
                    size="sm"
                    className="text-sm cursor-pointer text-nowrap"
                    onClick={() => {
                      handleLinkClick(item.action[0].$.URI + '&playnum=1')
                    }}
                  >
                    {item.$.title}
                  </NavigationMenuLink>
                ))}
              </React.Fragment>
            ))}
          </>
        )}
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export default ServiceNevigationMenu
