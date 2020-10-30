"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colorize = void 0;
const util_1 = require("util");
class Colorize {
    constructor(value = null) {
        this.value = null;
        this.value = value;
    }
    parse(color = 30) {
        return String(util_1.format("\x1b[%sm%s\x1b[0m", color, this.value));
    }
    get black() { return this.parse(30); }
    get red() { return this.parse(31); }
    get green() { return this.parse(32); }
    get yellow() { return this.parse(33); }
    get blue() { return this.parse(34); }
    get magenta() { return this.parse(35); }
    get cyan() { return this.parse(36); }
    get white() { return this.parse(37); }
    get gray() { return this.parse(38); }
    get grey() { return this.parse(39); }
    get fBlack() { return this.parse(40); }
    get fRed() { return this.parse(41); }
    get fGreen() { return this.parse(42); }
    get fYellow() { return this.parse(43); }
    get fBlue() { return this.parse(44); }
    get fMagenta() { return this.parse(45); }
    get fCyan() { return this.parse(46); }
    get fWhite() { return this.parse(47); }
    get fGray() { return this.parse(48); }
    get fGrey() { return this.parse(49); }
    get cleanUp() {
        return this.value
            .replace(/\x1b\[\d+m|\u001b\[\d+m/g, "")
            .replace(/\x1b\[0m|\u001b\[0m/g, "");
    }
}
exports.Colorize = Colorize;
String.prototype.colorize = function () {
    return new Colorize(this.toString());
};
//# sourceMappingURL=Colorize.js.map