"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var fs_1 = require("fs");
var Utils = /** @class */ (function () {
    function Utils() {
    }
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