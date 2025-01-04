/* eslint-disable no-var */
import { ElectronAPI } from './src/preload/interface'
import { Database } from './src/main/db/db'
declare global {
  var database: Database
  var electronAPI: ElectronAPI
}
export {}
