import React from 'react'
import Item from './Item'

const Queue = ({ queue }) => {
    if (!queue) {
        return null
    }

    const { $, button, item } = queue
console.log(queue);

    return (
        <div className='flex flex-col'>
            {item?.map((subItem , index) => (
                <div className='border-b' key={index}><Item item={subItem} onlyOneListWithHeader /></div>
            ))}
        </div>
    )
}

export default Queue