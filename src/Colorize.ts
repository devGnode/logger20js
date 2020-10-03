import {format} from "util";

export class Colorize{

    private readonly value :string = null;

    constructor(value : string = null ) { this.value = value;}

    private parse( color : number = 30 ) : string{
        return String(format("\x1b[%sm%s\x1b[0m",color, this.value));
    }

    public get black( ){return this.parse(30);}
    public get red( ){return this.parse(31);}
    public get green( ){return this.parse(32);}
    public get yellow( ){return this.parse(33);}
    public get blue( ){return this.parse(34);}
    public get magenta( ){return this.parse(35);}
    public get cyan( ){return this.parse(36);}
    public get white( ){return this.parse(37);}
    public get gray( ){return this.parse(38);}
    public get grey( ){return this.parse(39);}
    public get fBlack( ){return this.parse(40);}
    public get fRed( ){return this.parse(41);}
    public get fGreen( ){return this.parse(42);}
    public get fYellow( ){return this.parse(43);}
    public get fBlue( ){return this.parse(44);}
    public get fMagenta( ){return this.parse(45);}
    public get fCyan( ){return this.parse(46);}
    public get fWhite( ){return this.parse(47);}
    public get fGray( ){return this.parse(48);}
    public get fGrey( ){return this.parse(49);}
}
/***
 * Extended string native Object
 */
String.prototype.colorize = function(){
    return new Colorize(this.toString());
};