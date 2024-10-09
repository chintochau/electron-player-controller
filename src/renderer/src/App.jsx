import { Button } from '../../components/ui/button'
import { Toaster } from '../../components/ui/toaster'
import Header from './components/Header'
import PlayList from './components/PlayList'
import { StorageProvider } from './context/localStorageContext'
import { RefreshProvider } from './context/refreshContext'
import { ThemeProvider } from './context/themeContext'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <RefreshProvider>
        <StorageProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Header />
            <PlayList />
          </ThemeProvider>
        </StorageProvider>
      </RefreshProvider>
      <Toaster />
    </>
  )
}

export default App
