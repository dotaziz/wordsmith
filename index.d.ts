/* eslint-disable no-var */
import { ElectronAPI } from './src/preload/interface'
declare global {
  var electronAPI: ElectronAPI
}
export {}
