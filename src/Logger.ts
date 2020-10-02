import "lib-utils-ts/src/globalUtils";
import {v4} from 'uuid';
import {Utils} from "./Utils";
import {format} from "util";
import {HashMap} from "lib-utils-ts/export/utils-ts";
import {ascii} from "lib-utils-ts/src/Interface";


type filterLogLevel<T> = String[] | [ ... T[] ]
type strLogLevel = "ALL" |"LOG" | "DEBUG" | "ERROR" | "INFO" | "CUSTOM"

export class Logger{

    public static readonly DEFAULT_LOG_PATTERN_MONO        : string = "%time\t%name\t: %type :\t%error";
    public static readonly WEBDRIVER_LOG_PATTERN_COLORED   : string = "[%hours{cyan}] %T{w?yellow;e?red}/%name - %error";

    private static readonly COLORS_REGEXP : RegExp = /(\%[a-zA-z]+)\{([a-z]+|((([lewidc]+)\?[a-z]+?\;*)+?(\:[a-z]+)*)+)\}/;
    /***
     * Basic configuration
     */
    private static parser    : String   = Logger.DEFAULT_LOG_PATTERN_MONO;
    private static outputLog : string   = "";
    private static saveLog   : boolean  = false;
    private static logStdout : boolean  = true;
    private static logLevel  : filterLogLevel<strLogLevel> = ["ALL"];
    private static colorize : boolean   = true;
    /**
     * output file
     */
    public static oid     : String   = v4();
    /***
     * handles
     */
    private static pipeStdout :  InstanceType<any>      = null;
    private static propertiesConfig : InstanceType<any> = null;
    private static fileNamePattern : String = "%date-%id";
    private static logfileReuse : String    = null;
    private static fileMaxSize  : number    = null;
    /***
     * others
     */
    private name : String           = null;
    private pattern : String        = null;

    constructor( name : String = undefined ) {
        /***
         * Rewrite Logger configuration
         * getProperty :
         *  @key
         *  @defaultValue
         */
        if(Logger.propertiesConfig!==null&&typeof Logger.propertiesConfig.getProperty === "function"){
            Logger.parser       = Logger.propertiesConfig.getProperty("loggerParser","%time\t%name\t : %type :\t%error");
            Logger.saveLog      = Logger.propertiesConfig.getProperty("saveLog", true);
            Logger.logStdout    = Logger.propertiesConfig.getProperty("logStdout", true);
            Logger.logLevel     = Logger.propertiesConfig.getProperty("logLevel", ["ALL"]);
            Logger.fileNamePattern = Logger.propertiesConfig.getProperty("logFileNamePattern","%date-%id");
            Logger.outputLog       = Logger.propertiesConfig.getProperty("loggerOutputDir", "");
            Logger.fileMaxSize     = Logger.propertiesConfig.getProperty("logFileMaxSize",null);
            Logger.logfileReuse    = Logger.propertiesConfig.getProperty("logFileReusePath",null);
            Logger.colorize        = Logger.propertiesConfig.getProperty("logEnabledColorize", true );
        }

        this.name = name;
    }

    public warn( ... args : any ) : void {
        Logger.stdout.apply(null,["warn",this.pattern,this.name].concat(Array.from(arguments)));
    }

    public log( ... args : any ) : void {
        Logger.stdout.apply(null,["log",this.pattern,this.name].concat(Array.from(arguments)));
    }

    public info( ... args : any ) : void {
        Logger.stdout.apply(null,["info",this.pattern,this.name].concat(Array.from(arguments)));
    }

    public debug( ... args : any ) : void {
        Logger.stdout.apply(null,["debug",this.pattern,this.name].concat(Array.from(arguments)));
    }

    public error( ... args : any ) : void {
        Logger.stdout.apply(null,["error",this.pattern,this.name].concat(Array.from(arguments)));
    }

    public custom( ... args : any ) : void {
        let tmp = Logger.parser;
        Logger.parser = Logger.parser.replace(/\%error/g,"\r\n%error");
        Logger.stdout.apply(null,["custom",this.pattern,this.name].concat(Array.from(arguments)));
        Logger.parser = tmp;
    }

    public setPattern( pattern : String = "" ) : Logger{
        this.pattern = pattern;
        return this;
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

    public static setParser( parsing : String = Logger.DEFAULT_LOG_PATTERN_MONO ) : void {
        Logger.parser = parsing;
    }

    public static level( level : filterLogLevel<strLogLevel> = ["ALL"] ) : void {
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

    public static setPipeStdout( pipe : Object = null ) : void {
        Logger.pipeStdout = pipe;
    }

    public static setColorize( status : boolean = true ) : void {
        Logger.colorize = status;
    }

    private static translateColorToInt( color : string = "black" ) : String {
       let colors : string[] = [
                    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
                    'black','red','green','yellow',
                    'blue','magenta','cyan','white','gray','grey','bblack','bred','bgreen'
                    ];
       return colors.indexOf(color)>-1? String(colors.indexOf(color)):"30";
    }

    public static getLoggerFileName(){
        let d = new Date(),
            filename = Logger.fileNamePattern;
        HashMap.of<ascii>({
            id : Logger.oid,
            date : d.toLocaleDateString( ).replace(/\//g,"-"),
            ms: d.getMilliseconds(), HH:Utils.round(d.getHours()),
            mm: Utils.round(d.getMinutes()), ss: Utils.round(d.getSeconds()),
            reuse: Logger.logfileReuse
        }).each((value,key)=>{
            filename = filename.replace(new RegExp(`\%${key}`),String(value));
        });

        return filename;
    }

    /***
     * @param type, errorMsg [, Object .... ]
     */
    private static stdout( ) : void {
        let args     = Array.from(arguments),
            type     = args.shift().toUpperCase(),
            errorMsg =  args.shift() || Logger.parser;

        if( Logger.logLevel.indexOf(type.toUpperCase())>-1||Logger.logLevel.indexOf("ALL")>-1) {
           let d = new Date(),
               h = Utils.round(d.getHours()),
               m = Utils.round(d.getMinutes()),
               s = Utils.round(d.getSeconds()),
               ss= d.getMilliseconds() ;

           // cast Object to String
           args.map(value=>(typeof value).equals("object")?JSON.stringify(value):value);

          if(Logger.COLORS_REGEXP.test(errorMsg))
           errorMsg = errorMsg.regExp(Logger.COLORS_REGEXP,function(){
                let define=null,interrupt=null, _t=type.substring(0,1).toLowerCase();

                if(!Logger.colorize) return this[1];
                if(this[1].equals("%type")||this[1].equals("%T")&&this[3]!==undefined){
                    // try to define color
                    this[2].regExp(/([lewidc]{1})\?([a-z]+)?\;*/,function(){
                        if(_t.equals(this[1]))define = Logger.translateColorToInt(this[2]);
                   });
                   // default color
                   if(define===null&&this[6]!==undefined)define=Logger.translateColorToInt(this[6].replace(/^\:/,""));
                   // return %parser without any color
                   else if(define===null&&this[6]===undefined) interrupt=this[1];
                }
               return (interrupt || format("\x1b[%sm%s\x1b[0m",define||Logger.translateColorToInt(this[2]),this[1]));
           });
          HashMap.of<ascii>( {
                type : type,
                name : args.shift(),
                time : d.getTime(),
                hours: format("%s:%s:%s",h,m,s),
                ms: ss, HH:h, mm: m, ss: s,
                T: type.substr(0,1).toUpperCase()
            }).each((value,key)=>{
                // @ts-ignore
               errorMsg = Utils.regExp(new RegExp(`\%${key}`),errorMsg,()=>value.toString());
            });
            /***
             * replace message log here avoid
             * regexp fall in infinite loop
             */
            errorMsg = errorMsg.replace(/\%error|\%message/gi,format.apply(null,args));
           if(Logger.saveLog){
               let filename = Logger.getLoggerFileName();
               if(
                   Logger.fileMaxSize===null || ( Logger.fileMaxSize>=0 &&
                   Utils.getFileSize(Logger.outputLog+`/${filename}.log`) <= Logger.fileMaxSize )
               ){
                   try {
                       Utils.writeLog(Logger.outputLog, filename, errorMsg);
                   }catch (e) {console.warn(e);}
               }
           }
            if(Logger.logStdout) {
                if(Logger.pipeStdout!==null) Logger.pipeStdout?.write.call(null,errorMsg); else {
                    //process.stdout.clearLine(0);
                    //process.stdout.cursorTo(0);
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