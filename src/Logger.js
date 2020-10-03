"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
require("lib-utils-ts/src/globalUtils");
var readline = require("readline");
var uuid_1 = require("uuid");
var Utils_1 = require("./Utils");
var util_1 = require("util");
var utils_ts_1 = require("lib-utils-ts/export/utils-ts");
var Logger = /** @class */ (function () {
    function Logger(name) {
        if (name === void 0) { name = undefined; }
        /***
         * others
         */
        this.name = null;
        this.pattern = null;
        this.prop = null;
        /***
         * Rewrite Logger configuration
         * getProperty :
         *  @key
         *  @defaultValue
         */
        if (Logger.propertiesConfig !== null && typeof Logger.propertiesConfig.getProperty === "function") {
            Logger.parser = Logger.propertiesConfig.getProperty("loggerParser", "%time\t%name\t : %type :\t%error");
            Logger.saveLog = Logger.propertiesConfig.getProperty("saveLog", true);
            Logger.logStdout = Logger.propertiesConfig.getProperty("logStdout", true);
            Logger.logLevel = Logger.propertiesConfig.getProperty("logLevel", ["ALL"]);
            Logger.fileNamePattern = Logger.propertiesConfig.getProperty("logFileNamePattern", "%date-%id");
            Logger.outputLog = Logger.propertiesConfig.getProperty("loggerOutputDir", "");
            Logger.fileMaxSize = Logger.propertiesConfig.getProperty("logFileMaxSize", null);
            Logger.logfileReuse = Logger.propertiesConfig.getProperty("logFileReusePath", null);
            Logger.colorize = Logger.propertiesConfig.getProperty("logEnabledColorize", true);
        }
        this.name = name;
    }
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["warn", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["log", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["info", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["debug", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["error", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.custom = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var tmp = Logger.parser;
        Logger.parser = Logger.parser.replace(/\%error/g, "\r\n%error");
        Logger.stdout.apply(null, ["custom", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
        Logger.parser = tmp;
    };
    Logger.prototype.setPattern = function (pattern) {
        if (pattern === void 0) { pattern = ""; }
        this.pattern = pattern;
        return this;
    };
    Logger.prototype.setProp = function (key, value) {
        if (value === void 0) { value = null; }
        if (!this.prop)
            this.prop = {};
        this.prop[key] = value;
        return this;
    };
    Logger.setPropertiesConfigHandle = function (handle) {
        if (handle === void 0) { handle = null; }
        Logger.propertiesConfig = handle;
    };
    Logger.setOutputLog = function (path) {
        if (path === void 0) { path = ""; }
        Logger.outputLog = path;
    };
    Logger.setSaveLog = function (save) {
        if (save === void 0) { save = false; }
        Logger.saveLog = save;
    };
    Logger.setLogStdout = function (stdout) {
        if (stdout === void 0) { stdout = true; }
        Logger.logStdout = stdout;
    };
    Logger.setParser = function (parsing) {
        if (parsing === void 0) { parsing = Logger.DEFAULT_LOG_PATTERN_MONO; }
        Logger.parser = parsing;
    };
    Logger.level = function (level) {
        if (level === void 0) { level = ["ALL"]; }
        Logger.logLevel = level;
    };
    Logger.setLogFilePattern = function (pattern) {
        if (pattern === void 0) { pattern = Logger.fileNamePattern; }
        Logger.fileNamePattern = pattern;
    };
    Logger.setFileMaxSize = function (bytes) {
        if (bytes === void 0) { bytes = null; }
        Logger.fileMaxSize = bytes;
    };
    Logger.setLogFileReuse = function (path) {
        if (path === void 0) { path = null; }
        Logger.logfileReuse = path;
    };
    Logger.setPipeStdout = function (pipe) {
        if (pipe === void 0) { pipe = null; }
        Logger.pipeStdout = pipe;
    };
    Logger.setColorize = function (status) {
        if (status === void 0) { status = true; }
        Logger.colorize = status;
    };
    Logger.setCleanUpBeforeSave = function (state) {
        if (state === void 0) { state = Logger.cleanUpBeforeSave; }
        Logger.cleanUpBeforeSave = state;
    };
    Logger.translateColorToInt = function (color) {
        if (color === void 0) { color = "black"; }
        var colors = [
            ,
            , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,
            'black', 'red', 'green', 'yellow',
            'blue', 'magenta', 'cyan', 'white', 'gray', 'grey', 'bblack', 'bred', 'bgreen'
        ];
        return colors.indexOf(color) > -1 ? String(colors.indexOf(color)) : "30";
    };
    /***
     */
    Logger.getLoggerFileName = function () {
        var d = new Date(), filename = Logger.fileNamePattern;
        utils_ts_1.HashMap.of({
            id: Logger.oid,
            date: d.toLocaleDateString().replace(/\//g, "-"),
            ms: d.getMilliseconds(), HH: Utils_1.Utils.round(d.getHours()),
            mm: Utils_1.Utils.round(d.getMinutes()), ss: Utils_1.Utils.round(d.getSeconds()),
            reuse: Logger.logfileReuse
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
    Logger.colorizeString = function (message, type, colorize) {
        if (message === void 0) { message = null; }
        if (type === void 0) { type = null; }
        if (colorize === void 0) { colorize = Logger.colorize; }
        return message.regExp(Logger.COLORS_REGEXP, function () {
            var define = null, interrupt = null, _t = type.substring(0, 1).toLowerCase();
            if (!colorize)
                return this[1];
            if (this[1].equals("%type") || this[1].equals("%T") && this[3] !== undefined) {
                // try to define color
                this[2].regExp(/([lewidc]{1})\?([a-z]+)?\;*/, function () {
                    if (_t.equals(this[1]))
                        define = Logger.translateColorToInt(this[2]);
                });
                // default color
                if (define === null && this[6] !== undefined)
                    define = Logger.translateColorToInt(this[6].replace(/^\:/, ""));
                // return %parser without any color
                else if (define === null && this[6] === undefined)
                    interrupt = this[1];
            }
            return (interrupt || util_1.format("\x1b[%sm%s\x1b[0m", define || Logger.translateColorToInt(this[2]), this[1]));
        });
    };
    /***
     * @param message
     * @param type
     * @param name
     * @param dat
     */
    Logger.parseString = function (message, type, name, dat) {
        if (message === void 0) { message = null; }
        if (type === void 0) { type = null; }
        if (name === void 0) { name = null; }
        if (dat === void 0) { dat = null; }
        var d = new Date(), h = Utils_1.Utils.round(d.getHours()), m = Utils_1.Utils.round(d.getMinutes()), s = Utils_1.Utils.round(d.getSeconds()), ss = d.getMilliseconds();
        utils_ts_1.HashMap.of(Utils_1.Utils.merge({
            type: type,
            name: name,
            time: d.getTime(),
            hours: util_1.format("%s:%s:%s", h, m, s),
            ms: ss, HH: h, mm: m, ss: s,
            T: type.substr(0, 1).toUpperCase()
        }, dat || {})).each(function (value, key) {
            // @ts-ignore
            message = Utils_1.Utils.regExp(new RegExp("%" + key), message, function () { return value.toString(); });
        });
        return message;
    };
    /***
     * @param type, message [, Object .... ]
     */
    Logger.stdout = function () {
        var _a;
        var args = Array.from(arguments), type = args.shift().toUpperCase(), message = args.shift() || Logger.parser, prop = args.shift(), name = args.shift(), out = new utils_ts_1.ArrayList();
        if (Logger.logLevel.indexOf(type.toUpperCase()) > -1 || Logger.logLevel.indexOf("ALL") > -1) {
            // cast Object to String
            args.map(function (value) { return (typeof value).equals("object") ? JSON.stringify(value) : value; });
            // check if colorize pattern
            if (Logger.COLORS_REGEXP.test(message)) {
                if (Logger.cleanUpBeforeSave && Logger.saveLog)
                    out.add(Logger.colorizeString(message, type, false)); // cleanUp
                out.add(Logger.colorizeString(message, type, Logger.colorize));
            }
            //let name = args.shift();
            out = out.stream()
                .map(function (value) { return Logger.parseString(value, type, name, prop); })
                /***
                 * replace message log here avoid
                 * regexp fall in infinite loop
                 */
                .map(function (value) { return value.replace(/\%error|\%message/gi, util_1.format.apply(null, args)); })
                .getList();
            if (Logger.saveLog) {
                // implement-logRotate
                var filename = Logger.getLoggerFileName();
                if (Logger.fileMaxSize === null || (Logger.fileMaxSize >= 0 &&
                    Utils_1.Utils.getFileSize(Logger.outputLog + ("/" + filename + ".log")) <= Logger.fileMaxSize)) {
                    try {
                        Utils_1.Utils.writeLog(Logger.outputLog, filename, out.get(0));
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
            }
            if (Logger.logStdout) {
                message = out.get(out.size() > 1 ? 1 : 0);
                if (Logger.pipeStdout !== null)
                    (_a = Logger.pipeStdout) === null || _a === void 0 ? void 0 : _a.write.call(null, message);
                else {
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(message + "\n");
                }
            }
        }
    };
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
            logger.setProp("protocol", req.protocol)
                .setProp("host", req.host)
                .setProp("port", req.port)
                .setProp("method", req.method)
                .setProp("url", req.url)
                .setProp("remoteAddr", req.connection.remoteAddress)
                .setProp("elapsedTime", Utils_1.Utils.parseTime(_d.getTime() - new Date(date).getTime()))
                .log();
            date = _d.toISOString();
            next();
        };
    };
    /***
     * @constructor
     * @param name
     */
    Logger.factory = function (name) {
        if (name === void 0) { name = undefined; }
        return new Logger(name);
    };
    Logger.DEFAULT_LOG_PATTERN_MONO = "%time\t%name\t: %type :\t%error";
    Logger.WEBDRIVER_LOG_PATTERN_COLORED = "[%hours{cyan}] %T{w?yellow;e?red}/%name - %error";
    Logger.EXPRESS_MIDDLEWARE_PATTERN = "[%hours{yellow}] %name %protocol{red} - %method %url +%elapsedTime{yellow}";
    Logger.COLORS_REGEXP = /(\%[a-zA-z]+)\{([a-z]+|((([lewidc]+)\?[a-z]+?\;*)+?(\:[a-z]+)*)+)\}/;
    /***
     * Basic configuration
     */
    Logger.parser = Logger.DEFAULT_LOG_PATTERN_MONO;
    Logger.outputLog = "";
    Logger.saveLog = false;
    Logger.logStdout = true;
    Logger.logLevel = ["ALL"];
    Logger.colorize = true;
    Logger.cleanUpBeforeSave = true;
    /**
     * output file
     */
    Logger.oid = uuid_1.v4();
    /***
     * handles
     */
    Logger.pipeStdout = null;
    Logger.propertiesConfig = null;
    Logger.fileNamePattern = "%date-%id";
    Logger.logfileReuse = null;
    Logger.fileMaxSize = null;
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map