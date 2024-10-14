import React from 'react'
import { useSdui } from '../../context/sduiContext'
import { cn } from '../../lib/utils'
import Item from './Item'


const List = ({ list, onlyOneList }) => {

  const { performAction } = useSdui()

  return (
    <div>
      <div className={cn("py-4",
        onlyOneList ?
          'grid gap-3 auto-cols-min grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 2xl:grid-cols-5' :
          'grid gap-3 auto-cols-min grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 2xl:grid-cols-5',
          )}>
        {list?.item?.map((item) => (
          <Item item={item} key={item?.$?.id} large={onlyOneList} />
        ))}
      </div>
    </div>
  )
}

export default List


