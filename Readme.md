# logger20js-ts

<img src="https://img.shields.io/badge/Git version-1.2.4-yellowgreen"/> <img src="https://img.shields.io/github/languages/top/devGnode/logger20js"/> <img src="https://img.shields.io/badge/Javascript-ES2020-yellow"/> <img src="https://img.shields.io/npm/v/logger20js-ts"/> <img src="https://img.shields.io/node/v/logger20js-ts"/> <img src="https://img.shields.io/appveyor/build/devGnode/logger20js-ts"/> <img src="https://ci.appveyor.com/api/projects/status/github/devGnode/logger20js?svg=true&branch=develop"/>

Logger20js-ts is a little basic framework Logger for nodeJs or typescript project. It was written in typescript language.
 
### installation 

#### Import from npm repository package

``
$ npm i logger20js-ts
``

## Usage
### Log pattern

parser   | output value
:------------ | -------------    
type            |  Level type [LOG,ERROR,WARN,INFO,DEBUG,CUSTOM]
T               | Level type first character [L,E,W,I,D,C]
name            | Logger name
time            | TimeStamp 32 bits
hours           | format type &rarr; HH:mm:ss
HH              | hours number type
mm              | minutes number type
ss              | seconds number type
file            | file 
line            | line
column          | column number
pid         | process identification
ppid        | parent process identification
message         | log message

The default pattern look like to `%time\t%name\t: %type :\t%message` from `DEFAULT_LOG_PATTERN_MONO` property value.

It's possible to customize the output pattern as you want, like this example `[%HH:%mm:%ss] %T/%name - %error`. Possibility to define several same analyzers  `%hours - %message - %hours`.

Listed below some patterns example accessible from static Logger  :

static readonly property   | value | usage
:------------ | ------------- | -------------  
DEFAULT_LOG_PATTERN_MONO        |  %time\t%name\t: %type :\t%error | Logger
WEBDRIVER_LOG_PATTERN_COLORED   |   "\[%hours{cyan}\] %T{w?yellow}/%name - %error" | Logger
EXPRESS_MIDDLEWARE_PATTERN      |   "\[%hours{yellow}\] %name %protocol{red} - %method %url +%elapsedTime{yellow}" | Express logger middleware
STATS_MEMORY_PATTERN |\[%hours{cyan}\] %T{cyan}/%name{cyan} memory : heap( %heapUsed{yellow}, %heapTotal{yellow} ) : rss( %rss{yellow} ) : external( %external{yellow} ) | Logger stats
 CPU_USAGE_PATTERN  | \[%hours{cyan}\] user CPUTime( %userCPUTime{yellow} ) system CPUTime( %systemCPUTime{yellow} ) maxRss( %maxRSS{yellow} ) 

It possible to colorize the output parser like this : `[%hours{blue}] - %type{yellow} - %error`, and below there is the list of accepted colors :

- black
- red
- green
- yellow
- blue
- magenta
- cyan
- white
- grey
- gray

Background color : add `b` like &rarr; `bwhite`
 
:warning: Just one exception only for `%T` and `%type` parser it possible to customize the output color by type of log level [L,E,W,I,D,C] :

- `%T{w?yellow;e?red}` or `%type{w?yellow;e?red}`

You can define a default color for others log level with `:colorName` annotation

- `%T{w?yellow;e?red:green}` 

Another example : `%T{e?red;w?yellow;d?blue;l?blue:black}`. The types 'error' will be displayed in red color, 'warning' in yellow and 'debug' and 'log' in blue color and others log level will be displayed in black color into the console.

Since the version `1.1.7` . If you define color in your pattern and you have enabled record in a log file by default the message will be clean up for have readable string. But you can disabled this option just define cleanUpBeforeSave property at false  with `Logger.setCleanUpBeforeSave`. you could not modify this property from your own configuration object.

Since the version `1.2.0` you can customize the color before call the log method :

```javascript
import {Logger} from "./Logger";

let myLogger = Logger.factory("test");

myLogger.log( "messageInRed".colorize().red, "messageInBlue".colorize().blue );

let tmp : String = "my foo bar";

console.log( tmp.colorize().yellow );

```

## Example of basic implementation :

```javascript
const {Logger}     = require("logger20js-ts");


class MyClass{
    
    static LOG = Logger.factory(MyClass.name);

    func(){
        MyClass.LOG.log("one example with args %s - %s ", "foo",123); 
    }

}
```

output :

````text
1598042191366   MyClass : LOG : one example with args foo - 123
````

```typescript
import {Logger}  from "logger20js-ts";
Logger.setPattern("[%HH:%mm:%ss] %T/%name - %error");

class MyClass{
    
    public static LOG = Logger.factory(MyClass.name);

    public func(){
        MyClass.LOG.log("one example with args %s - %s ", "foo",123);
        MyClass.LOG.warn("second example with args %s - %s ", "foo",123);
    }    

}
```

output :

````text
[22:33:40] L/MyClass - one example with args foo - 123
[22:33:40] W/MyClass - second example with args foo - 123
````

### Log level

- ALL ***default***
- INFO
- LOG
- DEBUG
- WARN
- ERROR
- CUSTOM 

You can customize your Stdout logging level from the static Logger access with `Logger.level( ... )` or from your own properties class, but make sur you have define` logLevel` property.

```javascript
Logger.level(["INFO","WARN"]);
````

Only INFO and WARN log will be displayed to the console or recorded.

for remove or add just one log level type using : `Logger.popLevel("ALL")` or `Logger.pushLevel("ALL")`

### Active log recorder

By default this property is at : `true`

```javascript
Logger.setSaveLog( true );
````

### Define a log file directory

```javascript
Logger.setOutputLog(process.cwd()+"/logs");
````

### log filename

parser   | output value   
------------ | -------------    
id           |  uuid hash
date         | LocalDate format : YYYY-dd-mm
HH          | hours number type
mm          | minutes number type
ss          | seconds number type
rotate      | overflow timestamp 32 bits

- fileNamePattern default : `%date-%id`

```javascript
Logger.setLogFilePattern("environment-%date-%id");
````

### Log rotate

- default : `disabled`

If you want enabled log rotate, define in your pattern filename use `%rotate` parser.
`%rotate` value is an overflow timestamp 32 bits. By default log rotate is disabled.

Some rotate example :

+ 5d &rarr; 5 days
+ 1h &rarr; 1 hour
+ 5m &rarr; 5 min
+ 5d:10m &rarr; 5 days 10 minutes  
+ 5d:8h:1m &rarr; 5 days 8 hours & one minute

```javascript
Logger.setLogFilePattern("%id%rotate");
Logger.setLogRotate("1d"); // new log file every day
````

### static access

#### static constructor 

- factory( name : ***String***  ) : Logger

#### Configuration

- setPattern( parser : ***String*** ) : void
- setOutputLog( path : ***string*** ) : void
- setSaveLog( saveInFile : ***boolean*** ) : void
- setLogStdout( stout : ***boolean*** ) : void
- level( level : ***Array*** ) : void
- popLevel( logType : ***strLogLevel***  ) : void
- pushLevel( logType : ****strLogLevel*** ) : void
- setLogFilePattern( pattern : ***String*** ) : void
- setFileMaxSize( bytes : ***Number*** ) : void
- setColorize( status : ***boolean*** ) : void
- setCleanUpBeforeSave( status : ***boolean*** ) : void *( default true )*

For see the default configuration value go to section `set your owns properties from class`

#### create redirect stdout message parsed

- setPipeStdout( pipe : ***Object*** ) : void

The object passed in parameters must contain the `write` method.

```javascript
    Logger.setPipeStdout({
        write( msg ){
            console.log(msg);
        }   
    });
```
    
#### set your owns properties from class

you can override the properties configuration for your logger.

- setPropertiesConfigHandle( handle : ***any*** ) : void

properties keys accepted :

- loggerParser : ***String*** default `%time\t%name\t: %type :\t%error`
- loggerOutputDir  : ***string*** default ` `
- saveLog : ***boolean***  default `false`
- logStdout : ***boolean*** default `true`
- logLevel : ***String[]***  default `["ALL"]`
- logFileNamePattern : ***String*** default `%date-%id`
- logFileMaxSize  : ***number*** default `null`
- logEnabledColorize : ***boolean*** default `true`

These properties by default are given by the Logger define `getProperty` method in your properties class like below : 

- prototypeOf : getProperty( key : ***String*** = "", defaultValue : ***String*** ) : any

example :

```typescript
import {Logger} from "logger20js-ts"; 
import {ascii, MapType} from "lib-utils-ts/src/Interface";

class PropertiesConfig{
    
    private conf : MapType<string,ascii> = null;

    constructor(){
        // load conf.json    
    }

    getProperty( key , defaultValue ) : ascii{
        if( /*...*/ ){
            // ....
        }
        return defaultValue;
    }   

}
   
let properties = new PropertiesConfig();

Logger.setPropertiesConfigHandle(properties);

```

### example output

```
1581273071079	EdgeDriver	: DEBUG :	webDriver has ben launched pid = 24460
1581273071098	EdgeDriver	: LOG :	webDriver session id = d0a82e65f565878005ead66fc288a9f0
1581273074148	EdgeDriver	: LOG :	webDriver go to = https://google.com
1581273075997	EdgeDriver	: LOG :	webDriver go to = https://google.com/search?q=mdr
```

## Express Middleware Logger `>= 1.2.0`

parser   | output value   
------------ | -------------    
protocol           |  http or https
host        | Req hostanme
method      | Http query method
url         | Url Endpoint
remoteAddr  | Client ip
originalUrl | express req.originalUrl
elapsedTime | time gap between two query

```javascript
const app = express();

app.use(Logger.expressRouteLoggerMiddleware());

````
- expressRouteLoggerMiddleware( \[ void , pattern : string = null \] ) : Callback

For define the pattern for express middleware it's the same way that you define the pattern for the Logger just you can add these properties for him.

## Loader `>= 1.2.0`

```javascript

let loader : Loader = Logger.getLoader(30).start("Ending message");

setInterval(()=>{  
    loader.add(1);
},1000);

````

- end() : ***void***

## Stats `>= 1.2.3`

parser   | output value   
------------ | -------------   
pid         | process identification
ppid        | parent process identification
heapUsed    | heap memory used
heapTotal   | total heap memory
rss         | memory rss value
external    | external memory

+ pattern default : `STATS_MEMORY_PATTERN`
+ memory( patter : string ) : void

````typescript
import {Logger} from 'logger20js-ts';

Logger.stats().memory();
````

+ `userCPUTime`
+ `systemCPUTime`
+ `maxRSS`
+ `sharedMemorySize`
+ `unsharedDataSize`
+ `unsharedStackSize`
+ `minorPageFault`
+ `majorPageFault`
+ `swappedOut`
+ `fsRead`
+ `fsWrite`
+ `ipcSent`
+ `ipcReceived`
+ `signalsCount`
+ `voluntaryContextSwitches`
+ `involuntaryContextSwitches`

+ pattern default : ` CPU_USAGE_PATTERN `
+ cpu( patter : string ) : void

````typescript
import {Logger} from 'logger20js-ts';

Logger.stats().cpu();
````

## Features & stable version

- 1.1.2
    - initial commit
- 1.1.7
    - 2020-02-10 :
        - Fix - removing of the Stream.js file, this extension creates conflicts with many other node js libraries like, Protractor, Selenium, resulting in an exception of the native Stream object.
        - Integration of background color in cli  
        - Fix/Add - cleaning message before to save in a log file
- 1.2.0 
    - 2020-06-10 :
        - Add Express middleware route logger
        - Implementation - log rotate
        - Stabilization of the colors functionality
        - Implementation of a basic loader feature / \[=====>.... \] 00%
- 1.2.2 
    -  :
        - Fix Monochrome pattern.
- 1.2.3
    - 2020-10 
       - Add new parser for global logger : pid, ppid, heapUsed, heapTotal, rss, external
       - Add Stats Log : memory, cpu, version

## From git

``
$ git clone https://github.com/devGnode/logger20js.git
``
