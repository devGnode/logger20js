"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
var Logger_1 = require("./Logger");
require("./Colorize");
/***
 * ALPHA CLASS
 * v 0.0.1
 */
var Loader = /** @class */ (function () {
    function Loader(size) {
        if (size === void 0) { size = 0; }
        this.logger = null;
        this.timerHandle = null;
        this.size = 0;
        this.maxSize = 0;
        this.logger = Logger_1.Logger.factory("Loader").setPattern("");
        this.maxSize = size;
    }
    Loader.repeat = function (char, loop) {
        if (char === void 0) { char = ""; }
        if (loop === void 0) { loop = 0; }
        loop = loop - 1 < 0 ? 0 : loop - 1;
        return String.repeatString(char, loop) + (loop <= 99 ? ">" : char) + String.repeatString(".", 99 - loop);
    };
    Loader.prototype.start = function (endingMessage) {
        var _this = this;
        if (endingMessage === void 0) { endingMessage = ""; }
        var next = 0, perc;
        if (Loader.isBusy)
            return;
        this.timerHandle = setInterval(function () {
            perc = Math.round((_this.size / _this.maxSize) * 100);
            process.stdout.write("\r" + Loader.wheel[next++] + "-[ \x1b[36m" + Loader.repeat("=", perc) + "\x1b[0m ] " + perc + "%");
            next &= 3;
            if (perc >= 100)
                _this.end(endingMessage);
        }, 250);
        Loader.isBusy = true;
        return this;
    };
    Loader.prototype.add = function (bytes) {
        if (bytes === void 0) { bytes = 0; }
        this.size += bytes;
    };
    Loader.prototype.end = function (message) {
        if (message === void 0) { message = null; }
        process.stdout.write("");
        this.logger.info(message || "successful");
        clearInterval(this.timerHandle);
        this.maxSize = this.size = 0;
        this.timerHandle = null;
        Loader.isBusy = false;
    };
    Loader.prototype.close = function () { this.end("close loader event"); };
    Loader.loaderIsBusy = function () { return Loader.isBusy; };
    Loader.isBusy = false;
    Loader.wheel = ["\\", "|", "/", "-"];
    return Loader;
}());
exports.Loader = Loader;
//# sourceMappingURL=loader.js.map