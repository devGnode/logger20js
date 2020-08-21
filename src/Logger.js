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
        if (parsing === void 0) { parsing = ""; }
        Logger.parser = parsing;
    };
    Logger.level = function (level) {
        if (level === void 0) { level = []; }
        Logger.logLevel = level;
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
            Object().stream().of({
                type: type,
                name: args.shift(),
                error: format.apply(null, args),
                time: d.getTime(),
                hours: format("\x1b[32m%s:%s:%s\1xb[0m", h, m, s),
                HH: h, mm: m, ss: s, ssss: ss,
                T: type.substr(0, 1).toUpperCase(),
            }).each(function (value, key) {
                errorMsg = errorMsg.replace(new RegExp("%" + key), value.toString());
            });
            // merge error line
            if (Logger.saveLog) {
                Utils_1.Utils.writeLog(Logger.outputLog, format("%s-%s", (new Date()).toLocaleDateString().replace(/\//g, "-"), Logger.oid), errorMsg);
            }
            if (Logger.logStdout) {
                if (Logger.pipeStdout !== null)
                    this.pipeStdout.write(errorMsg);
                else
                    console.log(errorMsg);
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
    Logger.parser = "[%HH:%mm:%ss] %T/%name - %error";
    Logger.outputLog = "";
    Logger.saveLog = false;
    Logger.logStdout = true;
    Logger.logLevel = ["ALL"];
    /**
     * output file
     */
    Logger.oid = uuid_1.v4();
    /***
     * handles
     */
    Logger.pipeStdout = null;
    Logger.propertiesConfig = null;
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map