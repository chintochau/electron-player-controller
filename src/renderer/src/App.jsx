import { Toaster } from '../../components/ui/toaster'

import { DevicesProvider } from './context/devicesContext'
import { StorageProvider } from './context/localStorageContext'
import { RefreshProvider } from './context/refreshContext'
import { TableProvider } from './context/tableContext'
import { ThemeProvider } from './context/themeContext'
import Dashboard from './components/Dashboard'
import { BrowsingProvider } from './context/borwsingContext'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <RefreshProvider>
        <StorageProvider>
          <DevicesProvider>
            <TableProvider>
              <BrowsingProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                  <Dashboard />
                </ThemeProvider>
              </BrowsingProvider>
            </TableProvider>
          </DevicesProvider>
        </StorageProvider>
      </RefreshProvider>
      <Toaster />
    </>
  )
}

export default App
