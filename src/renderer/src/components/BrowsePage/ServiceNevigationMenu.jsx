import React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { useEffect } from 'react'
import { useBrowsing } from '../../context/browsingContext'
import { useSdui } from '../../context/sduiContext'
import { Label } from '@/components/ui/label'

const ServiceNevigationMenu = ({ service }) => {
  const { serviceSubMenus, loadSubmenuForService, setUrl, displayMainScreen, getImagePath } =
    useBrowsing()
  const { performAction } = useSdui()
  const submenu = serviceSubMenus[service.id]
  const handleTriggerHover = () => {
    loadSubmenuForService(service.id)
  }

  const handleLinkClick = (uri) => {
    setUrl(uri)
    displayMainScreen(uri)
  }

  const itemClassName =
    'text-foreground/60 group inline-flex h-10 items-center justify-start rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer text-nowrap'

  return (
    <NavigationMenuItem key={service.name}>
      <NavigationMenuTrigger
        onPointerOver={handleTriggerHover}
        onClick={() => {
          handleLinkClick(`/ui/browseMenuGroup?service=${service.id}&playnum=1`)
        }}
        className="px-1 h-6 xl:px-2 xl:h-10 rounded-xl"
      >
        <div className="flex items-center">
          <img src={service.iconSrc} className="size-4 xl:size-5 mr-2" />
          {service.name}
        </div>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="flex flex-col z-10 px-2 py-2 rounded-xl">
        {submenu && submenu.screen && submenu.screen.row && (
          <>
            {submenu.screen.row.map((row) => {
              return (
                <NavigationMenuLink
                  onClick={() => handleLinkClick(row.action[0].$.URI + '&playnum=1')}
                  key={row.$.title}
                  className={itemClassName}
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
                {list?.$?.title && (
                  <Label className="px-2 py-1.5 text-sm font-semibold text-foreground/50">
                    {list.$.title}
                  </Label>
                )}
                {list?.item?.map((item, itemIndex) => (
                  <NavigationMenuLink
                    key={`item-${item.$.title}-${itemIndex}`} // Combines title and index for uniqueness
                    variant="outline"
                    size="sm"
                    className={itemClassName}
                    onClick={() => {
                      performAction(item.action)
                    }}
                  >
                    {item.$.image && (
                      <div className="flex w-9 h-9 mr-2 rounded-md overflow-hidden">
                        {item.$.iamge}
                        <img src={getImagePath(item.$.image)} />
                      </div>
                    )}
                    <p className="truncate">{item.$.title}</p>
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
