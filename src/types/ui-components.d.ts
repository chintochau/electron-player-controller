// Type definitions for shadcn/ui components
// These are simplified types - in a real project you'd want more complete types

declare module '@/components/ui/checkbox' {
  import { FC } from 'react'
  export const Checkbox: FC<any>
}

declare module '@/components/ui/button' {
  import { FC } from 'react'
  export const Button: FC<any>
}

declare module '@/components/ui/input' {
  import { FC } from 'react'
  export const Input: FC<any>
}

declare module '@/components/ui/label' {
  import { FC } from 'react'
  export const Label: FC<any>
}

declare module '@/components/ui/badge' {
  import { FC } from 'react'
  export const Badge: FC<any>
}

declare module '@/components/ui/slider' {
  import { FC } from 'react'
  export const Slider: FC<any>
}

declare module '@/components/ui/dropdown-menu' {
  import { FC } from 'react'
  export const DropdownMenu: FC<any>
  export const DropdownMenuContent: FC<any>
  export const DropdownMenuItem: FC<any>
  export const DropdownMenuLabel: FC<any>
  export const DropdownMenuSeparator: FC<any>
  export const DropdownMenuTrigger: FC<any>
}

declare module '@/components/ui/select' {
  import { FC } from 'react'
  export const Select: FC<any>
  export const SelectContent: FC<any>
  export const SelectItem: FC<any>
  export const SelectTrigger: FC<any>
  export const SelectValue: FC<any>
}

declare module '@/components/ui/context-menu' {
  import { FC } from 'react'
  export const ContextMenu: FC<any>
  export const ContextMenuContent: FC<any>
  export const ContextMenuItem: FC<any>
  export const ContextMenuTrigger: FC<any>
}

declare module '@/hooks/use-toast' {
  export function useToast(): {
    toast: (options: { title: string; description?: string }) => void
  }
}