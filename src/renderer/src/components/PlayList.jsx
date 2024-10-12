import React, { useEffect, useState } from 'react'
import { useDevices } from '../context/devicesContext'
import { columns } from './PlayerList/colums'
import { DataTable } from './PlayerList/data-table'


export const goToIpAddress = (ip) => {
  window.open(`http://${ip}/`, '_blank')
}

export const playerControl = async (ip, control, param) => {
  const res = await window.api.playerControl(ip, control, param)
}

const PlayList = () => {
  const { devices } = useDevices()
  return (
    <div className='pb-40 mx-10'>
        <DataTable
          columns={columns}
          data={devices}
        />
    </div>
  )

}

export default PlayList
