export declare class Utils {
    static round(value?: any): any;
    /***
     *
     * @param outputLogDir
     * @param fileName
     * @param data
     * @return void
     */
    static writeLog(outputLogDir?: string, fileName?: string, data?: any): void;
    /***
     * @param directory
     * @return {boolean}
     */
    static existsDir(directory?: string): Boolean;
}
