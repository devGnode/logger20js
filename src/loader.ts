import {Logger} from "./Logger";
import Timeout = NodeJS.Timeout;
import {Utils} from "./Utils";
import "./Colorize";
/***
 * ALPHA CLASS
 * v 0.0.1
 */
export class Loader{

    private static isBusy = false;

    private logger : Logger      = null;
    private timerHandle : Timeout = null;
    private size :  number        = 0;
    private maxSize : number      = 0;

    private static wheel : Array<String> = ["\\", "|", "/", "-"];

    constructor( size : number = 0 ) {
        this.logger = Logger.factory("Loader").setPattern("");
        this.maxSize = size;
    }

    private static repeat( char : string = "", loop : number = 0 ) : string {
        loop = loop-1<0?0:loop-1;
        return Utils.repeat(char,loop)+(loop<=99 ? ">" : char)+Utils.repeat(".",99-loop);
    }

    public start( endingMessage : string = "" ) : Loader {
        let next = 0,perc;
        if(Loader.isBusy) return;
        this.timerHandle = setInterval(()=>{
            perc = Math.round( (this.size / this.maxSize )*100 );
            process.stdout.write("\r"+Loader.wheel[next++]+"-[ \x1b[36m" + Loader.repeat("=",perc) +"\x1b[0m ] "+perc+"%");
            next &=3;
            if(perc>=100) this.end(endingMessage);
        } ,250 );
        Loader.isBusy = true;
        return this;
    }

    public add( bytes : number = 0 ) : void { this.size += bytes; }

    public end( message : string = null ) :void {
        process.stdout.write("");
        this.logger.info(message || "successful");
        clearInterval(this.timerHandle);
        this.maxSize = this.size = 0;
        this.timerHandle = null;
        Loader.isBusy = false;
    }

    public close( ) : void{ this.end("close loader event"); }

    public static loaderIsBusy( ) : boolean { return Loader.isBusy; }
}