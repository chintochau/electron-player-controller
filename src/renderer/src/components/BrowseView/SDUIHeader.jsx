import { cn } from '@/lib/utils'
import React from 'react'
import { useBrowsing } from '../../context/browsingContext'
import { Button } from '@/components/ui/button'
import SDUIButton from './SDUIButton'
import Description from './Description'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import tidalLogo from '../../assets/tidal.png'
import noartwork from '../../assets/noartwork.png'

const SDUIHeader = ({ header, onlyOneListWithHeader }) => {
  const { $, button, description, viewAll } = header || {}
  const { image, title, subTitle, subSubTitle } = $ || {}

  const { getImagePath } = useBrowsing()

  return (
    <>
      <div
        className={cn(
          onlyOneListWithHeader
            ? 'lg:fixed lg:w-[calc(50vw-275px)] flex flex-col items-center p-2  gap-y-3 pt-14'
            : 'flex px-4'
        )}
      >
        <div
          className={cn(
            'absolute  translate-y-[-30%] inset-5 bg-black opacity-20 filter blur-3xl scale-150 pointer-events-none ',
            onlyOneListWithHeader ? 'z-10' : ''
          )}
          style={{ backgroundImage: `url(${image ? getImagePath(image) : tidalLogo})` }}
        />

        {image && (
          <div
            className={cn(
              'z-20',
              onlyOneListWithHeader
                ? 'w-3/5 aspect-square min-w-28 min-h-28 rounded-lg overflow-hidden bg-blue-50'
                : 'w-20 h-20 rounded-md overflow-hidden object-cover flex-shrink-0  items-center justify-center flex lg:w-1/3 lg:h-1/3 '
            )}
          >
            <img
              className="transition-all hover:scale-105 w-full h-full object-cover aspect-square "
              src={image && getImagePath(image)}
              onError={(e) => (e.target.src = noartwork)}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 justify-center items-center flex-1">
          <h3
            className={cn(
              onlyOneListWithHeader
                ? 'text-sm lg:text-lg xl:text-2xl font-bold'
                : 'text-2xl font-bold xl:text-4xl'
            )}
          >
            {title}
          </h3>

          <p className="z-20">{subTitle}</p>

          <p className="z-20">{subSubTitle}</p>

          <div className="flex flex-col xl:flex-row gap-2 z-20">
            {button &&
              button.map((item, index) => <SDUIButton button={item} key={index} index={index} />)}
          </div>

          {onlyOneListWithHeader && description && (
            <ScrollArea className={cn('', image ? 'h-64' : 'h-64 lg:h-[50vh]')}>
              {description.map((item, index) => (
                <Description key={index} description={item} lines={9} />
              ))}
            </ScrollArea>
          )}
        </div>
      </div>
      {description &&
        !onlyOneListWithHeader &&
        description.map((item, index) => <Description key={index} description={item} lines={4} />)}
    </>
  )
}

export default SDUIHeader
