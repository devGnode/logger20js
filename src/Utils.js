"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const util_1 = require("util");
class Utils {
    static round(value = null) {
        if (value !== null)
            return value.toString().length === 1 ? "0" + value : value;
        return value;
    }
    static merge(objA = {}, ...args) {
        try {
            let i = 0, objB;
            while ((objB = args[i])) {
                for (let tmp in objB)
                    if (!objA[tmp])
                        objA[tmp] = objB[tmp];
                i++;
            }
        }
        catch (e) {
            return objA;
        }
        return objA;
    }
    static parseTime(timeStamp = 0) {
        let h, m, s, ms;
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
    }
    static getRotateTimestampOutOf(rotate = null, date = null) {
        let tmp, sec;
        if ((tmp = /^((\d+)d?(\:)*)*((\d+)h?(\:)*)*((\d+)m)*$/.exec(rotate))) {
            sec = parseInt(tmp[2] || 0) * 86400 + parseInt(tmp[5] || 0) * 3600 + parseInt(tmp[8] || 0) * 60;
            return new Date((date || new Date()).getTime() + (sec * 1000));
        }
        return null;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map