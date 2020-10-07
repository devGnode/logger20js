import "lib-utils-ts/src/globalUtils";
import { filterLogLevel, Loggable, strLogLevel } from "./Loggable";
import { Loader } from "./loader";
/****
 * Minimal logger in js-ts.
 * I hope this code can be utils to somebody :)
 *
 * npm     : logger20js-ts
 * version:  1.2.3
 * Licence : Apache-2.0
 */
export declare class Logger implements Loggable {
    /**
     * static Pattern
     */
    static readonly DEFAULT_LOG_PATTERN_MONO: string;
    static readonly WEBDRIVER_LOG_PATTERN_COLORED: string;
    static readonly EXPRESS_MIDDLEWARE_PATTERN: string;
    static readonly STATS_MEMORY_PATTERN: string;
    static readonly CPU_USAGE_PATTERN: string;
    /***
     */
    private static readonly COLORS_REGEXP;
    /***
     * Basic configuration
     */
    private static parser;
    private static outputLog;
    private static saveLog;
    private static logStdout;
    private static logLevel;
    private static colorize;
    private static cleanUpBeforeSave;
    private static logRotate;
    private static rotateOutOfTimestamp;
    /**
     * output file
     */
    static oid: String;
    /***
     * handles
     */
    private static pipeStdout;
    private static propertiesConfig;
    private static fileNamePattern;
    private static logfileReuse;
    private static fileMaxSize;
    /***
     * others
     */
    private prop;
    private name;
    private pattern;
    constructor(name?: String);
    warn(...args: any[]): void;
    log(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    error(...args: any[]): void;
    custom(...args: any[]): void;
    setPattern(pattern?: String): Logger;
    setProp(key: string | number, value: any): Logger;
    setPropObject(...args: Object[]): Logger;
    static setPropertiesConfigHandle(handle?: any): void;
    static setOutputLog(path?: string): void;
    static setSaveLog(save?: boolean): void;
    static setLogStdout(stdout?: boolean): void;
    /***
     * @deprecated
     */
    static setParser(parsing?: String): void;
    static setPattern(pattern?: String): void;
    static level(level?: filterLogLevel<strLogLevel>): void;
    static popLevel(logType?: strLogLevel): void;
    static pushLevel(logType?: strLogLevel): void;
    static setLogFilePattern(pattern?: String): void;
    static setFileMaxSize(bytes?: number): void;
    static setLogFileReuse(path?: String): void;
    static setPipeStdout(pipe?: Object): void;
    static setColorize(status?: boolean): void;
    static setCleanUpBeforeSave(state?: boolean): void;
    static setLogRotate(rotate?: string): void;
    private static restartRotate;
    private static translateColorToInt;
    /***
     */
    static getLoggerFileName(): String;
    /***
     * @param message
     * @param type
     * @param colorize
     */
    private static colorizeString;
    /***
     * @param message
     * @param type
     * @param name
     * @param dat
     */
    private static parseString;
    /***
     * @param type, message [, Object .... ]
     */
    private static stdout;
    /***
     * Express Route Logger Middleware
     * pattern :
     *      %protocol,
     *      %host,
     *      %port,
     *      %method,
     *      %url,
     *      %originalUrl
     *      ...
     * @param pattern
     */
    static expressRouteLoggerMiddleware(pattern?: string): Function;
    /***
     * @param sizeOf
     */
    static getLoader(sizeOf?: number): Loader;
    /***
     */
    static stats(): Stats;
    /***
     * @constructor
     * @param name
     */
    static factory(name?: String): Logger;
}
/***
 * Stats Class has been declared here
 * but i wish to move it to another place
 */
declare class Stats {
    private static readonly INSTANCE;
    private readonly Log;
    private readonly patternList;
    constructor();
    private apply;
    memory(pattern?: string): void;
    cpu(pattern?: string): void;
    version(pattern: string): void;
    static getInstance(): Stats;
}
export {};
