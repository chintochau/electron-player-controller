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

  const onlyOneList = screen?.list?.length === 1 && !screen?.row
  return (
    <div className="pt-4">
      <h1 className="text-4xl text-primary font-bold pb-4">{screen && screen.$ && screen.$.screenTitle || screen && screen.$ && screen.$.navigationTitle}</h1>

      <div id="rows" className="flex flex-col gap-y-2">
        {screen?.row?.map((row, index) => {
          return <Row key={row?.$?.id || row?.$?.title} row={row} index={index} />
        })}
      </div>
      

      <div id="lists">
        {
          screen?.list?.map((list, index) => {
            return <List key={list?.$?.id || list?.$?.title || index} list={list} index={index} onlyOneList={onlyOneList} />
          })
        }
      </div>
      <div className='pb-20' />
    </div>
  )
}

export default GUI
