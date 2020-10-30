"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const Logger_1 = require("./Logger");
require("./Colorize");
class Loader {
    constructor(size = 0) {
        this.logger = null;
        this.timerHandle = null;
        this.size = 0;
        this.maxSize = 0;
        this.logger = Logger_1.Logger.factory("Loader").setPattern("");
        this.maxSize = size;
    }
    static repeat(char = "", loop = 0) {
        loop = loop - 1 < 0 ? 0 : loop - 1;
        return String.repeatString(char, loop) + (loop <= 99 ? ">" : char) + String.repeatString(".", 99 - loop);
    }
    start(endingMessage = "") {
        let next = 0, perc;
        if (Loader.isBusy)
            return;
        this.timerHandle = setInterval(() => {
            perc = Math.round((this.size / this.maxSize) * 100);
            process.stdout.write("\r" + Loader.wheel[next++] + "-[ \x1b[36m" + Loader.repeat("=", perc) + "\x1b[0m ] " + perc + "%");
            next &= 3;
            if (perc >= 100)
                this.end(endingMessage);
        }, 250);
        Loader.isBusy = true;
        return this;
    }
    add(bytes = 0) { this.size += bytes; }
    end(message = null) {
        process.stdout.write("");
        this.logger.info(message || "successful");
        clearInterval(this.timerHandle);
        this.maxSize = this.size = 0;
        this.timerHandle = null;
        Loader.isBusy = false;
    }
    close() { this.end("close loader event"); }
    static loaderIsBusy() { return Loader.isBusy; }
}
exports.Loader = Loader;
Loader.isBusy = false;
Loader.wheel = ["\\", "|", "/", "-"];
//# sourceMappingURL=Loader.js.map