import { useRef, useEffect, useState, useCallback } from 'react'
import { useSdui } from '../../context/sduiContext'
import { cn } from '../../lib/utils'
import LargeThumbnail from './LargeThumbnail'
import { ScrollArea, ScrollBar } from '../../../../components/ui/scroll-area'
import { ArrowLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '../../../../components/ui/button'

const Row = ({ row }) => {
  const { performAction } = useSdui()

  const viewportRef = useRef(null);

  const onWheel = useCallback((e) => {
     // Ignore this event unless it's a strictly vertical wheel event (horizontal wheel events are already handled by the library)
     if (!viewportRef.current || e.deltaY === 0 || e.deltaX !== 0) {
       return;
     }
 
 
     // Capture up/down wheel events and scroll the viewport horizontally
     const delta = e.deltaY;
     const currPos = viewportRef.current.scrollLeft;
     const scrollWidth = viewportRef.current.scrollWidth;
 
     const newPos = Math.max(0, Math.min(scrollWidth, currPos + delta));
 
     viewportRef.current.scrollLeft = newPos;
   }, []);

  

  return (
    <>
      <div
        className={cn(
          'w-full flex justify-between items-center px-2 rounded-lg',
          row?.action?.[0]?.$ ? 'cursor-pointer hover:bg-accent/30 ' : ''
        )}
        onClick={() => {
          if (row?.action?.[0]?.$) {
            performAction(row?.action)
          }
        }}
      >
        <h2 className={cn('text-xl mx-4 font-medium text-primary/90')}>{row?.$?.title ?? ''}</h2>
        {row?.action?.[0]?.$ && (
          <Button variant="ghost">
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
      {row?.largeThumbnail && (
        <ScrollArea className="w-full whitespace-nowrap rounded-md mb flex scroll-smooth focus:scroll-auto" ref={viewportRef} onWheel={onWheel}>
          <div className="flex w-max space-x-4 p-4">
            {row?.largeThumbnail?.map((largeThumbnail) => {
              return (
                <LargeThumbnail key={largeThumbnail?.$?.title} largeThumbnail={largeThumbnail} />
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </>
  )
}

export default Row
