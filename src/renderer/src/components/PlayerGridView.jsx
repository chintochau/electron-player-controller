import React, { useState } from 'react'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { useTable } from '../context/tableContext'
import CompactPlayer from './CompactPlayer'
import { useStorage } from '../context/localStorageContext'
import { cn } from '../../../lib/utils'
import { useDevices } from '../context/devicesContext'
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { GripHorizontal } from 'lucide-react'
import { Button } from '../../../components/ui/button'

const PlayerGridView = () => {
  const { isGridMode, isCollapsed } = useTable()
  const { roomList } = useStorage()
  const { devices, addDeviceToRoom } = useDevices()
  function handleDragEnd(event) {
    const { active, over } = event

    if (over) {
      const draggedDeviceId = active.id // ID of the dragged device
      const draggedDeviceMac = active.data.current.mac

      const droppedRoomId = over.id // ID of the room where device was dropped
      addDeviceToRoom(draggedDeviceId, draggedDeviceMac, droppedRoomId)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <ScrollArea>
        {isGridMode && !isCollapsed && (
          <div className=" max-h-[calc(100vh-265px)] ">
            {roomList.sort().map((room) => (
              <Droppable id={room} key={room}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 auto-cols-min ">
                  {devices
                    .filter((device) => device.room === room)
                    .map((device) => (
                      <Draggable id={device.ip} mac={device.mac} key={device.ip}>
                        <CompactPlayer ip={device.ip} />
                      </Draggable>
                    ))}
                </div>
              </Droppable>
            ))}
          </div>
        )}
      </ScrollArea>
    </DndContext>
  )
}

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id
  })

  const { id } = props || {}
  return (
    <div ref={setNodeRef} className={cn('px-2 py-4', isOver ? '' : '')}>
      <div className="w-full border-b mb-2 flex items-center justify-between">
        <h3 className={cn('text-xl text-primary italic font-semibold')}>{id}</h3>
        <div className="flex items-center">
          <Button variant="link">Play All</Button>
          <Button variant="link">Pause All</Button>
        </div>
      </div>
      {props.children}
      {isOver && <div className="w-full h-1.5 bg-accent my-1" />}
    </div>
  )
}

function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: {
      type: 'device',
      id: props.id,
      mac: props.mac
    }
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="cursor-default relative bg-background"
      {...listeners}
      {...attributes}
    >
      <GripHorizontal className=" absolute w-6 h-6 cursor-grab top-3 right-3" />
      {props.children}
    </div>
  )
}
export default PlayerGridView
