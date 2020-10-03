import {Logger} from "./Logger";

export type filterLogLevel<T> = String[] | [ ... T[] ]
export type strLogLevel = "ALL" |"LOG" | "DEBUG" | "ERROR" | "INFO" | "CUSTOM"

export interface Loggable{
    warn( ... args : any[] ) :void
    log( ... args : any[] ) : void
    info( ... args : any[] ) : void
    debug( ... args : any[] ) :void
    error( ... args : any[] ) :void
    custom( ... args : any[] ) :void
    setPattern( pattern : String ) : Logger
}