import "lib-utils-ts/src/globalUtils";
import { Loader } from "./loader";
import { filterLogLevel, Loggable, strLogLevel } from "./Loggable";
export declare class Logger implements Loggable {
    static readonly DEFAULT_LOG_PATTERN_MONO: string;
    static readonly WEBDRIVER_LOG_PATTERN_COLORED: string;
    static readonly EXPRESS_MIDDLEWARE_PATTERN: string;
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
    private name;
    private pattern;
    private prop;
    constructor(name?: String);
    warn(...args: any): void;
    log(...args: any): void;
    info(...args: any): void;
    debug(...args: any): void;
    error(...args: any): void;
    custom(...args: any): void;
    setPattern(pattern?: String): Logger;
    setProp(key: string | number, value?: any): Logger;
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
     * @param size
     */
    static getLoader(size?: number): Loader;
    /***
     * @constructor
     * @param name
     */
    static factory(name?: String): Logger;
}
