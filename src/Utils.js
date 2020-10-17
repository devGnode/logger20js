"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var fs_1 = require("fs");
var util_1 = require("util");
/***
 * Static lib utils class :
 *
 * Do not use outside of this project these
 * properties can be often move or removing.
 */
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /***
     * @param value
     */
    Utils.round = function (value) {
        if (value === void 0) { value = null; }
        if (value !== null)
            return value.toString().length === 1 ? "0" + value : value;
        return value;
    };
    /***
     * @param filename
     */
    Utils.getFileSize = function (filename) {
        if (filename === void 0) { filename = ""; }
        try {
            var stats = fs_1.statSync(filename);
            return stats["size"];
        }
        catch (e) {
            return 0;
        }
    };
    /***
     *
     * @param outputLogDir
     * @param fileName
     * @param data
     * @return void
     */
    Utils.writeLog = function (outputLogDir, fileName, data) {
        if (outputLogDir === void 0) { outputLogDir = ""; }
        if (fileName === void 0) { fileName = ""; }
        if (data === void 0) { data = ""; }
        outputLogDir += !outputLogDir.endsWith("/") ? "/" : "";
        if (!Utils.existsDir(outputLogDir)) {
            fs_1.mkdirSync(outputLogDir, { recursive: true });
        }
        fs_1.writeFileSync(outputLogDir + fileName + ".log", data + "\r\n", { encoding: "utf8", flag: "a" });
    };
    /***
     * @param directory
     * @return {boolean}
     */
    Utils.existsDir = function (directory) {
        if (directory === void 0) { directory = null; }
        try {
            fs_1.statSync(directory);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Utils.merge = function (objA) {
        if (objA === void 0) { objA = {}; }
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            var i = 0, objB = void 0;
            while ((objB = args[i])) {
                for (var tmp in objB)
                    if (!objA[tmp])
                        objA[tmp] = objB[tmp];
                i++;
            }
        }
        catch (e) {
            return objA;
        }
        return objA;
    };
    /***
     * @param timeStamp
     */
    Utils.parseTime = function (timeStamp) {
        if (timeStamp === void 0) { timeStamp = 0; }
        var h, m, s, ms;
        if (timeStamp < 1000)
            return "0." + timeStamp;
        else {
            ms = timeStamp / 1000;
            h = Math.floor((ms) / 3600);
            m = Math.floor((ms) / 60) - (3600 * h);
            s = Math.floor(ms % 60);
            ms = Math.round(ms);
        }
        return util_1.format("%s%s%s%s", (h > 0 ? Utils.round(h) + ":" : ""), m > 0 ? Utils.round(m) + ":" : "", s > 0 ? Utils.round(s) + "." : "", String.repeatString("0", 3 - String(ms).length) + ms);
    };
    /***
     * @param rotate
     * @param date
     */
    Utils.getRotateTimestampOutOf = function (rotate, date) {
        if (rotate === void 0) { rotate = null; }
        if (date === void 0) { date = null; }
        var tmp, sec;
        if ((tmp = /^((\d+)d?(\:)*)*((\d+)h?(\:)*)*((\d+)m)*$/.exec(rotate))) {
            sec = parseInt(tmp[2] || 0) * 86400 + parseInt(tmp[5] || 0) * 3600 + parseInt(tmp[8] || 0) * 60;
            return new Date((date || new Date()).getTime() + (sec * 1000));
        }
        return null;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map