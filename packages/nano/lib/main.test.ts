// recomended vscode ext: vitest.explorer
// you can run 'pnpm run test' to test
// you can click test label to test when vitest.explorer installing

import { nanoargs } from "./main";
// import { jest } from '@jest/globals'
// //
// // npm i --save-dev @types/jest
// // pnpm add -D  @types/jest
// test('adds 1 + 2 to equal 3', () => {
//   nanoargs(`ns cmd -a -b -c -- -a -b -c`)
//   expect(sum(1, 2)).toBe(3);
// });

// - test(core): the base test env
// function sum(a, b) {
//   return a + b;
// }

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });

// console.log(nanoargs(`ns cmd -a -b -c -- -a -b -c`))
test("nano argv parse", () => {
  const cmdstylestr = `ns cmd -a -b -c -- -a -b -c`;
  const parsed = nanoargs(cmdstylestr);
  expect(parsed.flags.a).toBe(true);
  expect(parsed.flags.b).toBe(true);
  expect(parsed.flags.b).toBe(true);

  "a,b,c".split(",").forEach((name) => {
    expect(parsed.flags[name]).toBe(true);
  });

  expect(parsed.argv).toContain("ns");
  expect(parsed.argv).toContain("cmd");
  expect(parsed.argv.join(" ")).toBe(["ns", "cmd"].join(" "));

  expect(parsed.extras.join(" ")).toBe(`-a -b -c`);
});
