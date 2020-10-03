export declare class Utils {
    /***
     * @param value
     */
    static round(value?: any): any;
    /***
     * @param filename
     */
    static getFileSize(filename?: string): number;
    static regExp(regexp?: RegExp, value?: string, callback?: Function): string;
    /***
     *
     * @param outputLogDir
     * @param fileName
     * @param data
     * @return void
     */
    static writeLog(outputLogDir?: string, fileName?: String, data?: any): void;
    /***
     * @param directory
     * @return {boolean}
     */
    static existsDir(directory?: string): Boolean;
    static merge(objA?: Object, objB?: Object): Object;
    static repeat(value?: string, loop?: number): string;
    static parseTime(timeStamp?: number): string;
    static getRotateTimestampOutOf(rotate?: string, date?: Date): Date;
}
