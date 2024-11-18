import { Toaster } from '../../components/ui/toaster'

import { DevicesProvider } from './context/devicesContext'
import { StorageProvider } from './context/localStorageContext'
import { RefreshProvider } from './context/refreshContext'
import { TableProvider } from './context/tableContext'
import { ThemeProvider } from './context/themeContext'
import Dashboard from './components/Dashboard'
import { BrowsingProvider } from './context/browsingContext'
import { SDUIProvider } from './context/sduiContext'
import { SetupProvider } from './context/setupContext'
import { DndContext } from '@dnd-kit/core'
import TrayView from './components/Tray/TrayView'

const Tray = () => {
  return (
    <>
      <DndContext>
        <RefreshProvider>
          <StorageProvider>
            <DevicesProvider>
             <SetupProvider>
                <TableProvider>
                  <BrowsingProvider>
                    <SDUIProvider>
                      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                        <TrayView />
                      </ThemeProvider>
                    </SDUIProvider>
                  </BrowsingProvider>
                </TableProvider>
             </SetupProvider>
            </DevicesProvider>
          </StorageProvider>
        </RefreshProvider>
      </DndContext>
      <Toaster />
    </>
  )
}

export default Tray
