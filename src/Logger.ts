import {v4} from 'uuid';
import {Utils} from "./Utils";

const {format} = require("util");
const {Stream} = require("./lib/Stream.js");

export class Logger{

    /***
     * Basic configuration
     */
    private static parser    : String   = "[%HH:%mm:%ss] %T/%name - %error";
    private static outputLog : string   = "";
    private static saveLog   : boolean  = false;
    private static logStdout : boolean  = true;
    private static logLevel  : String[] = ["ALL"];

    /**
     * output file
     */
    public static oid     : String   = v4();

    /***
     * handles
     */
    private static pipeStdout : any       = null;
    private static propertiesConfig : any = null;

    /***
     * others
     */
    private name : String           = null;

    constructor( name : String = undefined ) {

        /***
         * Rewrite Logger configuration
         * getProperty :
         *  @key
         *  @defaultValue
         */
        if(Logger.propertiesConfig!==null&&typeof Logger.propertiesConfig.getProperty === "function"){
            Logger.parser       = Logger.propertiesConfig.getProperty("loggerParser","%time\t%name\t : %type :\t%error");
            Logger.outputLog    = Logger.propertiesConfig.getProperty("loggerOutputDir", "");
            Logger.saveLog      = Logger.propertiesConfig.getProperty("saveLog", true);
            Logger.logStdout    = Logger.propertiesConfig.getProperty("logStdout", true);
            Logger.logLevel     = Logger.propertiesConfig.getProperty("logLevel", ["ALL"]);
        }

        this.name = name;
    }

    public warn( ... args : any ) : void {
        Logger.stdout.apply(null,["warn",this.name].concat(Array.from(arguments)));
    }

    public log( ... args : any ) : void {
        Logger.stdout.apply(null,["log",this.name].concat(Array.from(arguments)));
    }

    public info( ... args : any ) : void {
        Logger.stdout.apply(null,["info",this.name].concat(Array.from(arguments)));
    }

    public debug( ... args : any ) : void {
        Logger.stdout.apply(null,["debug",this.name].concat(Array.from(arguments)));
    }

    public error( ... args : any ) : void {
        Logger.stdout.apply(null,["error",this.name].concat(Array.from(arguments)));
    }

    public custom( ... args : any ) : void {
        let tmp = Logger.parser;
        Logger.parser = Logger.parser.replace(/\%error/g,"\r\n%error");
        Logger.stdout.apply(null,["custom",this.name].concat(Array.from(arguments)));
        Logger.parser = tmp;
    }

    public static setPropertiesConfigHandle( handle : any = null ){
        Logger.propertiesConfig = handle;
    }

    public static setOutputLog( path : string = "" ) : void {
        Logger.outputLog = path;
    }

    public static setSaveLog( save : boolean =  false ) : void {
        Logger.saveLog = save;
    }

    public static setLogStdout( stdout : boolean = true ) : void {
        Logger.logStdout = stdout;
    }

    public static setParser( parsing : String = "") : void {
        Logger.parser = parsing;
    }

    public static level( level : String[] = [] ) : void {
        Logger.logLevel = level;
    }

    public static setPipeStdout( pipe : any = null ) : void {
        Logger.pipeStdout = pipe;
    }

    /***
     * @param type, errorMsg [, Object .... ]
     */
    private static stdout( ) : void {
        let args = Array.from(arguments),
            type     = args.shift().toUpperCase(),
            errorMsg = Logger.parser;

        if( Logger.logLevel.indexOf(type.toUpperCase())>-1||Logger.logLevel.indexOf("ALL")>-1) {
           let d = new Date(),
               h = Utils.round(d.getHours()),
               m = Utils.round(d.getMinutes()),
               s = Utils.round(d.getSeconds()),
               ss= d.getMilliseconds() ;

           Object().stream.of( {
                type : type,
                name : args.shift(),
                error: format.apply(null,args),
                time : d.getTime(),
                hours: format("\x1b[32m%s:%s:%s[0m",h,m,s),
                HH:h, mm: m, ss: s, ssss: ss,
                T: type.substr(0,1).toUpperCase(),
            }).each((value,key)=>{
                errorMsg = errorMsg.replace(new RegExp(/`\%${key}`/g),value.toString());
            });

            // merge error line
            if(Logger.saveLog){
               Utils.writeLog(
                    Logger.outputLog,
                    format("%s-%s",(new Date()).toLocaleDateString( ).replace(/\//g,"-"),Logger.oid),
                    errorMsg
                );
            }
            if(Logger.logStdout) {
                if(Logger.pipeStdout!==null) this.pipeStdout.write(errorMsg); else console.log(errorMsg);
            }
        }
    }

    /***
     * @constructor
     * @param name
     */
    public static factory(name : String = undefined ) : Logger {
        return new Logger(name);
    }
}