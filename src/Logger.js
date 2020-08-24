"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var uuid_1 = require("uuid");
var Utils_1 = require("./Utils");
var format = require("util").format;
var Stream = require("./lib/Stream.js").Stream;
var Logger = /** @class */ (function () {
    function Logger(name) {
        if (name === void 0) { name = undefined; }
        /***
         * others
         */
        this.name = null;
        /***
         * Rewrite Logger configuration
         * getProperty :
         *  @key
         *  @defaultValue
         */
        if (Logger.propertiesConfig !== null && typeof Logger.propertiesConfig.getProperty === "function") {
            Logger.parser = Logger.propertiesConfig.getProperty("loggerParser", "%time\t%name\t : %type :\t%error");
            Logger.outputLog = Logger.propertiesConfig.getProperty("loggerOutputDir", "");
            Logger.saveLog = Logger.propertiesConfig.getProperty("saveLog", true);
            Logger.logStdout = Logger.propertiesConfig.getProperty("logStdout", true);
            Logger.logLevel = Logger.propertiesConfig.getProperty("logLevel", ["ALL"]);
            Logger.fileNamePattern = Logger.propertiesConfig.getProperty("logFileNamePattern", "%date-%id");
            Logger.fileMaxSize = Logger.propertiesConfig.getProperty("logFileMaxSize", null);
            Logger.logfileReuse = Logger.propertiesConfig.getProperty("logFileReusePath", null);
        }
        this.name = name;
    }
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["warn", this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["log", this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["info", this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["debug", this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Logger.stdout.apply(null, ["error", this.name].concat(Array.from(arguments)));
    };
    Logger.prototype.custom = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var tmp = Logger.parser;
        Logger.parser = Logger.parser.replace(/\%error/g, "\r\n%error");
        Logger.stdout.apply(null, ["custom", this.name].concat(Array.from(arguments)));
        Logger.parser = tmp;
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
        if (parsing === void 0) { parsing = Logger.parser; }
        Logger.parser = parsing;
    };
    Logger.level = function (level) {
        if (level === void 0) { level = []; }
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
    /***
     * @param type, errorMsg [, Object .... ]
     */
    Logger.stdout = function () {
        var args = Array.from(arguments), type = args.shift().toUpperCase(), errorMsg = Logger.parser;
        if (Logger.logLevel.indexOf(type.toUpperCase()) > -1 || Logger.logLevel.indexOf("ALL") > -1) {
            var d = new Date(), h = Utils_1.Utils.round(d.getHours()), m = Utils_1.Utils.round(d.getMinutes()), s = Utils_1.Utils.round(d.getSeconds()), ss = d.getMilliseconds();
            // colors next-ticket
            // \x1b[35m%s\x1b[0m
            args.map(function (value) { return typeof value === "object" ? JSON.stringify(value) : value; });
            Object().stream().of({
                type: type,
                name: args.shift(),
                time: d.getTime(),
                hours: format("%s:%s:%s", h, m, s),
                HH: h, mm: m, ss: s, ssss: ss,
                T: type.substr(0, 1).toUpperCase(),
                error: format.apply(null, args),
            }).each(function (value, key) {
                // @ts-ignore
                errorMsg = Utils_1.Utils.regExp(new RegExp("%" + key), errorMsg, function () { return value.toString(); });
            });
            if (Logger.saveLog) {
                var filename_1 = Logger.fileNamePattern;
                Object().stream().of({
                    id: Logger.oid,
                    date: d.toLocaleDateString().replace(/\//g, "-"),
                    HH: h, mm: m, ss: s, ssss: ss,
                    reuse: Logger.logfileReuse
                }).each(function (value, key) {
                    filename_1 = filename_1.replace(new RegExp("%" + key), value);
                });
                if (Logger.fileMaxSize === null || (Logger.fileMaxSize >= 0 && Utils_1.Utils.getFileSize(Logger.outputLog + ("/" + filename_1 + ".log")) <= Logger.fileMaxSize)) {
                    try {
                        Utils_1.Utils.writeLog(Logger.outputLog, filename_1, errorMsg);
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
            }
            if (Logger.logStdout) {
                if (Logger.pipeStdout !== null)
                    this.pipeStdout.write(errorMsg);
                else {
                    // @ts-ignore
                    process.stdout.write(errorMsg + "\n");
                }
            }
        }
    };
    /***
     * @constructor
     * @param name
     */
    Logger.factory = function (name) {
        if (name === void 0) { name = undefined; }
        return new Logger(name);
    };
    /***
     * Basic configuration
     */
    Logger.parser = "[%hours] %T/%name - %hours - %error";
    Logger.outputLog = "";
    Logger.saveLog = false;
    Logger.logStdout = true;
    Logger.logLevel = ["ALL"];
    Logger.colorize = true;
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