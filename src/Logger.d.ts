import './lib/StringExtends';
export declare class Logger {
    static readonly DEFAULT_LOG_PATTERN_MONO = "%time\t%name\t: %type :\t%error";
    static readonly WEBDRIVER_LOG_PATTERN_COLORED = "[%hours{cyan}] %T{w?yellow}/%name - %error";
    /***
     * Basic configuration
     */
    private static parser;
    private static outputLog;
    private static saveLog;
    private static logStdout;
    private static logLevel;
    private static colorize;
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
    constructor(name?: String);
    warn(...args: any): void;
    log(...args: any): void;
    info(...args: any): void;
    debug(...args: any): void;
    error(...args: any): void;
    custom(...args: any): void;
    static setPropertiesConfigHandle(handle?: any): void;
    static setOutputLog(path?: string): void;
    static setSaveLog(save?: boolean): void;
    static setLogStdout(stdout?: boolean): void;
    static setParser(parsing?: String): void;
    static level(level?: String[]): void;
    static setLogFilePattern(pattern?: String): void;
    static setFileMaxSize(bytes?: number): void;
    static setLogFileReuse(path?: String): void;
    static setPipeStdout(pipe?: any): void;
    static setColorize(status?: boolean): void;
    private static translateColorToInt;
    /***
     * @param type, errorMsg [, Object .... ]
     */
    private static stdout;
    /***
     * @constructor
     * @param name
     */
    static factory(name?: String): Logger;
}
