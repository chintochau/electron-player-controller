import React from 'react'

const Description = ({ description, lines }) => {
  const { _, $ } = description || {}
  return (
    <div className={`min-w-full prose dark:prose-invert  text-ellipsis line-clamp-${lines}`}>
      <div dangerouslySetInnerHTML={{ __html: description._ }} />
    </div>
  )
}

export default Description
