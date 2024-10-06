import { Toaster } from '../../components/ui/toaster'
import PlayList from './components/PlayList'
import { StorageProvider } from './context/localStorageContext'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <h1 className="text-3xl font-bold  text-center py-2">BluOS Player Controller</h1>
      <StorageProvider>
      <PlayList />
      </StorageProvider>
      <Toaster />
    </>
  )
}

export default App
