"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var fs_1 = require("fs");
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
    Utils.regExp = function (regexp, value, callback) {
        if (regexp === void 0) { regexp = /.+/; }
        if (value === void 0) { value = ""; }
        if (callback === void 0) { callback = undefined; }
        if (typeof value !== "string")
            return value;
        try {
            var tmp = void 0, toReplace = void 0;
            while ((tmp = regexp.exec(value))) {
                toReplace = callback !== undefined ? callback.call(tmp, value) : "";
                value = value.replace(tmp[0], toReplace);
            }
        }
        catch (e) {
            return value;
        }
        return value;
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
        if (directory === void 0) { directory = ""; }
        try {
            fs_1.statSync(directory);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map