/***
 *
 */
import {Colorize} from "./Colorize";
import {IPropertiesFile} from "lib-utils-ts/src/Interface";
/**
 * Type
 */
export declare type filterLogLevel<T> = String[] | [...T[]];
export declare type strLogLevel = "ALL" | "LOG" | "DEBUG" | "ERROR" | "INFO" | "CUSTOM" | "WARN";
/**
 * Loggable Interface
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
    setProp( key : string|number, value : any ) :Loggable
    /***
     *
     */
    setPropObject( ... args : Object[] ) :Loggable
}
export interface Pipe<E> {
    write( message : E ) : E|void
}
/***
 * If you use yor owns properties file, implement your PropertiesFile class
 * with this interfaces.
 */
export interface IPropertiesFileA extends IPropertiesFile<string, any>{}
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
