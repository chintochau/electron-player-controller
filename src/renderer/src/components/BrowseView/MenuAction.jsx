import React from 'react'
import { Button } from '../../../../components/ui/button'
import { useSdui } from '../../context/sduiContext'

const MenuAction = ({ menuAction }) => {
  const { $, action } = menuAction || {}
  const { type, text } = $ || {}

  const {performAction} = useSdui()
  return (
    <Button
      variant="link"
      size="xs"
      className="rounded-xl text-foreground/40 hover:text-foreground duration-300 transition-colors"
      onClick={() => {
        performAction(action)
      }}
    >
      {text || type}
    </Button>
  )
}

export default MenuAction
