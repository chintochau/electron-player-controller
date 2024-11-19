import React from 'react'
import { useSdui } from '../../context/sduiContext'

const SDUILink = ({ link }) => {
  const { $, title, text, action } = link || {}
  const { performAction } = useSdui()

  return (
    <div
      className="w-full px-6 flex gap-2 underline text-foreground/70 pb-2 cursor-pointer hover:text-primary"
      onClick={() => performAction(action)}
    >
      <h3>{title && title.map((title, index) => <span key={'title' + index}>{title}</span>)}</h3>
      <p>{text && text.map((text, index) => <span key={'text' + index}>{text}</span>)}</p>
    </div>
  )
}

export default SDUILink
