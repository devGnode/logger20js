"use strict";

import {mkdirSync, statSync, writeFileSync} from "fs";
import {format} from "util";

export class Utils{
    /***
     * @param value
     */
    public static round( value : any = null ){
        if(value!==null)return value.toString().length===1?"0"+value:value;
        return value;
    }
    /***
     * @param filename
     */
    public static getFileSize( filename : string = "" ){
        try{
            let stats = statSync(filename);
            return stats["size"];
        }catch (e) {
            return 0;
        }
    }
    /***
     *
     * @param outputLogDir
     * @param fileName
     * @param data
     * @return void
     */
    public static writeLog(outputLogDir: string = "" ,fileName : String = "",data : any = "") : void {
        outputLogDir += !outputLogDir.endsWith("/") ? "/" : "";
        if( !Utils.existsDir(outputLogDir) ){
            mkdirSync(outputLogDir,{recursive:true});
        }
        writeFileSync(outputLogDir+fileName+".log",data+"\r\n",{ encoding:"utf8", flag:"a"});
    }
    /***
     * @param directory
     * @return {boolean}
     */
    public static existsDir( directory : string = null ) : Boolean {
        try {
            statSync(directory);
            return true;
        } catch (e) {
            return false;
        }
    }
    public static merge( objA : Object = {}, ...args : Object[] ) : Object{
        try{
            let i:number=0,objB:Object;
            while((objB=args[i])) {
                for (let tmp in objB) if (!objA[tmp]) objA[tmp] = objB[tmp];
                i++;
            }
        }catch (e) {return objA;}
        return objA;
    }
    /***
     * @param timeStamp
     */
    public static parseTime( timeStamp : number = 0 ) : string {
        let h:number,m:number,s:number,ms:number;
        if(timeStamp<1000) return "0."+timeStamp;
        else{
            ms = timeStamp/1000;
            h  = Math.floor((ms)/3600);
            m = Math.floor((ms)/60)-(3600*h);
            s = Math.floor( ms %60);
            ms = Math.round(ms);
        }
        return  format(
            "%s%s%s%s",
            ( h>0?Utils.round(h)+":":""),
            m>0?Utils.round(m)+":":"",
            s>0?Utils.round(s)+".":"",
            String.repeatString("0",3-String(ms).length)+ms
        );
    }
    /***
     * @param rotate
     * @param date
     */
    public static getRotateTimestampOutOf( rotate : string = null, date : Date = null ) : Date{
        let tmp : any[],sec : number;
        if((tmp=/^((\d+)d?(\:)*)*((\d+)h?(\:)*)*((\d+)m)*$/.exec(rotate))){
            sec = parseInt(tmp[2]||0)*86400 + parseInt(tmp[5]||0)*3600 + parseInt(tmp[8]||0)*60;
            return new Date((date||new Date()).getTime()+(sec*1000));
        }
        return null;
    }
}