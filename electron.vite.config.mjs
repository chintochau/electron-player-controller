import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/index.html'),
          trayMain: resolve(__dirname, 'src/renderer/trayIndex.html')
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve(__dirname, './src')
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    plugins: [react()],
    esbuild: {
      loader: 'tsx',
      include: /\.[jt]sx?$/,
      exclude: []
    }
  }
})
