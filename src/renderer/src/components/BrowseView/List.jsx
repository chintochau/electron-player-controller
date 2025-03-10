import React, { useEffect, useMemo, useRef } from 'react'
import { useSdui } from '../../context/sduiContext'
import { cn } from '../../lib/utils'
import Item from './Item'
import SDUIService from './SDUIService'
import { ChevronRightIcon, Loader2 } from 'lucide-react'
import { useBrowsing } from '../../context/browsingContext'
import SDUILink from './SDUILink'

const List = ({ list, onlyOneList, onlyOneListWithHeader }) => {
  const { performAction } = useSdui()
  const { loadNextLink, containerRef } = useBrowsing()

  const { $, item, service, action, nextLink, link } = list || {}
  const { title } = $ || {}

  const isArtist = title?.toLowerCase().includes('artist') ?? false

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current

      if (container) {
        // Get the scrollable height and current scroll position
        const scrollTop = container.scrollTop
        const scrollHeight = container.scrollHeight
        const clientHeight = container.clientHeight

        // Calculate the scroll progress
        const scrollPosition = (scrollTop + clientHeight) / scrollHeight

        // Trigger load more when scroll position exceeds 80% (0.8)
        if (scrollPosition >= 0.8 && nextLink && nextLink.length > 0) {
          console.log('nextLink', nextLink[0])

          loadNextLink(nextLink[0])
          // only load once, cleanup the event listener
          container.removeEventListener('scroll', handleScroll)
        }
      }
    }

    // Attach the scroll event listener
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    // Cleanup the event listener
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [list, nextLink, loadNextLink])

  const memoizedItems =
    useMemo(() => {
      return list?.item?.map((item, index) => (
        <Item
          item={item}
          key={item?.$?.id || 'Item' + index}
          large={onlyOneList}
          onlyOneListWithHeader={onlyOneListWithHeader}
          isArtist={isArtist}
          index={index}
        />
      ))
    }, [list]) || []

  return (
    <div className="z-10">
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
        <h3 className="text-2xl font-bold">{title}</h3>
        {action && action[0].$ && (
          <div className="my-1.5 xl:mr-4">
            <ChevronRightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {item && (
        <div
          className={cn(
            onlyOneListWithHeader
              ? 'grid-cols-1 grid gap-1'
              : 'py-4 grid gap-3 auto-cols-min grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 2xl:grid-cols-5'
          )}
        >
          {memoizedItems}
        </div>
      )}
      {service && (
        <div
          className={cn(
            onlyOneListWithHeader
              ? 'grid-cols-1 grid gap-1'
              : 'py-4 grid gap-2 xl:gap-6 auto-cols-min grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 2xl:grid-cols-5'
          )}
        >
          {list?.service?.map((service) => (
            <SDUIService
              service={service}
              key={item?.$?.id}
              large={onlyOneList}
              onlyOneListWithHeader={onlyOneListWithHeader}
              isArtist={isArtist}
            />
          ))}
        </div>
      )}

      {link && (
        <div>
          {link.map((link, index) => {
            return <SDUILink key={'link' + index} link={link} />
          })}
        </div>
      )}

      {nextLink && nextLink.length > 0 ? (
        <div className="w-full items-center justify-center flex">
          <Loader2 className="animate-spin size-10 text-secondary" />
        </div>
      ) : (
        <>
          {onlyOneList ? (
            <p className="w-full text-center text-foreground/30 text-sm py-4">No more items</p>
          ) : null}
        </>
      )}
    </div>
  )
}

export default List
