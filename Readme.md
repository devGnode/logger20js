# seleniumJs

<img src="https://img.shields.io/badge/Git version-1.0.0-yellowgreen"/> <img src="https://img.shields.io/github/languages/top/devGnode/SeleniumJs"/> <img src="https://img.shields.io/badge/Javascript-ES2020-yellow"/> <img src="https://img.shields.io/npm/v/logger20js-ts"/> <img src="https://img.shields.io/node/v/logger20js-ts"/>

Little basic framework Logger for nodeJs or typescript project.

This framework has been written in typescript.
 
### installation 

#### Import from npm repository package

``
$ npm i logger20js-ts
``

### Parser


parser   | utility   
------------ | -------------    
type        |  Level type [ALL,LOG,ERROR,WARN,INFO,DEBUG,CUSTOM]
T           | Level type first character [A,L,E,W,I,D,C]
name        | Logger name
time        | TimeStamp 32 bits
hours       | format type &rarr; HH:mm:ss
HH          | hours number type
mm          | minutes number type
ss          | seconds number type

default parser look like to `%time	%name	 : %type :	%error`.
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

}
```

output :

````text
1598042191366   MyClass : LOG : one example with args foo - 123
````

```javascript
const {Logger}     = require("logger20js-ts");
Logger.setParser("[%HH:%mm:%ss] %T/%name - %error");


class MyClass{
    
    static LOG = Logger.factory(MyClass.name);

    func(){
        MyClass.LOG.log("one example with args %s - %s ", "foo",123);
        MyClass.LOG.warn("second example with args %s - %s ", "foo",123);
    }    
}

}
```

````text
[22:33:40] L/MyClass - one example with args foo - 123
[22:33:40] W/MyClass - second example with args foo - 123
````

### static access

#### static constructor 

- factory( name : ***String***  ) : Logger

#### Configuration

- setParser( parser : ***String*** ) : void
- setOutputLog( path : ***string*** ) : void
- setSaveLog( saveInFile : ***boolean*** ) : void
- setLogStdout( stout : ***boolean*** ) : void
- level( level : ***Array*** ) : void

#### create redirect stdout message parsed

- setPipeStdout( pipe : ***Object*** ) : void

```javascript
    Logger.setPipeStdout({
        write( msg ){
            console.log(msg);
        }   
    });
```
    
#### set owns properties from class

you can override the properties configuration for your logger.

- setPropertiesConfigHandle( handle : ***any*** ) : void

properties keys accepted :

- loggerParser : ***String*** 
- loggerOutputDir  : ***string***
- saveLog : ***boolean*** 
- logStdout : ***boolean***
- logLevel : ***String[]*** 
            
```javascript
const {Logger}     = require("logger20js-ts");

class PropertiesConfig{
    
    getProperty( key , defaultValue ){
        if( ... ){
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