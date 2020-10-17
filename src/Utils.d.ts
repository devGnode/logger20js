/***
 * Static lib utils class :
 *
 * Do not use outside of this project these
 * properties can be often move or removing.
 */
export declare class Utils {
    /***
     * @param value
     */
    static round(value?: any): any;
    /***
     * @param filename
     */
    static getFileSize(filename?: string): number;
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
    static merge(objA?: Object, ...args: Object[]): Object;
    /***
     * @param timeStamp
     */
    static parseTime(timeStamp?: number): string;
    /***
     * @param rotate
     * @param date
     */
    static getRotateTimestampOutOf(rotate?: string, date?: Date): Date;
}
