import React from 'react'
import Row from './Row'
import List from './List'
import { useBrowsing } from '../../context/borwsingContext'
import { Loader2 } from 'lucide-react'

const GUI = ({ screen }) => {
  const { loading } = useBrowsing()
  if (loading) {
    return <div className='w-full flex justify-center items-center h-1/2'><Loader2 className='animate-spin size-20' /></div>
  }

  const { $, row, list } = screen || {}
  const { screenTitle, navigationTitle, service } = $ || {}
  const onlyOneList = screen?.list?.length === 1 && !screen?.row

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
    return "Searching..."
  }

  return (
    <div className="pt-4">
      <h1 className="text-4xl text-primary font-bold pb-4">
        {renderTitle()}
      </h1>

      <div id="rows" className="flex flex-col gap-y-2">
        {row?.map((row, index) => (
          <Row key={row?.$?.id || row?.$?.title} row={row} index={index} />
        ))}
      </div>

      <div id="lists">
        {list?.map((list, index) => (
          <List
            key={list?.$?.id || list?.$?.title || index}
            list={list}
            index={index}
            onlyOneList={onlyOneList}
          />
        ))}
      </div>

      <div className="pb-20" />
    </div>
  )
}


export default GUI
