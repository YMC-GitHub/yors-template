export type NanoPlainValue = string;
export type NanoParsedValue = boolean | number | undefined | null | string;
export type NanoArgvs = string[];
export type NanoExtras = string[];
export type NanoFlags = Record<string, NanoPlainValue>;
export type NanoParsedFlags = Record<string, NanoParsedValue>;
export type NanoArgsMap = [string, NanoPlainValue][];
export type NanoParsedArgsMap = [string, NanoParsedValue][];
export interface Nano {
    flags: NanoParsedFlags;
    argv: NanoArgvs;
    extras: NanoExtras;
}
/**
 * parse cli cmd string
 * @sample
 * ```ts
 * nanoargs(process.argv)
 * nanoargs(`ns cmd -a -b -c -- -a -b -c`)
 * nanoargs(`ns subns cmd -a -b -c -- -a -b -c`)
 * nanoargs(`ns subns subcmd -a -b -c -- -a -b -c`)
 *
 * ```
 */
export declare function nanoargs(input: string | string[]): {
    flags: NanoParsedFlags;
    argv: NanoArgvs;
    extras: NanoExtras;
};
/**
 * parse cli input to node.js boolean,number,null,undefined,string
 * @sample
 * ```ts
 * parseValue('true') // true
 * parseValue('false') // false
 * parseValue('1') // 1
 * parseValue('null') // null
 * parseValue('undefined') // undefined
 * parseValue('zero') // 'zero'
 * ```
 */
export declare function parseValue(thing: any): NanoParsedValue;
export { nanoargs as default };
