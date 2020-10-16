"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.AbsLogger = void 0;
require("lib-utils-ts/src/globalUtils");
var readline = require("readline");
var uuid_1 = require("uuid");
var Utils_1 = require("./Utils");
var util_1 = require("util");
var lib_utils_ts_1 = require("lib-utils-ts");
var loader_1 = require("./loader");
/****
 * Minimal logger in js-ts.
 *
 * npm     : logger20js-ts
 * version:  1.2.3
 * Licence : Apache-2.0
 */
var AbsLogger = /** @class */ (function () {
    /***
     *
     * @param name
     */
    function AbsLogger(name) {
        if (name === void 0) { name = undefined; }
        var _a;
        /***
         * object configuration properties
         */
        this.prop = {};
        this.name = null;
        this.pattern = null;
        /***
         * Rewrite Logger configuration
         * getProperty :
         *  @key
         *  @defaultValue
         */ /***
           + Next Feature
           + in real that make no sense to define this here, if you have declared all logger handle but you
           + modify your owns properties after to have declared them, well with out a reload the configuration
           + properties of Logger they will not be updated. So i think its better to created a method for
           + reload the configuration when i wish updated them....
        */
        if (AbsLogger.propertiesConfig !== null && typeof ((_a = AbsLogger.propertiesConfig) === null || _a === void 0 ? void 0 : _a.getProperty) === "function") {
            AbsLogger.parser = AbsLogger.propertiesConfig.getProperty("loggerParser", "%time\t%name\t : %type :\t%error");
            AbsLogger.saveLog = AbsLogger.propertiesConfig.getProperty("saveLog", true);
            AbsLogger.logStdout = AbsLogger.propertiesConfig.getProperty("logStdout", true);
            AbsLogger.logLevel = AbsLogger.propertiesConfig.getProperty("logLevel", ["ALL"]);
            AbsLogger.fileNamePattern = AbsLogger.propertiesConfig.getProperty("logFileNamePattern", "%date-%id");
            AbsLogger.outputLog = AbsLogger.propertiesConfig.getProperty("loggerOutputDir", "");
            AbsLogger.fileMaxSize = AbsLogger.propertiesConfig.getProperty("logFileMaxSize", null);
            AbsLogger.logfileReuse = AbsLogger.propertiesConfig.getProperty("logFileReusePath", null);
            AbsLogger.colorize = AbsLogger.propertiesConfig.getProperty("logEnabledColorize", true);
        }
        this.name = name;
    }
    AbsLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        AbsLogger.stdout.apply(null, ["warn", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    AbsLogger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        AbsLogger.stdout.apply(null, ["log", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    AbsLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        AbsLogger.stdout.apply(null, ["info", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    AbsLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        AbsLogger.stdout.apply(null, ["debug", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    AbsLogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        AbsLogger.stdout.apply(null, ["error", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    AbsLogger.prototype.custom = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var tmp = AbsLogger.parser;
        AbsLogger.parser = AbsLogger.parser.replace(/\%error/g, "\r\n%error");
        AbsLogger.stdout.apply(null, ["custom", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
        AbsLogger.parser = tmp;
    };
    AbsLogger.prototype.setPattern = function (pattern) {
        if (pattern === void 0) { pattern = ""; }
        this.pattern = pattern;
        return this;
    };
    AbsLogger.prototype.setProp = function (key, value) {
        this.prop[key] = value;
        return this;
    };
    AbsLogger.prototype.setPropObject = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Utils_1.Utils.merge.apply(null, [this.prop].concat(Array.from(args)));
        return this;
    };
    /***
     *
     * Static Configuration
     */
    AbsLogger.setPropertiesConfigHandle = function (handle) {
        if (handle === void 0) { handle = null; }
        AbsLogger.propertiesConfig = handle;
    };
    AbsLogger.setOutputLog = function (path) {
        if (path === void 0) { path = ""; }
        AbsLogger.outputLog = path;
    };
    AbsLogger.setSaveLog = function (save) {
        if (save === void 0) { save = false; }
        AbsLogger.saveLog = save;
    };
    AbsLogger.setLogStdout = function (stdout) {
        if (stdout === void 0) { stdout = true; }
        AbsLogger.logStdout = stdout;
    };
    /***
     * use  : setPattern method
     * @deprecated
     */
    AbsLogger.setParser = function (parsing) {
        if (parsing === void 0) { parsing = AbsLogger.DEFAULT_LOG_PATTERN_MONO; }
        AbsLogger.parser = parsing;
    };
    AbsLogger.setPattern = function (pattern) {
        if (pattern === void 0) { pattern = AbsLogger.DEFAULT_LOG_PATTERN_MONO; }
        AbsLogger.parser = pattern;
    };
    AbsLogger.level = function (level) {
        if (level === void 0) { level = ["ALL"]; }
        AbsLogger.logLevel = level;
    };
    AbsLogger.popLevel = function (logType) {
        if (logType === void 0) { logType = "ALL"; }
        var tmp;
        if ((tmp = this.logLevel.indexOf(logType)) > -1)
            this.logLevel = this.logLevel.slice(0, tmp).concat(this.logLevel.slice(tmp + 1, this.logLevel.length));
    };
    AbsLogger.pushLevel = function (logType) {
        if (logType === void 0) { logType = "ALL"; }
        if (this.logLevel.indexOf(logType) === -1)
            this.logLevel.push(logType);
    };
    AbsLogger.setLogFilePattern = function (pattern) {
        if (pattern === void 0) { pattern = AbsLogger.fileNamePattern; }
        AbsLogger.fileNamePattern = pattern;
    };
    AbsLogger.setFileMaxSize = function (bytes) {
        if (bytes === void 0) { bytes = null; }
        AbsLogger.fileMaxSize = bytes;
    };
    AbsLogger.setLogFileReuse = function (path) {
        if (path === void 0) { path = null; }
        AbsLogger.logfileReuse = path;
    };
    AbsLogger.setPipeStdout = function (pipe) {
        if (pipe === void 0) { pipe = null; }
        AbsLogger.pipeStdout = pipe;
    };
    AbsLogger.setColorize = function (status) {
        if (status === void 0) { status = true; }
        AbsLogger.colorize = status;
    };
    AbsLogger.setCleanUpBeforeSave = function (state) {
        if (state === void 0) { state = AbsLogger.cleanUpBeforeSave; }
        AbsLogger.cleanUpBeforeSave = state;
    };
    AbsLogger.setLogRotate = function (rotate) {
        if (rotate === void 0) { rotate = "1d"; }
        var date;
        if ((date = Utils_1.Utils.getRotateTimestampOutOf(rotate))) {
            this.rotateOutOfTimestamp = date;
            return void 0;
        }
        this.rotateOutOfTimestamp = null;
    };
    AbsLogger.restartRotate = function () {
        this.rotateOutOfTimestamp = Utils_1.Utils.getRotateTimestampOutOf(AbsLogger.logRotate);
    };
    /***
     *
     * @param color
     */
    AbsLogger.translateColorToInt = function (color) {
        if (color === void 0) { color = "black"; }
        var colors = [
            ,
            , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,
            'black', 'red', 'green', 'yellow',
            'blue', 'magenta', 'cyan', 'white', 'gray', 'grey',
            'bblack', 'bred', 'bgreen', 'byellow', 'bblue', 'bmagenta',
            'bcyan', 'cwhite', 'cgray', 'cgrey'
        ];
        return colors.indexOf(color) > -1 ? String(colors.indexOf(color)) : "30";
    };
    /***
     *
     */
    AbsLogger.getLoggerFileName = function () {
        var _a;
        var d = new Date(), filename = AbsLogger.fileNamePattern;
        lib_utils_ts_1.HashMap.of({
            id: AbsLogger.oid,
            date: d.toLocaleDateString().replace(/\//g, "-"),
            ms: d.getMilliseconds(), HH: Utils_1.Utils.round(d.getHours()),
            mm: Utils_1.Utils.round(d.getMinutes()), ss: Utils_1.Utils.round(d.getSeconds()),
            rotate: "." + (String((_a = AbsLogger.rotateOutOfTimestamp) === null || _a === void 0 ? void 0 : _a.getTime()) || "null"),
            reuse: AbsLogger.logfileReuse
        }).each(function (value, key) {
            filename = filename.replace(new RegExp("%" + key), String(value));
        });
        return filename;
    };
    /***
     * @param message
     * @param type
     * @param colorize
     */
    AbsLogger.colorizeString = function (message, type, colorize) {
        if (message === void 0) { message = null; }
        if (type === void 0) { type = null; }
        if (colorize === void 0) { colorize = AbsLogger.colorize; }
        return message.regExp(AbsLogger.COLORS_REGEXP, function () {
            var define = null, interrupt = null, _t = type.substring(0, 1).toLowerCase();
            if (!colorize)
                return this[1];
            if (this[1].equals("%type") || this[1].equals("%T") && this[3] !== undefined) {
                // try to define color
                this[2].regExp(/([lewidc]{1})\?([a-z]+)?\;*/, function () {
                    if (_t.equals(this[1]))
                        define = AbsLogger.translateColorToInt(this[2]);
                });
                // default color
                if (define === null && this[6] !== undefined)
                    define = AbsLogger.translateColorToInt(this[6].replace(/^\:/, ""));
                // return %parser without any color
                else if (define === null && this[6] === undefined)
                    interrupt = this[1];
            }
            return (interrupt || util_1.format("\x1b[%sm%s\x1b[0m", define || AbsLogger.translateColorToInt(this[2]), this[1]));
        });
    };
    /***
     * @param message
     * @param type
     * @param name
     * @param dat
     */
    AbsLogger.parseString = function (message, type, name, dat) {
        if (message === void 0) { message = null; }
        if (type === void 0) { type = null; }
        if (name === void 0) { name = null; }
        if (dat === void 0) { dat = null; }
        var list, tmp = {}, d = new Date(), h = Utils_1.Utils.round(d.getHours()), m = Utils_1.Utils.round(d.getMinutes()), s = Utils_1.Utils.round(d.getSeconds()), ss = d.getMilliseconds();
        try {
            // try to define the name of file in exception
            // and the line number and columns.
            list = (Error()).stack
                .replace(/\w+\:\s*\n/, "")
                .explodeAsList(/\n|\r\n/)
                .stream()
                .filter(function (value) { return !(/AbsLogger\.[\w]{2}/.test(value)); })
                .findFirst()
                .orElse("nop (unknown:0:0)")
                .replace(/.+\(|\)/gi, "")
                .exec(/([^\\\/]*)$/)[1]
                .explodeAsList(":");
            tmp.fileInException = list.get(0);
            tmp.line = list.get(1);
            tmp.column = list.get(2);
        }
        catch (e) {
            console.warn(e);
        }
        lib_utils_ts_1.HashMap.of(Utils_1.Utils.merge({
            type: type,
            name: name,
            time: d.getTime(),
            hours: util_1.format("%s:%s:%s", h, m, s),
            ms: ss, HH: h, mm: m, ss: s,
            pid: process.pid, ppid: process.ppid,
            T: type.substr(0, 1).toUpperCase()
        }, dat || {}, tmp))
            .each(function (value, key) {
            message = message.regExp(new RegExp("%" + key), function () { return value.toString(); });
        });
        return message;
    };
    /***
     * @param type, message [, Object .... ]
     */
    AbsLogger.stdout = function () {
        var _a;
        var args = Array.from(arguments), type = args.shift().toUpperCase(), message = args.shift() || AbsLogger.parser, prop = args.shift(), name = args.shift(), out = new lib_utils_ts_1.ArrayList(), cleanArgv = [];
        if (AbsLogger.logLevel.indexOf(type.toUpperCase()) > -1 || AbsLogger.logLevel.indexOf("ALL") > -1) {
            // cast Object to String
            args.map(function (value) { return (typeof value).equals("object") ? JSON.stringify(value) : value; });
            // check if colorize pattern
            if (AbsLogger.COLORS_REGEXP.test(message)) {
                if (AbsLogger.cleanUpBeforeSave && AbsLogger.saveLog)
                    out.add(AbsLogger.colorizeString(message, type, false)); // cleanUp
                out.add(AbsLogger.colorizeString(message, type, AbsLogger.colorize));
            }
            else
                out.add(message);
            cleanArgv = args.map(function (value) { return typeof value === "string" ? value.colorize().cleanUp : value; });
            out = out.stream()
                .map(function (value) { return AbsLogger.parseString(value, type, name, prop); })
                /***
                 * replace message log here avoid
                 * regexp fall in infinite loop
                 */
                .map(function (value, key) { return value.replace(/\%error|\%message/gi, util_1.format.apply(null, key === 0 && (!AbsLogger.colorize || AbsLogger.cleanUpBeforeSave && AbsLogger.saveLog) ? cleanArgv : args)); })
                .getList();
            if (AbsLogger.saveLog) {
                // logRotate
                if (AbsLogger.rotateOutOfTimestamp && (new Date()).getTime() > AbsLogger.rotateOutOfTimestamp.getTime())
                    AbsLogger.restartRotate();
                var filename = AbsLogger.getLoggerFileName();
                if (AbsLogger.fileMaxSize === null || (AbsLogger.fileMaxSize >= 0 &&
                    Utils_1.Utils.getFileSize(AbsLogger.outputLog + ("/" + filename + ".log")) <= AbsLogger.fileMaxSize)) {
                    try {
                        Utils_1.Utils.writeLog(AbsLogger.outputLog, filename, out.get(0));
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
            }
            if (AbsLogger.logStdout) {
                message = out.get(out.size() > 1 ? 1 : 0);
                if (AbsLogger.pipeStdout !== null)
                    (_a = AbsLogger.pipeStdout) === null || _a === void 0 ? void 0 : _a.write.call(null, message);
                else {
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(message + "\n");
                }
            }
        }
    };
    /**
     * static Pattern
     */
    AbsLogger.DEFAULT_LOG_PATTERN_MONO = "%time\t%name\t: %type :\t%error";
    AbsLogger.WEBDRIVER_LOG_PATTERN_COLORED = "[%hours{cyan}] %T{w?yellow;e?red}/%name - %error";
    AbsLogger.EXPRESS_MIDDLEWARE_PATTERN = "[%hours{yellow}] %name %protocol{red} - %method %url +%elapsedTime{yellow}";
    AbsLogger.STATS_MEMORY_PATTERN = "[%hours{cyan}] %T{cyan}/%name{cyan} memory : heap( %heapUsed{yellow}, %heapTotal{yellow} ) : rss( %rss{yellow} ) : external( %external{yellow} )";
    AbsLogger.CPU_USAGE_PATTERN = "[%hours{cyan}] user CPUTime( %userCPUTime{yellow} ) system CPUTime( %systemCPUTime{yellow} ) maxRss( %maxRSS{yellow} ) ";
    AbsLogger.VERSION_USAGE_PATTERN = "[%hours{cyan}] version of : node( %node{yellow} ) - v8( %v8{yellow} )";
    /***
     */
    AbsLogger.COLORS_REGEXP = /(\%[a-zA-z]+)\{([a-z]+|((([lewidc]+)\?[a-z]+?\;*)+?(\:[a-z]+)*)+)\}/;
    /***
     * All properties configuration
     */
    AbsLogger.parser = AbsLogger.DEFAULT_LOG_PATTERN_MONO;
    AbsLogger.outputLog = "";
    AbsLogger.saveLog = false;
    AbsLogger.logStdout = true;
    AbsLogger.logLevel = ["ALL"];
    AbsLogger.colorize = true;
    AbsLogger.cleanUpBeforeSave = true;
    AbsLogger.logRotate = null;
    AbsLogger.rotateOutOfTimestamp = Utils_1.Utils.getRotateTimestampOutOf(AbsLogger.logRotate);
    /**
     * output file uuid
     */
    AbsLogger.oid = uuid_1.v4();
    /***
     * handles
     */
    AbsLogger.pipeStdout = null;
    AbsLogger.propertiesConfig = null;
    AbsLogger.fileNamePattern = "%date-%id";
    AbsLogger.logfileReuse = null;
    AbsLogger.fileMaxSize = null;
    return AbsLogger;
}());
exports.AbsLogger = AbsLogger;
/***
 * exportable usable Logger Object
 */
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    /***
     *
     * @param name
     */
    function Logger(name) {
        if (name === void 0) { name = undefined; }
        return _super.call(this, name) || this;
    }
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
    Logger.expressRouteLoggerMiddleware = function (pattern) {
        if (pattern === void 0) { pattern = null; }
        var logger = Logger.factory("ExpressRoute").setPattern(pattern || Logger.EXPRESS_MIDDLEWARE_PATTERN), date = new Date().toISOString();
        return function (req, res, next) {
            var _d = new Date();
            logger.setProp("protocol", req.protocol || undefined)
                .setProp("host", req.hostname || undefined)
                .setProp("port", req.port || undefined)
                .setProp("method", req.method.toUpperCase() || undefined)
                .setProp("url", req.url || undefined)
                .setProp("remoteAddr", req.connection.remoteAddress || undefined)
                .setProp("elapsedTime", Utils_1.Utils.parseTime(_d.getTime() - new Date(date).getTime()) || undefined)
                .log();
            date = _d.toISOString();
            next();
        };
    };
    /***
     * @param sizeOf
     */
    Logger.getLoader = function (sizeOf) {
        if (sizeOf === void 0) { sizeOf = 0; }
        if (!loader_1.Loader.loaderIsBusy())
            return new loader_1.Loader(sizeOf);
        return null;
    };
    /***
     */
    Logger.stats = function () { return Stats.getInstance(); };
    /***
     * @constructor
     * @param name
     */
    Logger.factory = function (name) {
        if (name === void 0) { name = undefined; }
        return new Logger(name);
    };
    return Logger;
}(AbsLogger));
exports.Logger = Logger;
/***
 * Stats Class has been declared here
 * but i wish to move it to another place
 */
var Stats = /** @class */ (function () {
    function Stats() {
        this.Log = Logger.factory(Stats.name);
        this.patternList = null;
        if (Stats.INSTANCE)
            return;
        this.patternList = lib_utils_ts_1.ArrayList.of([Logger.STATS_MEMORY_PATTERN, Logger.CPU_USAGE_PATTERN, Logger.VERSION_USAGE_PATTERN]);
        this.Log
            .setPropObject(process.memoryUsage(), process.resourceUsage(), process.versions)
            .setProp("pid", process.pid)
            .setProp("ppid", process.ppid);
    }
    Stats.prototype.apply = function (key, pattern) {
        if (pattern === void 0) { pattern = null; }
        if (pattern)
            this.patternList.set(key, pattern);
        this.Log.setPattern(pattern || this.patternList.get(key)).debug();
    };
    Stats.prototype.memory = function (pattern) {
        if (pattern === void 0) { pattern = null; }
        this.apply(0, pattern);
    };
    Stats.prototype.cpu = function (pattern) {
        if (pattern === void 0) { pattern = null; }
        this.apply(1, pattern);
    };
    Stats.prototype.version = function (pattern) {
        if (pattern === void 0) { pattern = null; }
        this.apply(2, pattern);
    };
    Stats.getInstance = function () { return Stats.INSTANCE; };
    Stats.INSTANCE = new Stats();
    return Stats;
}());
//# sourceMappingURL=Logger.js.map