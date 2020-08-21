/*
 Arrays.Stream
 @name: 	stream.js
 @Date: 	12/07/2019
 @version:	1.0.0
 @author:	Maroder
 @usage:	Arrays stream extends Object an Array type.
*/
"use strict";

// Exception
class StreamException extends Error{

    constructor(message){
        super();
    }

    getMessage(){
        return "[-] "+super.getMessage();
    }
}

function Stream(array){
    return new Stream.out(array);
}
Stream.PARSE_INT 	= 1;
Stream.PARSE_FLOAT 	= 2;

Stream.out = function(slf) {

    if (typeof slf === "number") {
        slf = String(slf).valueOf();
    }
    if (typeof slf == "string") {
        slf = slf.valueOf().split("");
    }

    this.object = slf;
    this.limitValue = -1;

    if (typeof slf != "object")
        throw new StreamException("Bad cast Object to " + (typeof slf));

};

Stream.parseNumber = function(element,parse){
    if( typeof element !== "number" )
        switch(parse){
            case Stream.PARSE_FLOAT: element= parseFloat(element); break;
            case Stream.PARSE_INT:
            default:
                element=parseInt(element);
        };

    return element;
};
// toReview
Stream.out.prototype.each = function(callback){
    var self = this,tmp;

    if(this.object.length!==undefined)
        this.object.map(
            (value,key)=>callback.call(self,value,key)
        );
    else if( typeof this.object === "object" ){

        for( tmp in this.object )
            if(typeof this.object[tmp] !== "function")
                callback.call(
                    self,this.object[tmp],tmp
                );

    }
    return this.object;
};

Stream.out.prototype.map = function(callback){
    var returned = [];

    this.each((element,key)=>{
        returned.push(
            callback.call(
                this,element,key
            )
        );
    });
    return Stream( returned ).get();
};
/***
 @return Stream finder object
 */
Stream.out.prototype.filter = function(promise){
    let self = this,
        returned = [],
        tmp;

    if(this.object.length!==undefined&&typeof this.object.forEach === 'function')
        this.object.forEach(
            (val,key)=>{
                var state = promise.apply(null,[val,key]);
                if((state && this.limitValue===-1)||(state && this.limitValue>-1 && returned.length<this.limitValue))
                    returned.push(val);

            });
    else if(this.object.length!==undefined&&typeof this.object.forEach !== 'function'){
        // ??
    }else if( typeof this.object === "object" ){
        let state;

        for( tmp in this.object ){
            state=promise.call(self,this.object[tmp],tmp);
            if((state && this.limitValue===-1)||(state && this.limitValue>-1 && returned.length<this.limitValue))
                returned.push(this.object[tmp]);
        }
    }
    return Stream( returned );
};
/***
 @return boolean
 */
Stream.out.prototype.allMatch = function(promise){
    return this.filter((element,key)=>promise.call(this,element,key)).count()===this.count();
};
/***
 @return boolean
 */
Stream.out.prototype.anyMatch = function(promise){
    return this.filter((element,key)=>promise.call(this,element,key)).count()>0;
};

/***
 @return boolean
 */
Stream.out.prototype.noneMatch = function(promise){
    return !this.allMatch(promise);
};

/***
 @return int
 */
Stream.out.prototype.count = function(){
    return  this.object.length !== undefined ?
        this.object.length :
        ((value)=>{
            let tmp;
            for( tmp in this.object ) value.length++;
            return value;
        })({length:0}).length;
};
/***
 @return Stream
 */
Stream.out.prototype.limit = function(value){
    this.limitValue = value;
    return this;
};
/***
 @return Object
 */
Stream.out.prototype.get = function(){
    return this.object;
};

/***
 @return Integer
 */
Stream.out.prototype.min = function(parse){
    var min = Number.MAX_VALUE;
    this.each(element=>{
        element =Stream.parseNumber(element,parse);
        if( !isNaN(element) && typeof element === "number" )
            min=element<min?element:min;;

    });
    return min;
};
/***
 @return Interger
 */
Stream.out.prototype.max = function(parse){
    var max = Number.MIN_VALUE;
    this.each(element=>{
        element = Stream.parseNumber(element,parse);
        if( !isNaN(element) && typeof element === "number" ) max=element>max?element:max;
    });
    return max;
};
/***
 @return Boolean
 */
Stream.out.prototype.hasPeer = function(){
    return this.anyMatch(element=> Stream.parseNumber(element,Stream.PARSE_INT)%2===0 );
};
/***
 @return Stream
 @Deprecated
 @Bug
 */
Stream.out.prototype.sorted = function(comparator){
    var slf=this;

    if(!comparator) throw new StreamException("Missing argument");
    this.each(function(valueA,keyA){

        // asc
        Stream.of(slf.object).each((valueB,keyB)=>{
            var tmp;
            if( !comparator.call(null,valueA,valueB) ){
                tmp = slf.object[keyA];
                slf.object[keyA] = slf.object[keyB];
                slf.object[keyB] = tmp;
            }
        });
    });
    return this;
};

/***
 @return Stream
 */
Stream.of = Stream.out.prototype.of = function(object){
    return new Stream(object);
};

// disabled this extend
//extends Stream to oject & Array prototype
Object.prototype.stream = Array.prototype.stream = function(){
    return Stream(this);
};

/***
 *
 * @exports
 */
exports.Stream = Stream;