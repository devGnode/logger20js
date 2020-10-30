"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.AbsLogger = void 0;
require("lib-utils-ts/src/globalUtils");
const readline = require("readline");
const uuid_1 = require("uuid");
const Utils_1 = require("./Utils");
const util_1 = require("util");
const lib_utils_ts_1 = require("lib-utils-ts");
const Loader_1 = require("./Loader");
const Define_1 = require("lib-utils-ts/src/Define");
const Properties_1 = require("lib-utils-ts/src/file/Properties");
const IOStream_1 = require("lib-utils-ts/src/file/IOStream");
class AbsLogger {
    constructor(name = undefined) {
        this.prop = {};
        this.name = null;
        this.pattern = null;
        this.name = name;
    }
    warn(...args) {
        AbsLogger.stdout.apply(null, ["warn", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    }
    log(...args) {
        AbsLogger.stdout.apply(null, ["log", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    }
    info(...args) {
        AbsLogger.stdout.apply(null, ["info", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    }
    debug(...args) {
        AbsLogger.stdout.apply(null, ["debug", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    }
    error(...args) {
        AbsLogger.stdout.apply(null, ["error", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
    }
    custom(...args) {
        let tmp = AbsLogger.parser;
        AbsLogger.parser = AbsLogger.parser.replace(/\%error/g, "\r\n%error");
        AbsLogger.stdout.apply(null, ["custom", this.pattern, this.prop, this.name].concat(Array.from(arguments)));
        AbsLogger.parser = tmp;
    }
    setPattern(pattern = "") {
        this.pattern = pattern;
        return this;
    }
    setProp(key, value) {
        this.prop[key] = value;
        return this;
    }
    setPropObject(...args) {
        Utils_1.Utils.merge.apply(null, [this.prop].concat(Array.from(args)));
        return this;
    }
    static setPropertiesConfigHandle(handle = null) {
        AbsLogger.propertiesConfig = handle;
        AbsLogger.setLogRotate(Define_1.Define.of(handle.getProperty("logRotate")).orNull(null));
        AbsLogger.setOutputLog(Define_1.Define.of(handle.getProperty("loggerOutputDir")).orNull(""));
        AbsLogger.setFileMaxSize(Define_1.Define.of(handle.getProperty("logFileMaxSize")).orNull(null));
        AbsLogger.setLogFilePattern(Define_1.Define.of(handle.getProperty("logFileNamePattern")).orNull("%date-%id"));
        AbsLogger.reloadConfiguration();
    }
    static setPropertiesFile(path, json = true) {
        let properties;
        properties = json ? new Properties_1.PropertiesJson() : new Properties_1.Properties();
        properties.load(new IOStream_1.FileReader(path));
        AbsLogger.setPropertiesConfigHandle(properties);
    }
    static reloadConfiguration() {
        let prop;
        if ((prop = AbsLogger.propertiesConfig) === null)
            return;
        AbsLogger.setPattern(Define_1.Define.of(prop.getProperty("loggerParser")).orNull(AbsLogger.DEFAULT_LOG_PATTERN_MONO));
        AbsLogger.setSaveLog(Define_1.Define.of(Boolean.of(prop.getProperty("saveLog"))).orNull(true));
        AbsLogger.setLogStdout(Define_1.Define.of(Boolean.of(prop.getProperty("logStdout"))).orNull(true));
        AbsLogger.setColorize(Define_1.Define.of(Boolean.of(prop.getProperty("logEnabledColorize"))).orNull(true));
        AbsLogger.level(Define_1.Define.of(prop instanceof Properties_1.Properties ? JSON.parse(prop.getProperty("logLevel")) : prop.getProperty("logLevel")).orNull(["ALL"]));
    }
    static setOutputLog(path = "") {
        AbsLogger.outputLog = path;
    }
    static setSaveLog(save = false) {
        AbsLogger.saveLog = save;
    }
    static setLogStdout(stdout = true) {
        AbsLogger.logStdout = stdout;
    }
    static setParser(parsing = AbsLogger.DEFAULT_LOG_PATTERN_MONO) {
        AbsLogger.parser = parsing;
    }
    static setPattern(pattern = AbsLogger.DEFAULT_LOG_PATTERN_MONO) {
        AbsLogger.parser = pattern;
    }
    static level(level = ["ALL"]) {
        AbsLogger.logLevel = level;
    }
    static popLevel(logType = "ALL") {
        let tmp;
        if ((tmp = AbsLogger.logLevel.indexOf(logType)) > -1)
            AbsLogger.logLevel = AbsLogger.logLevel.slice(0, tmp).concat(AbsLogger.logLevel.slice(tmp + 1, AbsLogger.logLevel.length));
    }
    static pushLevel(logType = "ALL") {
        if (AbsLogger.logLevel.indexOf(logType) === -1)
            AbsLogger.logLevel.push(logType);
    }
    static setLogFilePattern(pattern = AbsLogger.fileNamePattern) {
        AbsLogger.fileNamePattern = pattern;
    }
    static setFileMaxSize(bytes = null) {
        AbsLogger.fileMaxSize = bytes;
    }
    static setLogFileReuse(path = null) {
        AbsLogger.logfileReuse = path;
    }
    static setPipeStdout(pipe = null) {
        AbsLogger.pipeStdout = pipe;
    }
    static setColorize(status = true) {
        AbsLogger.colorize = status;
    }
    static setCleanUpBeforeSave(state = AbsLogger.cleanUpBeforeSave) {
        AbsLogger.cleanUpBeforeSave = state;
    }
    static setLogRotate(rotate = null) {
        let date;
        if ((date = Utils_1.Utils.getRotateTimestampOutOf(rotate))) {
            AbsLogger.logRotate = rotate;
            AbsLogger.rotateOutOfTimestamp = date;
            return void 0;
        }
        AbsLogger.rotateOutOfTimestamp = null;
    }
    static restartRotate() {
        AbsLogger.rotateOutOfTimestamp = Utils_1.Utils.getRotateTimestampOutOf(AbsLogger.logRotate);
    }
    static translateColorToInt(color = "black") {
        let colors = [
            ,
            , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,
            'black', 'red', 'green', 'yellow',
            'blue', 'magenta', 'cyan', 'white', 'gray', 'grey',
            'bblack', 'bred', 'bgreen', 'byellow', 'bblue', 'bmagenta',
            'bcyan', 'cwhite', 'cgray', 'cgrey'
        ];
        return colors.indexOf(color) > -1 ? String(colors.indexOf(color)) : "30";
    }
    static getLoggerFileName() {
        var _a;
        let d = new Date(), filename = AbsLogger.fileNamePattern;
        lib_utils_ts_1.HashMap.of({
            id: AbsLogger.oid,
            date: d.toLocaleDateString().replace(/\//g, "-"),
            ms: d.getMilliseconds(), HH: Utils_1.Utils.round(d.getHours()),
            mm: Utils_1.Utils.round(d.getMinutes()), ss: Utils_1.Utils.round(d.getSeconds()),
            rotate: "." + (String((_a = AbsLogger.rotateOutOfTimestamp) === null || _a === void 0 ? void 0 : _a.getTime()) || "null"),
            reuse: AbsLogger.logfileReuse
        }).each((value, key) => {
            filename = filename.replace(new RegExp(`\%${key}`), String(value));
        });
        return filename;
    }
    static colorizeString(message = null, type = null, colorize = AbsLogger.colorize) {
        return message.regExp(AbsLogger.COLORS_REGEXP, function () {
            let define = null, interrupt = null, _t = type.substring(0, 1).toLowerCase();
            if (!colorize)
                return this[1];
            if (this[1].equals("%type") || this[1].equals("%T") && this[3] !== undefined) {
                this[2].regExp(/([lewidc]{1})\?([a-z]+)?\;*/, function () {
                    if (_t.equals(this[1]))
                        define = AbsLogger.translateColorToInt(this[2]);
                });
                if (define === null && this[6] !== undefined)
                    define = AbsLogger.translateColorToInt(this[6].replace(/^\:/, ""));
                else if (define === null && this[6] === undefined)
                    interrupt = this[1];
            }
            return (interrupt || util_1.format("\x1b[%sm%s\x1b[0m", define || AbsLogger.translateColorToInt(this[2]), this[1]));
        });
    }
    static parseString(message = null, type = null, name = null, dat = null) {
        let list, tmp = {}, d = new Date(), h = Utils_1.Utils.round(d.getHours()), m = Utils_1.Utils.round(d.getMinutes()), s = Utils_1.Utils.round(d.getSeconds()), ss = d.getMilliseconds();
        try {
            let exception = "IndexOfBoundException";
            list = (Error()).stack
                .replace(/\w+\:*\s*\n/, "")
                .explodeAsList(/\n|\r\n/)
                .stream()
                .filter(value => !(/Logger\.[\w]{2,}|node_modules/.test(value)))
                .findFirst()
                .orElse("nop (unknown:0:0)")
                .replace(/.+\(|\)/gi, "")
                .exec(/([^\\\/]*)$/)[1]
                .explodeAsList(":");
            tmp.fileInException = list.get(0) || exception;
            tmp.line = list.get(1) || exception;
            tmp.column = list.get(2) || exception;
        }
        catch (e) { }
        lib_utils_ts_1.HashMap.of(Utils_1.Utils.merge({
            type: type,
            name: name,
            time: d.getTime(),
            hours: util_1.format("%s:%s:%s", h, m, s),
            ms: ss, HH: h, mm: m, ss: s,
            pid: process.pid, ppid: process.ppid,
            T: type.substr(0, 1).toUpperCase()
        }, dat || {}, tmp))
            .each((value, key) => {
            message = message.regExp(new RegExp(`\%${key}`), () => value.toString());
        });
        return message;
    }
    static stdout() {
        var _a;
        let args = Array.from(arguments), type = args.shift().toUpperCase(), message = args.shift() || AbsLogger.parser, prop = args.shift(), name = args.shift(), out = new lib_utils_ts_1.ArrayList(), cleanArgv = [];
        if (AbsLogger.logLevel.indexOf(type.toUpperCase()) > -1 || AbsLogger.logLevel.indexOf("ALL") > -1) {
            args.map(value => (typeof value).equals("object") ? JSON.stringify(value) : value);
            if (AbsLogger.COLORS_REGEXP.test(message)) {
                if (AbsLogger.cleanUpBeforeSave && AbsLogger.saveLog)
                    out.add(AbsLogger.colorizeString(message, type, false));
                out.add(AbsLogger.colorizeString(message, type, AbsLogger.colorize));
            }
            else
                out.add(message);
            cleanArgv = args.map(value => typeof value === "string" ? value.colorize().cleanUp : value);
            out = out.stream()
                .map(value => AbsLogger.parseString(value, type, name, prop))
                .map((value, key) => value.replace(/\%error|\%message/gi, util_1.format.apply(null, key === 0 && (!AbsLogger.colorize || AbsLogger.cleanUpBeforeSave && AbsLogger.saveLog) ? cleanArgv : args)))
                .getList();
            if (AbsLogger.saveLog) {
                if (AbsLogger.rotateOutOfTimestamp && (new Date()).getTime() > AbsLogger.rotateOutOfTimestamp.getTime())
                    AbsLogger.restartRotate();
                let filename = AbsLogger.getLoggerFileName();
                if (AbsLogger.fileMaxSize === null || (AbsLogger.fileMaxSize >= 0 &&
                    IOStream_1.AbstractIOFile.getFileSize(AbsLogger.outputLog + `/${filename}.log`) <= AbsLogger.fileMaxSize)) {
                    try {
                        AbsLogger.outputLog += !AbsLogger.outputLog.endsWith("/") ? "/" : "";
                        (new IOStream_1.FileWriter(AbsLogger.outputLog + filename + ".log")).write(`${out.get(0)}\n`, false);
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
    }
}
exports.AbsLogger = AbsLogger;
AbsLogger.DEFAULT_LOG_PATTERN_MONO = "%time\t%name\t: %type :\t%error";
AbsLogger.WEBDRIVER_LOG_PATTERN_COLORED = "[%hours{cyan}] %T{w?yellow;e?red}/%name - %error";
AbsLogger.EXPRESS_MIDDLEWARE_PATTERN = "[%hours{yellow}] %name %protocol{red} - %method %url +%elapsedTime{yellow}";
AbsLogger.STATS_MEMORY_PATTERN = "[%hours{cyan}] %T{cyan}/%name{cyan} memory : heap( %heapUsed{yellow}, %heapTotal{yellow} ) : rss( %rss{yellow} ) : external( %external{yellow} )";
AbsLogger.CPU_USAGE_PATTERN = "[%hours{cyan}] user CPUTime( %userCPUTime{yellow} ) system CPUTime( %systemCPUTime{yellow} ) maxRss( %maxRSS{yellow} ) ";
AbsLogger.VERSION_USAGE_PATTERN = "[%hours{cyan}] version of : node( %node{yellow} ) - v8( %v8{yellow} )";
AbsLogger.COLORS_REGEXP = /(\%[a-zA-z0-9]+)\{([a-z]+|((([lewidc]+)\?[a-z]+?\;*)+?(\:[a-z]+)*)+)\}/;
AbsLogger.parser = AbsLogger.DEFAULT_LOG_PATTERN_MONO;
AbsLogger.outputLog = "";
AbsLogger.saveLog = false;
AbsLogger.logStdout = true;
AbsLogger.logLevel = ["ALL"];
AbsLogger.colorize = true;
AbsLogger.cleanUpBeforeSave = true;
AbsLogger.logRotate = null;
AbsLogger.rotateOutOfTimestamp = Utils_1.Utils.getRotateTimestampOutOf(AbsLogger.logRotate);
AbsLogger.oid = uuid_1.v4();
AbsLogger.pipeStdout = null;
AbsLogger.propertiesConfig = null;
AbsLogger.fileNamePattern = "%date-%id";
AbsLogger.logfileReuse = null;
AbsLogger.fileMaxSize = null;
class Logger extends AbsLogger {
    constructor(name = undefined) { super(name); }
    static expressRouteLoggerMiddleware(pattern = null) {
        let logger = Logger.factory("ExpressRoute").setPattern(pattern || Logger.EXPRESS_MIDDLEWARE_PATTERN), date = new Date().toISOString();
        return (req, res, next) => {
            let _d = new Date();
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
    }
    static getLoader(sizeOf = 0) {
        if (!Loader_1.Loader.loaderIsBusy())
            return new Loader_1.Loader(sizeOf);
        return null;
    }
    static stats() { return Stats.getInstance(); }
    static factory(name = undefined) {
        return new Logger(name);
    }
}
exports.Logger = Logger;
class Stats {
    constructor() {
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
    apply(key, pattern = null) {
        if (pattern)
            this.patternList.set(key, pattern);
        this.Log.setPattern(pattern || this.patternList.get(key)).debug();
    }
    memory(pattern = null) { this.apply(0, pattern); }
    cpu(pattern = null) { this.apply(1, pattern); }
    version(pattern = null) { this.apply(2, pattern); }
    static getInstance() { return Stats.INSTANCE; }
}
Stats.INSTANCE = new Stats();
//# sourceMappingURL=Logger.js.map