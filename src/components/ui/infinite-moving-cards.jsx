'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { useBrowsing } from '../../renderer/src/context/browsingContext'
import SDUIButton from '../../renderer/src/components/BrowseView/SDUIButton'

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className
}) => {
  const containerRef = React.useRef(null)
  const scrollerRef = React.useRef(null)

  const { getImagePath } = useBrowsing()
  useEffect(() => {
    addAnimation()
  }, [])
  const [start, setStart] = useState(false)
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards')
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse')
      }
    }
  }
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s')
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s')
      } else {
        containerRef.current.style.setProperty('--animation-duration', '220s')
      }
    }
  }
  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-0  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_1%,white_99%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          ' flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap',
          start && 'animate-scroll ',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, idx) => {
          const { $, button } = item || {}
          const name = $.title
          const quote = $.body
          const title = $.title
          const backgroundImage = $.backgroundImage

          return (
            <li
              className="w-[350px] max-w-full relative rounded-2xl border border-b-0 border-l-0 flex-shrink-0 border-primary/40 px-8 py-6 md:w-[450px] bg-gradient-to-b from-primary/70 to-primary/50 shadow-md"
              style={{
                backgroundImage: backgroundImage && `url(${getImagePath(backgroundImage)})`
              }}
              key={name}
            >
              <blockquote>
                <h4
                  className={cn(
                    ' text-sm leading-[1.6] font-normal',
                    backgroundImage ? 'text-white/60' : 'text-primary-foreground '
                  )}
                >
                  {title}
                </h4>
                <div
                  aria-hidden="true"
                  className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>
                <span
                  className={cn(
                    'relative z-20 text-lg leading-[1.6] font-normal',
                    backgroundImage ? 'text-white' : 'text-primary-foreground '
                  )}
                >
                  {quote}
                </span>
                <div className="relative z-20 mt-6 flex flex-row items-center">
                  <span className="flex flex-col gap-1">
                    {button &&
                      button.map((btn, btnidx) => (
                        <SDUIButton
                          button={btn}
                          index={btnidx}
                          key={btnidx + 'Button'}
                          className="h-7 w-full"
                        />
                      ))}
                  </span>
                </div>
              </blockquote>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
