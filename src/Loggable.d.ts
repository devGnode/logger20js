import { Colorize } from "./Colorize";
import { IPropertiesFile } from "lib-utils-ts/src/Interface";
export declare type filterLogLevel<T> = String[] | [...T[]];
export declare type strLogLevel = "ALL" | "LOG" | "DEBUG" | "ERROR" | "INFO" | "CUSTOM" | "WARN";
export interface Loggable {
    warn(...args: any[]): void;
    log(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    error(...args: any[]): void;
    custom(...args: any[]): void;
    setPattern(pattern: String): Loggable;
    setProp(key: string | number, value: any): Loggable;
    setPropObject(...args: Object[]): Loggable;
}
export interface Pipe<E> {
    write(message: E): E | void;
}
export interface IPropertiesFileA extends IPropertiesFile<string, any> {
}
declare global {
    interface String {
        colorize(): Colorize;
    }
}
