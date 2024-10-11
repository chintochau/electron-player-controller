import { Button } from '../../components/ui/button'
import { Toaster } from '../../components/ui/toaster'
import Footer from './components/Footer'
import Header from './components/Header'
import { DataTable } from './components/PlayerList/data-table'
import PlayList from './components/PlayList'
import { DevicesProvider } from './context/devicesContext'
import { StorageProvider } from './context/localStorageContext'
import { RefreshProvider } from './context/refreshContext'
import { TableProvider } from './context/tableContext'
import { ThemeProvider } from './context/themeContext'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <RefreshProvider>
        <StorageProvider>
          <DevicesProvider>
            <TableProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <Header />
              <PlayList />
              <Footer />
            </ThemeProvider>
            </TableProvider>
          </DevicesProvider>
        </StorageProvider>
      </RefreshProvider>
      <Toaster />
    </>
  )
}

export default App
