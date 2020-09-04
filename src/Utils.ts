"use strict";

import {mkdirSync, statSync, writeFileSync} from "fs";

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

    public static regExp( regexp : RegExp = /.+/, value : string = "", callback : Function = undefined ){
        if(typeof value !=="string") return value;
        try{
            let tmp,toReplace;
            while(( tmp = regexp.exec(value) )){
                toReplace = callback !==undefined ? callback.call(tmp,value) : "";
                value = value.replace(tmp[0], toReplace);
            }
        }catch (e) {
            return value;
        }
        return value;
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
    public static existsDir( directory : string = "" ) : Boolean {
        try {
            statSync(directory);
            return true;
        } catch (e) {
            return false;
        }
    }

}