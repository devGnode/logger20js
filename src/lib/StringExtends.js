"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("../Utils");
// @ts-ignore
String.prototype.equals = function (value) {
    if (value === void 0) { value = ""; }
    return this.toString() === value;
};
// @ts-ignore
String.prototype.equalsToIgnoreCase = function (value) {
    if (value === void 0) { value = ""; }
    return this.toString().toLowerCase() === value.toLowerCase();
};
// @ts-ignore
String.prototype.regExp = function (regExp, callback) {
    if (regExp === void 0) { regExp = /.+/; }
    if (callback === void 0) { callback = null; }
    return Utils_1.Utils.regExp(regExp, this.toString(), callback);
};
//# sourceMappingURL=StringExtends.js.map