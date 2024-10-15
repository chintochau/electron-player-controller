import React from 'react'
import Row from './Row'
import List from './List'
import { useBrowsing } from '../../context/browsingContext'
import { Loader2 } from 'lucide-react'
import Playlist from './Playlist'
import SDUIHeader from './SDUIHeader'
import { cn } from '@/lib/utils'

const GUI = ({ screen }) => {
  const { loading } = useBrowsing()
  if (loading) {
    return <div className='w-full flex justify-center items-center h-1/2'><Loader2 className='animate-spin size-20' /></div>
  }

  const { $, row, list, playlists, header } = screen || {}
  const { screenTitle, navigationTitle, service } = $ || {}
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
    return ""
  }

  if (screen) {
    return (
      <div className="pt-4">
        <h1 className={cn("text-4xl text-primary font-bold pb-4", onlyOneListWithHeader ? "fixed w-[calc(50vw-275px)] text-center" : "")}>
          {renderTitle()}
        </h1>

        <div className={cn(
          onlyOneListWithHeader ? 'flex' : '',
        )}>
          <div id="headers" className={cn(onlyOneListWithHeader ? 'w-1/2' : 'w-full')}>
            {header?.map((header, index) => (
              <SDUIHeader key={header?.$?.id || header?.$?.title} header={header} index={index} onlyOneListWithHeader={onlyOneListWithHeader} />
            ))}
          </div>
  
          <div id="lists" className={cn(onlyOneListWithHeader ? 'w-1/2' : 'w-full')}>
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
          {
            playlists && (
              <Playlist
                key={playlists?.$?.id || playlists?.$?.title || playlists?.$?.service || index}
                playlists={playlists}
              />
            )
          }
        </div>
      </div>
    )
  }
  return <div>
    Nothing to show
  </div>

}


export default GUI
