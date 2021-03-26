import {Logger} from "./Logger";
import Timeout = NodeJS.Timeout;
import "./Colorize";
import {Loggable} from "./Loggable";
import {loader} from "lib-utils-ts/src/Interface";
/***
 * ALPHA CLASS
 * v 0.0.1
 */
export class Loader implements loader{

    private static isBusy = false;

    private logger : Loggable     = null;
    private timerHandle : Timeout = null;
    private size :  number        = 0;
    private maxSize : number      = 0;

    private static wheel : Array<String> = ["\\", "|", "/", "-"];

    constructor( size : number = 0, logger:Logger = null ) {
        this.logger = logger || Logger.factory("Loader").setPattern("");
        this.maxSize = size;
    }

    private static repeat( char : string = "", loop : number = 0 ) : string {
        loop = loop-1<0?0:loop-1;
        return String.repeatString(char,loop)+(loop<=99 ? ">" : char)+String.repeatString(".",99-loop);
    }

    public start( endingMessage : string = "" ) : Loader {
        let next : number = 0,perc : number;
        if(Loader.isBusy) return;
        this.timerHandle = setInterval(()=>{
            perc = Math.round( (this.size / this.maxSize )*100 );
            process.stdout.write("\r"+Loader.wheel[next++]+"-[ \x1b[36m" + Loader.repeat("=",perc||0) +"\x1b[0m ] "+(perc||0)+"%");
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

    public setSizeOf( size:number): Loader{ this.maxSize=size; return this;}

    public error( message:string ): void{ this.logger.error(message); this.end("An error has occurred"); }

    public close( ) : void{ this.end("loader has been closed"); }

    public static loaderIsBusy( ) : boolean { return Loader.isBusy; }
}