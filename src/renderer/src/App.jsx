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
import { PresetProvider } from './context/presetContext'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <DndContext>
        <RefreshProvider>
          <StorageProvider>
            <DevicesProvider>
              <SetupProvider>
                <TableProvider>
                  <PresetProvider>
                    <BrowsingProvider>
                      <SDUIProvider>
                        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                          <Dashboard />
                        </ThemeProvider>
                      </SDUIProvider>
                    </BrowsingProvider>
                  </PresetProvider>
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

export default App
