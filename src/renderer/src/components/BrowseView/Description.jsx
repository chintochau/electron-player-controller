import React from 'react'

const Description = ({ description, lines }) => {
  const { _, $ } = description || {}
  return (
    <div className={`pt-4  min-w-full prose dark:prose-invert  text-ellipsis line-clamp-${lines}`}>
      <div dangerouslySetInnerHTML={{ __html: description._ }} />
      {/* Blurred top edge */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent"></div>
      {/* Blurred bottom edge */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  )
}

export default Description
