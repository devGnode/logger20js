/***
 *
 */
import { Colorize } from "./Colorize";
/**
 * Type
 */
export declare type filterLogLevel<T> = String[] | [...T[]];
export declare type strLogLevel = "ALL" | "LOG" | "DEBUG" | "ERROR" | "INFO" | "CUSTOM" | "WARN";
/**
 * Interfaces Interface
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
    setPattern(pattern: String): Loggable;
    /***
     *
     */
    setProp(key: string | number, value: any): Loggable;
    /***
     *
     */
    setPropObject(...args: Object[]): Loggable;
}
export interface Pipe<E> {
    write(message: E): E | void;
}
/***
 * If you use yor owns properties file, implement your PropertiesFile class
 * with this interfaces.
 */
export interface IPropertiesFile<K extends string | number, V> {
    /***
     *
     * @param key
     * @param value
     */
    setProperty(key: K, value: V): void;
    /***
     *
     * @param key
     * @param defaultValue
     */
    getProperty(key: K, defaultValue?: V): V;
}
/***
 *
 */
export interface IPropertiesFileA extends IPropertiesFile<string, any> {
}
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
