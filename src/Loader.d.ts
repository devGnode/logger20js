import "./Colorize";
export declare class Loader {
    private static isBusy;
    private logger;
    private timerHandle;
    private size;
    private maxSize;
    private static wheel;
    constructor(size?: number);
    private static repeat;
    start(endingMessage?: string): Loader;
    add(bytes?: number): void;
    end(message?: string): void;
    close(): void;
    static loaderIsBusy(): boolean;
}
