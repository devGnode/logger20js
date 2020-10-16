import { Logger } from "./Logger";
import { Colorize } from "./Colorize";
/**
 * Type
 */
export declare type filterLogLevel<T> = String[] | [...T[]];
export declare type strLogLevel = "ALL" | "LOG" | "DEBUG" | "ERROR" | "INFO" | "CUSTOM" | "WARN";
/***
 * Extends native Object
 */
declare global {
    interface String {
        /***
         *
         */
        colorize(): Colorize;
    }
}
/**
 * Loggable
 */
export interface Loggable {
    /***
     * @param args
     */
    warn(...args: any[]): void;
    /***
     * @param args
     */
    log(...args: any[]): void;
    /***
     * @param args
     */
    info(...args: any[]): void;
    /***
     * @param args
     */
    debug(...args: any[]): void;
    /***
     * @param args
     */
    error(...args: any[]): void;
    /***
     * @param args
     */
    custom(...args: any[]): void;
    /***
     * @param pattern
     */
    setPattern(pattern: String): Logger;
}
