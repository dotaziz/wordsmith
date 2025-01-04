import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI } from './interface'

contextBridge.exposeInMainWorld('electronAPI', {
  query: (word: string) => ipcRenderer.invoke('dictionary:query', word),
  openSettings: () => ipcRenderer.invoke('window:open-settings'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize')
} as ElectronAPI)
