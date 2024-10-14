import React from 'react'
import { useSdui } from '../../context/sduiContext'
import { cn } from '../../lib/utils'

const List = ({ list }) => {

  const { performAction } = useSdui()

  return (
    <div>
      <h2
        className={cn(
          'text-lg',
        )}
      >
        {list?.$?.id}
      </h2>
    </div>
  )
}

export default List
