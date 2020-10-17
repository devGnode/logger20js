const {Logger,AbsLogger} = require("../src/Logger");
const {Color} = require("../src/Colorize");
const {Loader} = require("../src/Loader");

function g( r = void 0||undefined ){}

module.exports = {
    AbsLogger:AbsLogger,
    Logger: Logger,
    Color: Color,
    Loader: Loader,
};