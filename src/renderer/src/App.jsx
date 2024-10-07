import { Button } from '../../components/ui/button'
import { Toaster } from '../../components/ui/toaster'
import AddPlayerButton from './components/AddPlayerButton'
import PlayList from './components/PlayList'
import { StorageProvider } from './context/localStorageContext'
import { RefreshProvider } from './context/refreshContext'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <RefreshProvider>
        <StorageProvider>
          <div className="flex">
            <h1 className="text-3xl font-bold  text-center py-2 flex-1">BluOS Player Controller</h1>
            <AddPlayerButton />
          </div>
          <PlayList />
        </StorageProvider>
      </RefreshProvider>
      <Toaster />
    </>
  )
}

export default App
