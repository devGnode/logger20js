# logger20js-ts

<img src="https://img.shields.io/badge/Git version-1.1.2-yellowgreen"/> <img src="https://img.shields.io/github/languages/top/devGnode/logger20js"/> <img src="https://img.shields.io/badge/Javascript-ES2020-yellow"/> <img src="https://img.shields.io/npm/v/logger20js-ts"/> <img src="https://img.shields.io/node/v/logger20js-ts"/> <img src="https://img.shields.io/appveyor/build/devGnode/logger20js-ts"/> <img src="https://ci.appveyor.com/api/projects/status/github/devGnode/logger20js?svg=true&branch=develop"/>

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
type        |  Level type [LOG,ERROR,WARN,INFO,DEBUG,CUSTOM]
T           | Level type first character [L,E,W,I,D,C]
name        | Logger name
time        | TimeStamp 32 bits
hours       | format type &rarr; HH:mm:ss
HH          | hours number type
mm          | minutes number type
ss          | seconds number type
error  message      | log message
message     | log message

The default pattern look like to `%time\\t%name\\t: %type :\\t%error`.
But you can customize the pattern like this `[%HH:%mm:%ss] %T/%name - %error`, and you can define multiple parser in your pattern string  `%hours - %error - %hours` 

static property   | value
:------------ | -------------  
DEFAULT_LOG_PATTERN_MONO        |  %time\t%name\t: %type :\t%error |
WEBDRIVER_LOG_PATTERN_COLORED   |   "[%hours{cyan}] %T{w?yellow}/%name - %error" |

It possible to colorize the output parser like this : `[%hours{blue}] - %type{yellow} - %error`, and below there is the list of accepted colors :

- black
- red
- green
- yellow
- blue
- magenta
- cyan
- white

:warning: Just one exception only for `%T` and `%type` parser it possible to customize the output color by type of log level [L,E,W,I,D,C] :

- `%T{w?yellow;e?red}` or `%type{w?yellow;e?red}`

You can define a default color for others logger with `:colorName` annotation

- `%T{w?yellow;e?red:green}` 

Another example : `%T{e?red;w?yellow;d?blue;l?blue:black}`. The types 'error' will be displayed in red color, 'warning' in yellow and 'debug' and 'log' in blue color and others log level will be displayed in black color into the console.

Example of implementation :

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

```javascript
const {Logger}  = require("logger20js-ts");
Logger.setParser("[%HH:%mm:%ss] %T/%name - %error");

class MyClass{
    
    static LOG = Logger.factory(MyClass.name);

    func(){
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

### Set path to the log file

```javascript
Logger.setSaveLog(true);
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
reuse        | allow reuse of an existing log file

- fileNamePattern : default `%date-%id`

```javascript
Logger.setLogFilePattern("environment-%date-%id");
````

If you want use the `reuse` pattern in your logger filename, make sure you have defined the reuse filename `Logger.setLogFileReuse` without define the extension `.log` in the filename.

### static access

#### static constructor 

- factory( name : ***String***  ) : Logger

#### Configuration

- setParser( parser : ***String*** ) : void 
- setOutputLog( path : ***string*** ) : void
- setSaveLog( saveInFile : ***boolean*** ) : void
- setLogStdout( stout : ***boolean*** ) : void
- level( level : ***Array*** ) : void
- setLogFilePattern( pattern : ***String*** ) : void
- setFileMaxSize( bytes : ***Number*** ) : void
- setLogFilePattern( path : ***String*** ) : void
- setLogFileReuse( fileName : ***string*** ) : void
- setColorize( status : ***boolean*** ) : void

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
- logPrefixFileName : ***String*** default `null`
- logFileNamePattern : ***String*** default `%date-%id`
- logFileMaxSize  : ***number*** default `null`
- logFileReusePath : ***string*** default `null`
- logEnabledColorize : ***boolean*** default `true`

These properties by default are given by the Logger define `getProperty` method in your properties class like below : 

- prototypeOf : getProperty( key : ***String*** = "", defaultValue : ***String*** ) : any

example :

```javascript
const {Logger}     = require("logger20js-ts");

class PropertiesConfig{
    
    #conf = null;

    constructor(){
    // load conf.json    
    }

    getProperty( key , defaultValue ){
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
## Feature

 - 2020-02-10 :
    - Fix - Fix - removing of Stream.js file, this extended create conflicts with much another node js library as, Protractor, Selenium. Error of native Stream object.
    - Background color
 

### From git

``
$ git clone https://github.com/devGnode/logger20js.git
``