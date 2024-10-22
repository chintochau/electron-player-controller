import React from 'react'
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
import { MenuIcon } from 'lucide-react';
import { useBrowsing } from '../../context/browsingContext';
import { useSdui } from '../../context/sduiContext';

const SDUIContextMenu = ({ contextMenu, itemsOnly }) => {
  if (itemsOnly) {
    const { getImagePath } = useBrowsing()
    const { performAction } = useSdui()
    const { $, item } = contextMenu || {}
    console.log(contextMenu);
    return (
      <ContextMenuContent>
        {
          item?.map((subItem, index) => (
            <ContextMenuItem key={index} onClick={() => performAction(subItem.action)} className="text-base">
              <img src={getImagePath(subItem?.$?.icon)} className='w-7 aspect-square mr-2' />
              {subItem?.$?.text}
            </ContextMenuItem>
          ))
        }
      </ContextMenuContent>
    )
  }

  return <ContextMenu>
    <ContextMenuTrigger>
      <MenuIcon />
    </ContextMenuTrigger>
    <ContextMenuContent>

    </ContextMenuContent>
  </ContextMenu>
}

export default SDUIContextMenu