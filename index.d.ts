/* eslint-disable no-var */
import { ElectronAPI } from "./src/interface";
import { Database } from "./src/db/db";

declare global {
    var database: Database;
    var electronAPI: ElectronAPI;

}
export {};


