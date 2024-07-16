// recomended vscode ext: vitest.explorer
// you can run 'pnpm run test' to test
// you can click test label to test when vitest.explorer installing

// import { jest } from '@jest/globals'
// //
// // npm i --save-dev @types/jest
// // pnpm add -D  @types/jest
// test('adds 1 + 2 to equal 3', () => {
//   nanoargs(`ns cmd -a -b -c -- -a -b -c`)
//   expect(sum(1, 2)).toBe(3);
// });
import { fileURLToPath } from "url";

function likelash(s: string) {
  return s.replace(/\\/gi, "/").replace(/\/{2,}/, "/");
}
function getPkgInRootWorkspaceFromTestFile(
  s: string,
  ss: number = -4,
  ee: number = -2
) {
  return s.split(/\//).slice(ss, ee).join("/");
}

const file = likelash(fileURLToPath(import.meta.url));
const name = getPkgInRootWorkspaceFromTestFile(file);

// console.log(name);
// - test(core): the base test env
function sum(a: number, b: number) {
  return a + b;
}

test(`${name}:todo: add test`, () => {
  expect(sum(1, 2)).toBe(3);
});
