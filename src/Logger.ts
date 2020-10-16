import "lib-utils-ts/src/globalUtils";
import * as readline from 'readline';
import {v4} from 'uuid';
import {Utils} from "./Utils";
import {format} from "util";
import {HashMap,ArrayList} from "lib-utils-ts";
import {ascii, List} from "lib-utils-ts/src/Interface";
import {filterLogLevel, Loggable, strLogLevel} from "./Loggable";
import {Loader} from "./loader";
/****
 * Minimal logger in js-ts.
 * I hope this code can be utils to somebody :)
 *
 * npm     : logger20js-ts
 * version:  1.2.4
 * Licence : Apache-2.0
 */
export class Logger implements Loggable{
    /**
     * static Pattern
     */
    public static readonly DEFAULT_LOG_PATTERN_MONO        : string = "%time\t%name\t: %type :\t%error";
    public static readonly WEBDRIVER_LOG_PATTERN_COLORED   : string = "[%hours{cyan}] %T{w?yellow;e?red}/%name - %error";
    public static readonly EXPRESS_MIDDLEWARE_PATTERN      : string = "[%hours{yellow}] %name %protocol{red} - %method %url +%elapsedTime{yellow}";
    public static readonly STATS_MEMORY_PATTERN            : string = "[%hours{cyan}] %T{cyan}/%name{cyan} memory : heap( %heapUsed{yellow}, %heapTotal{yellow} ) : rss( %rss{yellow} ) : external( %external{yellow} )";
    public static readonly CPU_USAGE_PATTERN               : string = "[%hours{cyan}] user CPUTime( %userCPUTime{yellow} ) system CPUTime( %systemCPUTime{yellow} ) maxRss( %maxRSS{yellow} ) ";
    /***
     */
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
    private static cleanUpBeforeSave : boolean = true;
    private static logRotate : string   = null;
    private static rotateOutOfTimestamp : Date = Utils.getRotateTimestampOutOf(Logger.logRotate);
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
    private prop : Object           = {};
    private name : String           = null;
    private pattern : String        = null;

    constructor( name : String = undefined ) {
        /***
         * Rewrite Logger configuration
         * getProperty :
         *  @key
         *  @defaultValue
         *//***
            + Next Feature
            + in real that make no sense to define this here, if you have declared all logger handle but you
            + modify your owns properties after to have declared them, well with out a reload the configuration
            + properties of Logger they will not be updated. So i think its better to created a method for
            + reload the configuration when i wish updated them....
         */
        if(Logger.propertiesConfig!==null&&typeof Logger.propertiesConfig?.getProperty === "function"){
            Logger.parser       = Logger.propertiesConfig.getProperty("loggerParser","%time\t%name\t : %type :\t%error");
            Logger.saveLog      = Logger.propertiesConfig.getProperty("saveLog", true);
            Logger.logStdout    = Logger.propertiesConfig.getProperty("logStdout", true);
            Logger.logLevel     = Logger.propertiesConfig.getProperty("logLevel", ["ALL"]);
            Logger.fileNamePattern = Logger.propertiesConfig.getProperty("logFileNamePattern","%date-%id");
            Logger.outputLog       = Logger.propertiesConfig.getProperty("loggerOutputDir","");
            Logger.fileMaxSize     = Logger.propertiesConfig.getProperty("logFileMaxSize",null);
            Logger.logfileReuse    = Logger.propertiesConfig.getProperty("logFileReusePath",null);
            Logger.colorize        = Logger.propertiesConfig.getProperty("logEnabledColorize", true );
        }
        this.name = name;
    }

    public warn( ... args : any[] ) : void {
        Logger.stdout.apply(null,["warn",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public log( ... args : any[] ) : void {
        Logger.stdout.apply(null,["log",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public info( ... args : any[] ) : void {
        Logger.stdout.apply(null,["info",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public debug( ... args : any[] ) : void {
        Logger.stdout.apply(null,["debug",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public error( ... args : any[] ) : void {
        Logger.stdout.apply(null,["error",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public custom( ... args : any[] ) : void {
        let tmp = Logger.parser;
        Logger.parser = Logger.parser.replace(/\%error/g,"\r\n%error");
        Logger.stdout.apply(null,["custom",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
        Logger.parser = tmp;
    }

    public setPattern( pattern : String = "" ) : Logger{
        this.pattern = pattern;
        return this;
    }

    public setProp( key : string|number, value : any ) : Logger{
        this.prop[key] = value;
        return this;
    }

    public setPropObject( ... args : Object[] ) : Logger{
        Utils.merge.apply(null, [this.prop].concat(Array.from(args)));
        return this;
    }

    public static setPropertiesConfigHandle( handle : any = null ) : void {
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
    /***
     * use  : setPattern method
     * @deprecated
     */
    public static setParser( parsing : String = Logger.DEFAULT_LOG_PATTERN_MONO ) : void {
        Logger.parser = parsing;
    }

    public static setPattern( pattern : String = Logger.DEFAULT_LOG_PATTERN_MONO ) : void {
        Logger.parser = pattern;
    }

    public static level( level : filterLogLevel<strLogLevel> = ["ALL"] ) : void {
        Logger.logLevel = level;
    }

    public static popLevel( logType : strLogLevel = "ALL" ) : void{
        let tmp;
        if((tmp=this.logLevel.indexOf(logType))>-1)this.logLevel = this.logLevel.slice(0,tmp).concat(this.logLevel.slice(tmp+1,this.logLevel.length));
    }

    public static pushLevel( logType : strLogLevel = "ALL" ): void{
        if(this.logLevel.indexOf(logType)===-1)this.logLevel.push(logType);
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

    public static setCleanUpBeforeSave( state : boolean = Logger.cleanUpBeforeSave ) : void {
        Logger.cleanUpBeforeSave = state;
    }

    public static setLogRotate( rotate : string = "1d" ) : void {
        let date : Date;
        if((date=Utils.getRotateTimestampOutOf(rotate))){
            this.rotateOutOfTimestamp = date;
            return;
        }
        this.rotateOutOfTimestamp = null;
    }

    private static restartRotate( ) : void{
        this.rotateOutOfTimestamp = Utils.getRotateTimestampOutOf(Logger.logRotate);
    }

    private static translateColorToInt( color : string = "black" ) : String {
       let colors : string[] = [
                    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
                    'black','red','green','yellow',
                    'blue','magenta','cyan','white','gray','grey',
                    'bblack','bred','bgreen','byellow','bblue','bmagenta',
                    'bcyan','cwhite','cgray','cgrey'
                    ];
       return colors.indexOf(color)>-1? String(colors.indexOf(color)):"30";
    }
    /***
     */
    public static getLoggerFileName() : String {
        let d = new Date(),
            filename = Logger.fileNamePattern;
        HashMap.of<string,ascii>({
            id : Logger.oid,
            date : d.toLocaleDateString( ).replace(/\//g,"-"),
            ms: d.getMilliseconds(), HH:Utils.round(d.getHours()),
            mm: Utils.round(d.getMinutes()), ss: Utils.round(d.getSeconds()),
            rotate: "."+(String(Logger.rotateOutOfTimestamp?.getTime())||"null"),
            reuse: Logger.logfileReuse
        }).each((value,key)=>{
            filename = filename.replace(new RegExp(`\%${key}`),String(value));
        });
        return filename;
    }
    /***
     * @param message
     * @param type
     * @param colorize
     */
    private static colorizeString( message : string = null, type :string = null, colorize: boolean = Logger.colorize ) : string {
        return message.regExp(Logger.COLORS_REGEXP,function(){
            let define=null,interrupt=null, _t=type.substring(0,1).toLowerCase();

            if(!colorize) return this[1];
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
    }
    /***
     * @param message
     * @param type
     * @param name
     * @param dat
     */
    private static parseString( message : String = null, type : string = null, name : string = null, dat : Object = null ) : String {
        let list :  ArrayList<string>,tmp : any = {}, d = new Date(),
            h = Utils.round(d.getHours()), m = Utils.round(d.getMinutes()),
            s = Utils.round(d.getSeconds()), ss= d.getMilliseconds() ;

        try {
            // try to define the name of file in exception
            // and the line number and columns.
            list = (Error()).stack
                .replace(/\w+\:\s*\n/, "")
                .explodeAsList(/\n|\r\n/)
                .stream()
                .filter(value => !(/Logger\.[\w]{2}/.test(value)))
                .findFirst()
                .orElse("nop (unknown:0:0)")
                .replace(/.+\(|\)/gi, "")
                .exec(/([^\\\/]*)$/)[1]
                .explodeAsList(":");
            tmp.fileInException = list.get(0);
            tmp.line            = list.get(1);
            tmp.column          = list.get(2);
        }catch (e) {console.warn(e);}

        HashMap.of<string,any>( Utils.merge({
            type : type,
            name : name,
            time : d.getTime(),
            hours: format("%s:%s:%s",h,m,s),
            ms: ss, HH:h, mm: m, ss: s,
            pid: process.pid, ppid: process.ppid,
            T: type.substr(0,1).toUpperCase()
        },dat||{},tmp))
            .each((value,key)=>{
            message = message.regExp(new RegExp(`\%${key}`),()=>value.toString());
        });
        return message;
    }
    /***
     * @param type, message [, Object .... ]
     */
    private static stdout( ) : void {
        let args     = Array.from(arguments),
            type     = args.shift().toUpperCase(),
            message  =  args.shift() || Logger.parser,
            prop     = args.shift(), name = args.shift(),
            out : List<String> = new ArrayList<String>(),
            cleanArgv : Array<any> = [];

        if( Logger.logLevel.indexOf(type.toUpperCase())>-1||Logger.logLevel.indexOf("ALL")>-1) {

            // cast Object to String
            args.map(value=>(typeof value).equals("object")?JSON.stringify(value):value);
            // check if colorize pattern
            if(Logger.COLORS_REGEXP.test(message)) {
                if(Logger.cleanUpBeforeSave&&Logger.saveLog) out.add(Logger.colorizeString(message, type,false)); // cleanUp
                out.add(Logger.colorizeString(message, type, Logger.colorize));
            }else out.add(message);

            cleanArgv = args.map(value=>typeof value==="string"?value.colorize().cleanUp:value);
            out = out.stream()
              .map(value=>Logger.parseString(value,type,name,prop))
              /***
               * replace message log here avoid
               * regexp fall in infinite loop
               */
              .map((value,key)=>value.replace(/\%error|\%message/gi,format.apply(null,key===0&&(!Logger.colorize||Logger.cleanUpBeforeSave&&Logger.saveLog)?cleanArgv:args)))
              .getList();

          if(Logger.saveLog){
               // logRotate
              if( Logger.rotateOutOfTimestamp && (new Date()).getTime() > Logger.rotateOutOfTimestamp.getTime() )Logger.restartRotate();
               let filename = Logger.getLoggerFileName();
               if(
                   Logger.fileMaxSize===null || ( Logger.fileMaxSize>=0 &&
                   Utils.getFileSize(Logger.outputLog+`/${filename}.log`) <= Logger.fileMaxSize )
               ){
                   try {Utils.writeLog(Logger.outputLog, filename, out.get(0) )}
                   catch (e) {
                       console.warn(e);
                   }
               }
          }
            if(Logger.logStdout) {
                message = out.get( out.size()>1? 1 : 0 );
                if(Logger.pipeStdout!==null) Logger.pipeStdout?.write.call(null,message); else {
                    readline.clearLine(process.stdout,0);
                    readline.cursorTo( process.stdout,0);
                    process.stdout.write(message+"\n");
                }
            }
        }
    }
    /***
     * Express Route Logger Middleware
     * pattern :
     *      %protocol,
     *      %host,
     *      %port,
     *      %method,
     *      %url,
     *      %originalUrl
     *      ...
     * @param pattern
     */
    public static expressRouteLoggerMiddleware( pattern : string = null ) : Function {
        let logger = Logger.factory("ExpressRoute").setPattern(pattern||Logger.EXPRESS_MIDDLEWARE_PATTERN),
            date   = new Date().toISOString();
        return (req,res,next) => {
            let _d = new Date();
            logger.setProp("protocol",req.protocol||undefined)
                .setProp("host",req.hostname||undefined)
                .setProp("port",req.port||undefined)
                .setProp("method",req.method.toUpperCase()||undefined)
                .setProp("url",req.url||undefined)
                .setProp("remoteAddr", req.connection.remoteAddress||undefined)
                .setProp("elapsedTime", Utils.parseTime(_d.getTime()-new Date(date).getTime())||undefined)
                .log();
            date = _d.toISOString();
            next();
        };
    }
    /***
     * @param sizeOf
     */
    public static getLoader( sizeOf : number = 0 ) : Loader{
        if(!Loader.loaderIsBusy()) return new Loader(sizeOf);
        return null;
    }
    /***
     */
    public static stats( ) :Stats{return Stats.getInstance();}
    /***
     * @constructor
     * @param name
     */
    public static factory(name : String = undefined ) : Logger {
        return new Logger(name);
    }
}
/***
 * Stats Class has been declared here
 * but i wish to move it to another place
 */
class Stats{

    private static readonly INSTANCE :Stats     = new Stats();
    private readonly Log :Logger                = Logger.factory(Stats.name);
    private readonly patternList : List<String> = null;

    constructor() {
        if(Stats.INSTANCE) return;
        this.patternList = ArrayList.of([Logger.STATS_MEMORY_PATTERN,Logger.CPU_USAGE_PATTERN] );
        this.Log
            .setPropObject(process.memoryUsage(),process.resourceUsage(),process.versions)
            .setProp("pid",process.pid)
            .setProp("ppid",process.ppid);
    }

    private apply( key : number, pattern : string = null ) : void{
        if(pattern) this.patternList.set(key,pattern);
        this.Log.setPattern(pattern||this.patternList.get(key)).debug();
    }

    public memory( pattern : string = null ) : void{this.apply(0,pattern);}

    public cpu( pattern : string = null ) : void{this.apply(1,pattern);}

    public version( pattern : string ) : void{this.apply(2,pattern);}

    public static getInstance(){return Stats.INSTANCE;}
}