import { useRef, useEffect, useState, useCallback } from 'react'
import { useSdui } from '../../context/sduiContext'
import { cn } from '../../lib/utils'
import LargeThumbnail from './LargeThumbnail'
import { ScrollArea, ScrollBar } from '../../../../components/ui/scroll-area'
import { ArrowLeftIcon, ChevronRightIcon, Loader2 } from 'lucide-react'
import SmallThumbnail from './SmallThumbnail'
import List from './List'
import MenuAction from './MenuAction'
import SDUIInput from './SDUIInput'
import SDUISource from './SDUISource'
import { InfiniteMovingCards } from '../../../../components/ui/infinite-moving-cards'
import { useBrowsing } from '../../context/browsingContext'

const Row = ({ row, index }) => {
  const { performAction } = useSdui()
  const { SDUIfetch } = useBrowsing()

  const viewportRef = useRef(null)

  const onWheel = useCallback((e) => {
    // Ignore this event unless it's a strictly vertical wheel event (horizontal wheel events are already handled by the library)
    if (!viewportRef.current || e.deltaY === 0 || e.deltaX !== 0) {
      return
    }

    // Capture up/down wheel events and scroll the viewport horizontally
    const delta = e.deltaY
    const currPos = viewportRef.current.scrollLeft
    const scrollWidth = viewportRef.current.scrollWidth

    const newPos = Math.max(0, Math.min(scrollWidth, currPos + delta))

    viewportRef.current.scrollLeft = newPos
  }, [])

  const {
    $,
    menuAction,
    input,
    list,
    largeThumbnail,
    smallThumbnail,
    action,
    source,
    teaser,
    fetch,
    message
  } = row || {}
  const { title } = $ || {}
  const isArtist = title?.toLowerCase().includes('artist') ?? false

  useEffect(() => {
    if (fetch && fetch.length > 0) {
      SDUIfetch(fetch[0], row?.$?.id)
    }
  }, [fetch])

  return (
    <>
      {title && (
        <div
          className={cn(
            'w-full flex justify-between items-center px-2 rounded-lg ',
            action?.[0]?.$ ? 'cursor-pointer hover:bg-accent/30 ' : ''
          )}
          onClick={() => {
            if (action?.[0]?.$) {
              performAction(action)
            }
          }}
        >
          <div className="w-full flex pr-10 xl:pr-0">
            <h2 className={cn('text-2xl font-medium mx-4 text-primary/90 flex')}>{title}</h2>
            {menuAction &&
              !action &&
              menuAction.map((menuActionItem, index) => {
                return <MenuAction key={'menuAction' + index} menuAction={menuActionItem} />
              })}
          </div>
          {action && action[0].$ && (
            <div className="my-1.5 xl:mr-4">
              <ChevronRightIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      )}

      {fetch && fetch.length > 0 && <div className="w-full flex items-center px-6 gap-2 text-foreground/30">
        <Loader2 className="animate-spin size-8" /> Loading your playlist
        </div>}

      {teaser && <InfiniteMovingCards items={teaser} direction="left" speed="slow" />}

      {source && (
        <ScrollArea
          className="w-full whitespace-nowrap rounded-md mb scroll-smooth focus:scroll-auto"
          onWheel={onWheel}
          ref={viewportRef}
        >
          <div
            className={cn('pb-4 px-4 grid auto-cols-min grid-flow-col gap-4 overflow-x-auto pt-2')}
          >
            {source.map((source, index) => {
              return <SDUISource source={source} key={'source' + index} />
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {input && (
        <ScrollArea
          className="w-full whitespace-nowrap rounded-md mb scroll-smooth focus:scroll-auto"
          onWheel={onWheel}
          ref={viewportRef}
        >
          <div
            className={cn(
              '',
              largeThumbnail?.length > 12 && index % 2 !== 0
                ? 'pb-4 px-4 grid auto-cols-min grid-flow-col gap-4 overflow-x-auto pt-2 grid-rows-2'
                : 'flex w-max space-x-4 p-4'
            )}
          >
            {input.map((input, index) => {
              return <SDUIInput input={input} key={'input' + index} />
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {largeThumbnail && (
        <ScrollArea
          className="w-full whitespace-nowrap rounded-md mb scroll-smooth focus:scroll-auto"
          ref={viewportRef}
          onWheel={onWheel}
        >
          <div
            className={cn(
              '',
              largeThumbnail?.length > 12 && index % 2 !== 0
                ? 'pb-4 px-4 grid auto-cols-min grid-flow-col gap-4 overflow-x-auto pt-2 grid-rows-2'
                : 'flex w-max space-x-4 p-4'
            )}
          >
            {largeThumbnail?.map((largeThumbnailItem, LTindex) => {
              return (
                <LargeThumbnail
                  key={'LargeThumbnail' + LTindex}
                  largeThumbnail={largeThumbnailItem}
                  size={index % 2 === 0 ? 'large' : 'small'}
                  isArtist={isArtist}
                />
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {smallThumbnail && (
        <ScrollArea
          className="w-full whitespace-nowrap rounded-md mb scroll-smooth focus:scroll-auto"
          ref={viewportRef}
          onWheel={onWheel}
        >
          <div
            className={cn(
              'px-4 grid auto-cols-min grid-flow-col gap-4 overflow-x-auto pt-2 pb-4',
              smallThumbnail?.length > 12 ? 'grid-rows-2' : ' '
            )}
          >
            {smallThumbnail?.map((smallThumbnailItem, STindex) => {
              return (
                <SmallThumbnail
                  key={'SmallThumbnail' + STindex}
                  smallThumbnail={smallThumbnailItem}
                  isArtist={isArtist}
                />
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {list && (
        <div id="lists" className="px-4 ">
          {list.map((list, index) => {
            return (
              <List
                key={list?.$?.id || list?.$?.title || index}
                list={list}
                index={index}
                onlyOneList={false}
              />
            )
          })}
        </div>
      )}
      {message && <p className="pb-4 px-6 text-foreground/30">{message}</p>}
    </>
  )
}

export default Row
