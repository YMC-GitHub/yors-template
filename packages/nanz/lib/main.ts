// export function setupCounter(element: HTMLButtonElement) {
//   let counter = 0;
//   const setCounter = (count: number) => {
//     counter = count;
//     element.innerHTML = `count is ${counter}`;
//   };
//   element.addEventListener("click", () => setCounter(++counter));
//   setCounter(0);
// }

// a library package to parse process.argv of node

// recommended-lib-name:node-argv-parse,nano-argv-parse

export type NanoPlainValue = string;
export type NanoParsedValue = boolean | number | undefined | null | string;

export type NanoArgvs = string[];
export type NanoExtras = string[];

// export type NanoFlags = Record<string, any>
export type NanoFlags = Record<string, NanoPlainValue>;
export type NanoParsedFlags = Record<string, NanoParsedValue>;

// export type NanoArgsMap = [string, any][]
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
export function nanoargs(input: string | string[]) {
  // 1.
  // feat(core): arrayify input to array when it is js-string
  const arredInput = arrayify(input);

  // 2. ini extras , args , argvs
  let extras: NanoExtras = [];
  let args: string[] = [];

  // 3. get extras and head
  // feat(core): support extras when '--' bind to ouput.extras
  ({ extras, args } = decodeArgv(arredInput));

  // 4. get args map and argvs from head of input
  const { argvs, argsMap } = decodeHead(args);

  // 5. get flags
  const flags = argsMapFlagify(argsMap);
  // console.log(flags)
  // 6. parse value in flags
  return {
    flags: getParsedFlags(flags),
    argv: argvs,
    extras: extras,
  };
}

// put nano util here.
function arrayify(input: string | string[]) {
  return Array.isArray(input) ? input : input.split(/ +/);
}
// eslint-disable-next-line
function isOneOfThem(one: any, them: any[]) {
  return them.includes(one);
}

// nano 's util,api,shared
/**
 *
 * @sample
 * ```ts
 * decodeArgv(process.argv)
 * decodeArgv(arrayify(`zero code`))
 * ```
 */
function decodeArgv(handledInput: string[]) {
  let head: string[] = handledInput;
  let extras: string[] = [];
  // feat(core): support extras when '--' bind to ouput.extras
  // 1. get the first index
  const theFirstIndex = handledInput.indexOf("--");

  // 2. get extras and head when index >= 0
  if (handledInput.includes("--")) {
    extras = handledInput.slice(theFirstIndex + 1);
    head = handledInput.slice(0, theFirstIndex);
  }
  return { extras, args: head };
}

/**
 *
 * @sample
 * ```
 * decodeHead(['code','--color=true']) //{argvs:['code'],argsMap:[['--color','true']]}
 * decodeHead(['code','--color']) //{argvs:['code'],argsMap:[['--color','true']]}
 * decodeHead(['code','--no-color']) //{argvs:['code'],argsMap:[['--no-color','true']]}
 * decodeHead(['code','-xyz']) //{argvs:['code'],argsMap:[['x','true'],['y','true'],['z','true']]}
 * ```
 */
function decodeHead(args: string[]) {
  // 4. get argv and args map from head
  const argvs: NanoArgvs = [];
  const argsMap: NanoArgsMap = [];
  /* eslint-disable no-plusplus */
  for (let i = 0; i < args.length; i++) {
    const previous = args[i - 1];
    const curr = args[i];
    const next = args[i + 1];

    // eg:ymc.rc.json
    const nextIsValue = next && !/^--.+/.test(next) && !/^-.+/.test(next);

    const pushWithNext = (x: string) => {
      //[string,boolean]
      //[string,string]
      // argsMap.push([x, nextIsValue ? next : true])
      argsMap.push([x, nextIsValue ? next : "true"]);
    };

    // case: key val exp. eg:--conf=ymc.rc.json -f=ymc.rc.json
    if (/^--.+=/.test(curr) || /^-.=/.test(curr)) {
      //string[]
      // argsMap.push(curr.split('='))
      const [key, value] = curr.split("=");
      argsMap.push([key, value]);
    } else if (/^-[^-].*/.test(curr)) {
      //case: key exp . eg: -xyz

      let current = curr;

      if (current.includes("=")) {
        const index = current.indexOf("=");
        argsMap.push([
          current.slice(index - 1, index),
          current.slice(index + 1, index + 2),
        ]);
        current = current.slice(0, index - 1) + current.slice(index + 2);
      }

      // Push all the flags but the last (ie x and y of -xyz) with true
      const xyz = current.slice(1).split("").slice(0, -1);
      // eslint-disable no-restricted-syntax
      for (const char of xyz) {
        //[string,true]
        argsMap.push([char, "true"]);
        // argsMap.push([char, true])
      }

      // If the next string is a value, push it with the last flag
      const final = current[current.length - 1];
      pushWithNext(final);
    } else if (/^--.+/.test(curr) || /^-.+/.test(curr)) {
      //case: key val exp . eg: -help true, --help true, -h true
      pushWithNext(curr);
    } else {
      let valueTaken = argsMap.find((arg) => arg[0] === previous);

      if (!valueTaken && /^-./.test(previous)) {
        const previousChar = previous[previous.length - 1];
        valueTaken = argsMap.find((arg) => arg[0] === previousChar);
      }
      //case: only key or  exp . eg: a b c
      if (!valueTaken) {
        argvs.push(curr);
      }
    }
  }
  return { argvs, argsMap };
}

/**
 *
 * @sample
 * ```ts
 * argsMapFlagify([['--name','zero']]) //{name:'zero'}
 * argsMapFlagify([['--color',true]]) // {color:true}
 * argsMapFlagify([['--no-color',true]]) // {color:false}
 * argsMapFlagify([['--no-color',undefined]]) // {color:false}
 * ```
 */
function argsMapFlagify(argsMap: NanoArgsMap) {
  // 1. init result as NanoFlags
  const result: NanoFlags = {};
  // 2. get flag for each item in map
  for (const item of argsMap) {
    // 2.1 get key of item and delete head - or -- of js-string key
    let key: string = item[0].replace(/^-{1,2}/g, "");
    // 2.2 get value of item
    let value = item[1]; //string|boolean|number|undefined
    // 2.3 set color to false  when '--no-color true' or '--no-color'
    if (
      key.startsWith("no-") &&
      isOneOfThem(value, [undefined, true, "", "true"])
    ) {
      key = key.slice(3);
      // value = false
      value = "false";
    }
    // 2.4 parse string value to number,boolean or string
    // result[key] = parseValue(value)
    result[key] = value;
  }
  return result;
}

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
// eslint-disable-next-line
export function parseValue(thing: any): NanoParsedValue {
  // eslint-disable-line
  // case:  exp for true. eg: true-string or true-boolean ( or other custom exp(todo))
  // if (isOneOfThem(thing, ['true', true])) {
  //     return true
  // }

  if (["true", true].includes(thing)) {
    return true;
  }

  // case:  exp for false.
  // if (isOneOfThem(thing, ['false', false])) {
  //     return true
  // }
  if (["false", false].includes(thing)) {
    return false;
  }

  // case:  exp for number.
  if (Number(thing)) {
    return Number(thing);
  }

  if (["null", null].includes(thing)) {
    return null;
  }

  if (["undefined", undefined].includes(thing)) {
    return undefined;
  }

  // case: other string
  return String(thing);
}

function getParsedFlags(flags: NanoFlags) {
  const res: NanoParsedFlags = {};
  Object.keys(flags).forEach((key) => (res[key] = parseValue(flags[key])));
  return res;
}
// function getParsedArgv(argvs: string[]) {
//     return argvs.map(value => parseValue(value))
// }
export { nanoargs as default };
