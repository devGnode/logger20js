import "lib-utils-ts/src/globalUtils";
import { filterLogLevel, Loggable, strLogLevel } from "./Loggable";
import { Loader } from "./loader";
/****
 * Minimal logger in js-ts.
 *
 * npm     : logger20js-ts
 * version:  1.2.3
 * Licence : Apache-2.0
 */
export declare abstract class AbsLogger implements Loggable {
    /**
     * static Pattern
     */
    static readonly DEFAULT_LOG_PATTERN_MONO: string;
    static readonly WEBDRIVER_LOG_PATTERN_COLORED: string;
    static readonly EXPRESS_MIDDLEWARE_PATTERN: string;
    static readonly STATS_MEMORY_PATTERN: string;
    static readonly CPU_USAGE_PATTERN: string;
    static readonly VERSION_USAGE_PATTERN: string;
    /***
     */
    private static readonly COLORS_REGEXP;
    /***
     * All properties configuration
     */
    protected static parser: String;
    protected static outputLog: string;
    protected static saveLog: boolean;
    protected static logStdout: boolean;
    protected static logLevel: filterLogLevel<strLogLevel>;
    protected static colorize: boolean;
    protected static cleanUpBeforeSave: boolean;
    protected static logRotate: string;
    protected static rotateOutOfTimestamp: Date;
    /**
     * output file uuid
     */
    static oid: String;
    /***
     * handles
     */
    protected static pipeStdout: InstanceType<any>;
    protected static propertiesConfig: InstanceType<any>;
    protected static fileNamePattern: String;
    protected static logfileReuse: String;
    protected static fileMaxSize: number;
    /***
     * object configuration properties
     */
    protected prop: Object;
    protected name: String;
    protected pattern: String;
    /***
     *
     * @param name
     */
    protected constructor(name?: String);
    warn(...args: any[]): void;
    log(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    error(...args: any[]): void;
    custom(...args: any[]): void;
    setPattern(pattern?: String): Loggable;
    setProp(key: string | number, value: any): Loggable;
    setPropObject(...args: Object[]): Loggable;
    /***
     *
     * Static Configuration
     */
    static setPropertiesConfigHandle(handle?: any): void;
    static setOutputLog(path?: string): void;
    static setSaveLog(save?: boolean): void;
    static setLogStdout(stdout?: boolean): void;
    /***
     * use  : setPattern method
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
    protected static restartRotate(): void;
    /***
     *
     * @param color
     */
    protected static translateColorToInt(color?: string): String;
    /***
     *
     */
    static getLoggerFileName(): String;
    /***
     * @param message
     * @param type
     * @param colorize
     */
    protected static colorizeString(message?: string, type?: string, colorize?: boolean): string;
    /***
     * @param message
     * @param type
     * @param name
     * @param dat
     */
    protected static parseString(message?: String, type?: string, name?: string, dat?: Object): String;
    /***
     * @param type, message [, Object .... ]
     */
    protected static stdout(): void;
}
/***
 * exportable usable Logger Object
 */
export declare class Logger extends AbsLogger {
    /***
     *
     * @param name
     */
    constructor(name?: String);
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
    version(pattern?: string): void;
    static getInstance(): Stats;
}
export {};
