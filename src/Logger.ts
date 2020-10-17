import "lib-utils-ts/src/globalUtils";
import * as readline from 'readline';
import {v4} from 'uuid';
import {Utils} from "./Utils";
import {format} from "util";
import {HashMap,ArrayList} from "lib-utils-ts";
import {ascii, List} from "lib-utils-ts/src/Interface";
import {filterLogLevel, IPropertiesFileA, Loggable, Pipe, strLogLevel} from "./Loggable";
import {Loader} from "./Loader";
import {Define} from "lib-utils-ts/src/Define";
/****
 * Minimal logger in js-ts.
 *
 * npm     : logger20js-ts
 * version:  1.2.3
 * Licence : Apache-2.0
 */
export abstract class AbsLogger implements Loggable{
    /**
     * static Pattern
     */
    public static readonly DEFAULT_LOG_PATTERN_MONO        : string = "%time\t%name\t: %type :\t%error";
    public static readonly WEBDRIVER_LOG_PATTERN_COLORED   : string = "[%hours{cyan}] %T{w?yellow;e?red}/%name - %error";
    public static readonly EXPRESS_MIDDLEWARE_PATTERN      : string = "[%hours{yellow}] %name %protocol{red} - %method %url +%elapsedTime{yellow}";
    public static readonly STATS_MEMORY_PATTERN            : string = "[%hours{cyan}] %T{cyan}/%name{cyan} memory : heap( %heapUsed{yellow}, %heapTotal{yellow} ) : rss( %rss{yellow} ) : external( %external{yellow} )";
    public static readonly CPU_USAGE_PATTERN               : string = "[%hours{cyan}] user CPUTime( %userCPUTime{yellow} ) system CPUTime( %systemCPUTime{yellow} ) maxRss( %maxRSS{yellow} ) ";
    public static readonly VERSION_USAGE_PATTERN           : string = "[%hours{cyan}] version of : node( %node{yellow} ) - v8( %v8{yellow} )";
    /***
     */
    private static readonly COLORS_REGEXP : RegExp = /(\%[a-zA-z]+)\{([a-z]+|((([lewidc]+)\?[a-z]+?\;*)+?(\:[a-z]+)*)+)\}/;
    /***
     * All properties configuration
     */
    protected static parser    : String   = AbsLogger.DEFAULT_LOG_PATTERN_MONO;
    protected static outputLog : string   = "";
    protected static saveLog   : boolean  = false;
    protected static logStdout : boolean  = true;
    protected static logLevel  : filterLogLevel<strLogLevel> = ["ALL"];
    protected static colorize : boolean   = true;
    protected static cleanUpBeforeSave : boolean = true;
    protected static logRotate : string   = null;
    protected static rotateOutOfTimestamp : Date = Utils.getRotateTimestampOutOf(AbsLogger.logRotate);
    /**
     * output file uuid
     */
    public static oid     : String   = v4();
    /***
     * handles
     */
    protected static pipeStdout :  Pipe<string> = null;
    protected static propertiesConfig : IPropertiesFileA = null;
    protected static fileNamePattern : String = "%date-%id";
    protected static logfileReuse : String    = null;
    protected static fileMaxSize  : number    = null;
    /***
     * object configuration properties
     */
    protected prop : Object           = {};
    protected name : String           = null;
    protected pattern : String        = null;
    /***
     *
     * @param name
     */
    protected constructor( name : String = undefined ) {
        this.name = name;
    }

    public warn( ... args : any[] ) : void {
        AbsLogger.stdout.apply(null,["warn",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public log( ... args : any[] ) : void {
        AbsLogger.stdout.apply(null,["log",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public info( ... args : any[] ) : void {
        AbsLogger.stdout.apply(null,["info",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public debug( ... args : any[] ) : void {
        AbsLogger.stdout.apply(null,["debug",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public error( ... args : any[] ) : void {
        AbsLogger.stdout.apply(null,["error",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
    }

    public custom( ... args : any[] ) : void {
        let tmp = AbsLogger.parser;
        AbsLogger.parser = AbsLogger.parser.replace(/\%error/g,"\r\n%error");
        AbsLogger.stdout.apply(null,["custom",this.pattern,this.prop,this.name].concat(Array.from(arguments)));
        AbsLogger.parser = tmp;
    }

    public setPattern( pattern : String = "" ) :Loggable{
        this.pattern = pattern;
        return this;
    }

    public setProp( key : string|number, value : any ) :Loggable{
        this.prop[key] = value;
        return this;
    }

    public setPropObject( ... args : Object[] ) :Loggable{
        Utils.merge.apply(null, [this.prop].concat(Array.from(args)));
        return this;
    }
    /***
     *
     * Static Configuration
     */
    public static setPropertiesConfigHandle( handle : IPropertiesFileA = null ) : void {
        AbsLogger.propertiesConfig = handle;
        AbsLogger.setLogRotate(Define.of(handle.getProperty("logRotate")).orNull(null));
        AbsLogger.setOutputLog(Define.of(handle.getProperty("loggerOutputDir")).orNull(""));
        AbsLogger.setFileMaxSize(Define.of(handle.getProperty("logFileMaxSize")).orNull(null));
        AbsLogger.setLogFilePattern(Define.of(handle.getProperty("logFileNamePattern")).orNull("%date-%id"));
        this.reloadConfiguration( );
    }
    /***
     * To call each time you modify your logProperties
     * from your owns properties class.
     *
     * I gotta ue define, for get good default property cause
     * if user make a wrong implementation of getProperty for
     * the default Value that result a corrupt object
     */
    protected static reloadConfiguration( ): void{
        let prop: IPropertiesFileA;
        if((prop=this.propertiesConfig)===null) return;
        AbsLogger.parser       = Define.of(prop.getProperty("loggerParser")).orNull(AbsLogger.DEFAULT_LOG_PATTERN_MONO);
        AbsLogger.saveLog      = Define.of(prop.getProperty("saveLog")).orNull(true);
        AbsLogger.logStdout    = Define.of(prop.getProperty("logStdout")).orNull( true);
        AbsLogger.logLevel     = Define.of(prop.getProperty("logLevel")).orNull( ["ALL"]);
        AbsLogger.colorize     = Define.of(prop.getProperty("logEnabledColorize")).orNull(true );
    }

    public static setOutputLog( path : string = "" ) : void {
        AbsLogger.outputLog = path;
    }

    public static setSaveLog( save : boolean =  false ) : void {
        AbsLogger.saveLog = save;
    }

    public static setLogStdout( stdout : boolean = true ) : void {
        AbsLogger.logStdout = stdout;
    }
    /***
     * use  : setPattern method
     * @deprecated
     */
    public static setParser( parsing : String = AbsLogger.DEFAULT_LOG_PATTERN_MONO ) : void {
        AbsLogger.parser = parsing;
    }

    public static setPattern( pattern : String = AbsLogger.DEFAULT_LOG_PATTERN_MONO ) : void {
        AbsLogger.parser = pattern;
    }

    public static level( level : filterLogLevel<strLogLevel> = ["ALL"] ) : void {
        AbsLogger.logLevel = level;
    }

    public static popLevel( logType : strLogLevel = "ALL" ) : void{
        let tmp;
        if((tmp=AbsLogger.logLevel.indexOf(logType))>-1)AbsLogger.logLevel = AbsLogger.logLevel.slice(0,tmp).concat(AbsLogger.logLevel.slice(tmp+1,AbsLogger.logLevel.length));
    }

    public static pushLevel( logType : strLogLevel = "ALL" ): void{
        if(AbsLogger.logLevel.indexOf(logType)===-1)AbsLogger.logLevel.push(logType);
    }

    public static setLogFilePattern( pattern : String = AbsLogger.fileNamePattern ) : void {
        AbsLogger.fileNamePattern = pattern;
    }

    public static setFileMaxSize(bytes : number = null) : void {
        AbsLogger.fileMaxSize = bytes;
    }

    public static setLogFileReuse( path : String = null ) : void {
        AbsLogger.logfileReuse = path;
    }

    public static setPipeStdout( pipe : Pipe<string> = null ) : void {
        AbsLogger.pipeStdout = pipe;
    }

    public static setColorize( status : boolean = true ) : void {
        AbsLogger.colorize = status;
    }

    public static setCleanUpBeforeSave( state : boolean = AbsLogger.cleanUpBeforeSave ) : void {
        AbsLogger.cleanUpBeforeSave = state;
    }

    public static setLogRotate( rotate : string = null ) : void {
        let date : Date;
        if((date=Utils.getRotateTimestampOutOf(rotate))){
            AbsLogger.logRotate            = rotate;
            AbsLogger.rotateOutOfTimestamp = date;
            return void 0;
        }
        AbsLogger.rotateOutOfTimestamp = null;
    }

    protected static restartRotate( ) : void{
        AbsLogger.rotateOutOfTimestamp = Utils.getRotateTimestampOutOf(AbsLogger.logRotate);
    }
    /***
     *
     * @param color
     */
    protected static translateColorToInt( color : string = "black" ) : String {
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
     *
     */
    public static getLoggerFileName() : String {
        let d = new Date(),
            filename = AbsLogger.fileNamePattern;
        HashMap.of<string,ascii>({
            id : AbsLogger.oid,
            date : d.toLocaleDateString( ).replace(/\//g,"-"),
            ms: d.getMilliseconds(), HH:Utils.round(d.getHours()),
            mm: Utils.round(d.getMinutes()), ss: Utils.round(d.getSeconds()),
            rotate: "."+(String(AbsLogger.rotateOutOfTimestamp?.getTime())||"null"),
            reuse: AbsLogger.logfileReuse
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
    protected static colorizeString( message : string = null, type :string = null, colorize: boolean = AbsLogger.colorize ) : string {
        return message.regExp(AbsLogger.COLORS_REGEXP,function(){
            let define=null,interrupt=null, _t=type.substring(0,1).toLowerCase();

            if(!colorize) return this[1];
            if(this[1].equals("%type")||this[1].equals("%T")&&this[3]!==undefined){
                // try to define color
                this[2].regExp(/([lewidc]{1})\?([a-z]+)?\;*/,function(){
                    if(_t.equals(this[1]))define = AbsLogger.translateColorToInt(this[2]);
                });
                // default color
                if(define===null&&this[6]!==undefined)define=AbsLogger.translateColorToInt(this[6].replace(/^\:/,""));
                // return %parser without any color
                else if(define===null&&this[6]===undefined) interrupt=this[1];
            }
            return (interrupt || format("\x1b[%sm%s\x1b[0m",define||AbsLogger.translateColorToInt(this[2]),this[1]));
        });
    }
    /***
     * @param message
     * @param type
     * @param name
     * @param dat
     */
    protected static parseString( message : String = null, type : string = null, name : string = null, dat : Object = null ) : String {
        let list :  ArrayList<string>,tmp : any = {}, d = new Date(),
            h = Utils.round(d.getHours()), m = Utils.round(d.getMinutes()),
            s = Utils.round(d.getSeconds()), ss= d.getMilliseconds() ;

        try {
            // try to define the name of file in exception
            // and the line number and columns.
            let exception:string="IndexOfBoundException";
            list = (Error()).stack
                .replace(/\w+\:*\s*\n/, "")
                .explodeAsList(/\n|\r\n/)
                .stream()
                .filter(value => !(/Logger\.[\w]{2,}|node_modules/.test(value)))
                .findFirst()
                .orElse("nop (unknown:0:0)")
                .replace(/.+\(|\)/gi, "")
                .exec(/([^\\\/]*)$/)[1]
                .explodeAsList(":");
            tmp.fileInException = list.get(0)||exception;
            tmp.line            = list.get(1)||exception;
            tmp.column          = list.get(2)||exception;
        }catch (e) {/*void 0*/}

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
    protected static stdout( ) : void {
        let args     = Array.from(arguments),
            type     = args.shift().toUpperCase(),
            message  =  args.shift() || AbsLogger.parser,
            prop     = args.shift(), name = args.shift(),
            out : List<String> = new ArrayList<String>(),
            cleanArgv : Array<any> = [];

        if( AbsLogger.logLevel.indexOf(type.toUpperCase())>-1||AbsLogger.logLevel.indexOf("ALL")>-1) {

            // cast Object to String
            args.map(value=>(typeof value).equals("object")?JSON.stringify(value):value);
            // check if colorize pattern
            if(AbsLogger.COLORS_REGEXP.test(message)) {
                if(AbsLogger.cleanUpBeforeSave&&AbsLogger.saveLog) out.add(AbsLogger.colorizeString(message, type,false)); // cleanUp
                out.add(AbsLogger.colorizeString(message, type, AbsLogger.colorize));
            }else out.add(message);

            cleanArgv = args.map(value=>typeof value==="string"?value.colorize().cleanUp:value);
            out = out.stream()
              .map(value=>AbsLogger.parseString(value,type,name,prop))
              /***
               * replace message log here avoid
               * regexp fall in infinite loop
               */
              .map((value,key)=>value.replace(/\%error|\%message/gi,format.apply(null,key===0&&(!AbsLogger.colorize||AbsLogger.cleanUpBeforeSave&&AbsLogger.saveLog)?cleanArgv:args)))
              .getList();

          if(AbsLogger.saveLog){
               // logRotate
              if( AbsLogger.rotateOutOfTimestamp && (new Date()).getTime() > AbsLogger.rotateOutOfTimestamp.getTime() )AbsLogger.restartRotate();
               let filename = AbsLogger.getLoggerFileName();
               if(
                   AbsLogger.fileMaxSize===null || ( AbsLogger.fileMaxSize>=0 &&
                   Utils.getFileSize(AbsLogger.outputLog+`/${filename}.log`) <= AbsLogger.fileMaxSize )
               ){
                   try {Utils.writeLog(AbsLogger.outputLog, filename, out.get(0) )}
                   catch (e) {
                       console.warn(e);
                   }
               }
          }
            if(AbsLogger.logStdout) {
                message = out.get( out.size()>1? 1 : 0 );
                if(AbsLogger.pipeStdout!==null) AbsLogger.pipeStdout?.write.call(null,message); else {
                    readline.clearLine(process.stdout,0);
                    readline.cursorTo( process.stdout,0);
                    process.stdout.write(message+"\n");
                }
            }
        }
    }
}
/***
 * exportable usable Logger Object
 */
export class Logger extends AbsLogger{
    /***
     *
     * @param name
     */
    constructor( name : String = undefined ) {super(name);}
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
        this.patternList = ArrayList.of([Logger.STATS_MEMORY_PATTERN,Logger.CPU_USAGE_PATTERN,Logger.VERSION_USAGE_PATTERN] );
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

    public version( pattern : string = null ) : void{this.apply(2,pattern);}

    public static getInstance(){return Stats.INSTANCE;}
}