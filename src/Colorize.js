"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colorize = void 0;
var util_1 = require("util");
var Colorize = /** @class */ (function () {
    function Colorize(value) {
        if (value === void 0) { value = null; }
        this.value = null;
        this.value = value;
    }
    Colorize.prototype.parse = function (color) {
        if (color === void 0) { color = 30; }
        return String(util_1.format("\x1b[%sm%s\x1b[0m", color, this.value));
    };
    Object.defineProperty(Colorize.prototype, "black", {
        get: function () { return this.parse(30); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "red", {
        get: function () { return this.parse(31); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "green", {
        get: function () { return this.parse(32); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "yellow", {
        get: function () { return this.parse(33); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "blue", {
        get: function () { return this.parse(34); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "magenta", {
        get: function () { return this.parse(35); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "cyan", {
        get: function () { return this.parse(36); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "white", {
        get: function () { return this.parse(37); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "gray", {
        get: function () { return this.parse(38); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "grey", {
        get: function () { return this.parse(39); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fBlack", {
        get: function () { return this.parse(40); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fRed", {
        get: function () { return this.parse(41); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fGreen", {
        get: function () { return this.parse(42); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fYellow", {
        get: function () { return this.parse(43); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fBlue", {
        get: function () { return this.parse(44); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fMagenta", {
        get: function () { return this.parse(45); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fCyan", {
        get: function () { return this.parse(46); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fWhite", {
        get: function () { return this.parse(47); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fGray", {
        get: function () { return this.parse(48); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Colorize.prototype, "fGrey", {
        get: function () { return this.parse(49); },
        enumerable: false,
        configurable: true
    });
    return Colorize;
}());
exports.Colorize = Colorize;
/***
 * Extended string native Object
 */
String.prototype.colorize = function () {
    return new Colorize(this.toString());
};
//# sourceMappingURL=Colorize.js.map