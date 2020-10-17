"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/***
 *
 */
var Colorize_1 = require("./Colorize");
String.prototype.colorize = function () {
    return new Colorize_1.Colorize(this.toString());
};
//# sourceMappingURL=Loggable.js.map