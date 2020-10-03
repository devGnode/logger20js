import { Logger } from "./Logger";
export declare type filterLogLevel<T> = String[] | [...T[]];
export declare type strLogLevel = "ALL" | "LOG" | "DEBUG" | "ERROR" | "INFO" | "CUSTOM";
export interface Loggable {
    warn(...args: any[]): void;
    log(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    error(...args: any[]): void;
    custom(...args: any[]): void;
    setPattern(pattern: String): Logger;
}
