import React from 'react'
import { useSdui } from '../../context/sduiContext'
import { cn } from '../../lib/utils'
import Item from './Item'


const List = ({ list, onlyOneList, onlyOneListWithHeader }) => {

  const { performAction } = useSdui()

  const { $, item } = list || {}
  const { title } = $ || {}

  const isArtist = title === 'Artists' || title === "Artist"
  return (
    <div className='z-10'>
      <h3 className='text-2xl font-bold'>{title}</h3>
      <div className={cn(onlyOneListWithHeader ? "grid-cols-1 grid gap-3" : "py-4 grid gap-3 auto-cols-min grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 2xl:grid-cols-5",
      )}>
        {list?.item?.map((item) => (
          <Item item={item} key={item?.$?.id} large={onlyOneList} onlyOneListWithHeader={onlyOneListWithHeader} isArtist={isArtist} />
        ))}
      </div>
    </div>
  )
}

export default List


