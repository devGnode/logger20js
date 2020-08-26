import {Utils} from "../Utils";

declare global {
    interface String {
        equals( value : string  ) : boolean
        equalsToIgnoreCase( value : string ) : boolean
        regExp( regExp : RegExp, callback : Function ) : string
    }
}

// @ts-ignore
String.prototype.equals = function(value : string = "") : boolean {
    return this.toString()===value;
};
// @ts-ignore
String.prototype.equalsToIgnoreCase = function ( value : string = "") : boolean {
    return this.toString().toLowerCase()===value.toLowerCase();
};
// @ts-ignore
String.prototype.regExp = function ( regExp : RegExp = /.+/, callback : Function = null ) : string{
    return Utils.regExp(regExp,this.toString(),callback);
};
