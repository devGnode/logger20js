import {v4} from 'uuid';
import {Utils} from "./Utils";

const {format} = require("util");
const {Stream} = require("./lib/Stream.js");

export class Logger{

    /***
     * Basic configuration
     */
    private static parser    : String   = "[%hours] %T/%name - %hours - %error";
    private static outputLog : string   = "";
    private static saveLog   : boolean  = false;
    private static logStdout : boolean  = true;
    private static logLevel  : String[] = ["ALL"];
    private static colorize : boolean = true;

    /**
     * output file
     */
    public static oid     : String   = v4();

    /***
     * handles
     */
    private static pipeStdout : any         = null;
    private static propertiesConfig : any   = null;
    private static fileNamePattern : String = "%date-%id";
    private static logfileReuse : String    = null;
    private static fileMaxSize  : number    = null;

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
            Logger.fileNamePattern = Logger.propertiesConfig.getProperty("logFileNamePattern","%date-%id");
            Logger.fileMaxSize     = Logger.propertiesConfig.getProperty("logFileMaxSize",null);
            Logger.logfileReuse    = Logger.propertiesConfig.getProperty("logFileReusePath",null);
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

    public static setParser( parsing : String = Logger.parser ) : void {
        Logger.parser = parsing;
    }

    public static level( level : String[] = [] ) : void {
        Logger.logLevel = level;
    }

    public static setLogFilePattern( pattern : String = Logger.fileNamePattern ) : void {
        Logger.fileNamePattern = pattern;
    }

    public static setFileMaxSize(bytes : number = null) : void {
        Logger.fileMaxSize = bytes;
    }

    public static setLogFileReuse( path : String = null ) : void {
        Logger.logfileReuse = path;
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

           // colors next-ticket
           // \x1b[35m%s\x1b[0m
           args.map(value=>typeof value==="object"?JSON.stringify(value):value);
           Object().stream().of( {
                type : type,
                name : args.shift(),
                error: format.apply(null,args),
                time : d.getTime(),
                hours: format("%s:%s:%s",h,m,s),
                HH:h, mm: m, ss: s, ssss: ss,
                T: type.substr(0,1).toUpperCase(),
            }).each((value,key)=>{
                // @ts-ignore
               errorMsg = Utils.regExp(new RegExp(`\%${key}`),errorMsg,()=>value.toString());
            });

           if(Logger.saveLog){
               let filename = Logger.fileNamePattern;
               Object().stream().of({
                   id : Logger.oid,
                   date : d.toLocaleDateString( ).replace(/\//g,"-"),
                   HH:h, mm: m, ss: s, ssss: ss,
                   reuse: Logger.logfileReuse
               }).each((value,key)=>{
                   filename = filename.replace(new RegExp(`\%${key}`),value);
               });

               if( Logger.fileMaxSize===null || ( Logger.fileMaxSize>=0 && Utils.getFileSize(Logger.outputLog+`/${filename}.log`) <= Logger.fileMaxSize )){
                   try {
                       Utils.writeLog(
                           Logger.outputLog,
                           filename,
                           errorMsg
                       );
                   }catch (e) {
                       console.warn(e);
                   }
               }
           }
            if(Logger.logStdout) {
                if(Logger.pipeStdout!==null) this.pipeStdout.write(errorMsg); else {
                    // @ts-ignore
                    process.stdout.write(errorMsg+"\n");
                }
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