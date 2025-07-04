import React, { useEffect } from 'react'
import { useSdui } from '../../context/sduiContext'
import { useBrowsing } from '../../context/browsingContext'

const Playlist = ({ playlists }) => {
  const { browseContext } = useSdui()
  const { setUrl, displayMainScreen } = useBrowsing()

  const { $, name } = playlists || {}
  const { service } = $ || {}

  useEffect(() => {
    const uri = browseContext(playlists)
  }, [])
  return (
    <div>
      <h1 className="text-4xl text-primary font-bold pb-4">{service}</h1>
    </div>
  )
}

export default Playlist
