export interface IElectronAPI {
  checkStatus: (ip: string) => Promise<any>
  playerControl: (ip: string, control: string, param?: any) => Promise<any>
  loadSDUIPage: (url: string) => Promise<any>
  checkUpgrade: (ip: string) => Promise<any>
  // Add more API methods as needed
}

declare global {
  interface Window {
    api: IElectronAPI
    electron: {
      process: {
        sandboxed: boolean
      }
    }
  }
}