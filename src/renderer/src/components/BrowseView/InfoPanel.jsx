import React from 'react'
import { useBrowsing } from '../../context/browsingContext'

const InfoPanel = ({ infoPanel }) => {
  const { $ } = infoPanel || {}
  const { icon, text, subText } = $ || {}
  const { getImagePath } = useBrowsing()

  return (
    <div className="w-full h-1/2 flex flex-col justify-center items-center">
      <div className="w-20 h-20">{icon && <img src={getImagePath(icon)} />}</div>
      <h2 className="text-2xl">{text}</h2>
      <p className="text-sm">{subText}</p>
    </div>
  )
}

export default InfoPanel
