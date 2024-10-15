import React from 'react'

const Description = ({description}) => {
    
    const { _,$ } = description || {} 
    return (
        <div className='px-4 min-w-full prose dark:prose-invert  text-ellipsis line-clamp-3'><div dangerouslySetInnerHTML={{__html: description._}}/></div>
    )

}

export default Description