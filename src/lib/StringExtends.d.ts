declare global {
    interface String {
        equals(value: string): boolean;
        equalsToIgnoreCase(value: string): boolean;
        regExp(regExp: RegExp, callback: Function): string;
    }
}
export {};
