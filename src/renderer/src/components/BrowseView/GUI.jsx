import React, { useRef } from 'react'
import Row from './Row'
import List from './List'
import { useBrowsing } from '../../context/browsingContext'
import { Loader2 } from 'lucide-react'
import Playlist from './Playlist'
import SDUIHeader from './SDUIHeader'
import { cn } from '@/lib/utils'
import { useSdui } from '../../context/sduiContext'
import { PlayIcon } from '@heroicons/react/24/solid'
import InfoPanel from './InfoPanel'

const GUI = ({ screen }) => {
  if (!useSdui || !useBrowsing) {
    return <Loader2 className="animate-spin size-20" />
  }
  const { loading, getImagePath } = useBrowsing()
  const {} = useSdui()

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-1/2">
        <Loader2 className="animate-spin size-20" />
      </div>
    )
  }

  const { $, row, list, playlists, header, infoPanel } = screen || {}
  const { screenTitle, navigationTitle, service, navigationIcon } = $ || {}
  const onlyOneList = screen?.list?.length === 1 && !screen?.row
  const onlyOneListWithHeader = onlyOneList && header

  const renderTitle = () => {
    if (service && screenTitle) {
      return screenTitle + ' - ' + service
    }
    if (screenTitle) {
      return screenTitle
    }
    if (navigationTitle) {
      return navigationTitle
    }
    if (service) {
      return service
    }
    return ''
  }

  if (screen) {
    return (
      <div className="pt-4">
        <div
          className={cn(
            'text-4xl text-primary font-bold pb-4 flex items-center gap-3',
            onlyOneListWithHeader ? 'lg:fixed lg:w-[calc(50vw-275px)] text-center' : ''
          )}
        >
          {navigationIcon && (
            <div className="w-14 h-14 flex items-center">
              <img className="bg-primary/30 rounded-xl p-1" src={getImagePath(navigationIcon)} />
            </div>
          )}
          <h1 id={screen.searchId ? screen.searchId : 'screenTitle'}>{renderTitle()}</h1>
        </div>

        <div className={cn(onlyOneListWithHeader ? 'flex flex-col lg:flex-row' : 'mb-2')}>
          <div id="headers" className={cn(onlyOneListWithHeader ? 'w-full lg:w-1/2' : 'w-full')}>
            {header?.map((header, index) => (
              <SDUIHeader
                key={header?.$?.id || header?.$?.title}
                header={header}
                index={index}
                onlyOneListWithHeader={onlyOneListWithHeader}
              />
            ))}
          </div>

          <div id="lists" className={cn(onlyOneListWithHeader ? 'w-full lg:w-1/2' : 'w-full')}>
            {list?.map((list, index) => (
              <List
                key={list?.$?.id || list?.$?.title || index}
                list={list}
                index={index}
                onlyOneList={onlyOneList}
                onlyOneListWithHeader={onlyOneListWithHeader}
              />
            ))}
          </div>
        </div>

        <div id="rows" className="flex flex-col gap-y-2">
          {row?.map((row, index) => (
            <Row key={row?.$?.id || row?.$?.title} row={row} index={index} />
          ))}
        </div>

        <div>
          {playlists && (
            <Playlist
              key={playlists?.$?.id || playlists?.$?.title || playlists?.$?.service || index}
              playlists={playlists}
            />
          )}
        </div>
        {infoPanel &&
          infoPanel.map((infoPanelItem, index) => (
            <InfoPanel key={index} infoPanel={infoPanelItem} />
          ))}
      </div>
    )
  }
  return <div>Nothing to show</div>
}

export default GUI

export const renderComponent = (type, size = 20, rounded = false) => {
  switch (type) {
    case 'player-link':
      return (
        <>
          <div
            className={cn(
              'absolute inset-0 bg-black transition  ease-in-out  duration-300 opacity-0 group-hover:opacity-50',
              rounded ? 'rounded-md' : ''
            )}
          ></div>
          <PlayIcon
            src="overlay-image-url.png"
            alt="Overlay Image"
            className={`text-white absolute z-20 inset-0 w-${size} h-${size} object-cover opacity-0 group-hover:opacity-100 mx-auto my-auto pointer-events-none`}
          />
        </>
      )
  }
}
