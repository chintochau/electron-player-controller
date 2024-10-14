import React from 'react'
import Row from './Row'
import List from './List'
import { useBrowsing } from '../../context/borwsingContext'
import { Loader2 } from 'lucide-react'

const GUI = ({ screen }) => {
    const {loading} = useBrowsing()
    if (loading) {
        return <div className='w-full flex justify-center items-center h-1/2'><Loader2 className='animate-spin size-20' /></div>
    }
  return (
    <div className="pt-4">
      <h1 className="text-4xl text-primary font-bold pb-4">{screen && screen.$ && screen.$.screenTitle || screen && screen.$ && screen.$.navigationTitle}</h1>

      <div id="rows" className="flex flex-col gap-y-2">
        {screen?.row?.map((row) => {
          return <Row key={row?.$?.id || row?.$?.title} row={row} />
        })}
      </div>

      <div id="lists">
        {
          screen?.list?.map((list) => {
            return <List key={list?.$?.id || list?.$?.title} list={list} />
          })
        }
      </div>
      <div className='pb-20'/>
    </div>
  )
}

export default GUI
