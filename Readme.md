# logger20js-ts

<img src="https://img.shields.io/badge/Git version-1.0.10-yellowgreen"/> <img src="https://img.shields.io/github/languages/top/devGnode/SeleniumJs"/> <img src="https://img.shields.io/badge/Javascript-ES2020-yellow"/> <img src="https://img.shields.io/npm/v/logger20js-ts"/> <img src="https://img.shields.io/node/v/logger20js-ts"/>

Little basic framework Logger for nodeJs or typescript project.

This framework has been written in typescript.
 
### installation 

#### Import from npm repository package

``
$ npm i logger20js-ts
``

## Usage
### Pattern

parser   | output value
------------ | -------------    
type        |  Level type [LOG,ERROR,WARN,INFO,DEBUG,CUSTOM]
T           | Level type first character [L,E,W,I,D,C]
name        | Logger name
time        | TimeStamp 32 bits
hours       | format type &rarr; HH:mm:ss
HH          | hours number type
mm          | minutes number type
ss          | seconds number type
error       | log message

default pattern look like to `%time	%name	 : %type :	%error`.
Another pattern `[%HH:%mm:%ss] %T/%name - %error`.
  
Example :

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

You can customize your Stdout logging level with the Logger with `Logger.level` or from your own class properties with the` log Level` property.

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

parser   | utility   
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

if you want use the `reuse` pattern in your logger filename, you make sure you have defined the reuse filename path `Logger.set Log File Reuse` without define the extension `.log` of the filename.

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
            
```javascript
const {Logger}     = require("logger20js-ts");

class PropertiesConfig{
    
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

### From git

``
$ git clone https://github.com/devGnode/logger20js.git
``