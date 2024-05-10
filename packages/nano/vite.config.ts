import path from "node:path";
import { builtinModules } from "node:module";
import { defineConfig } from "vite";
import type { LibraryFormats } from "vite";
import minijsindist from "@yors/vite-plugin-mini-js";
import { viteplugify as maketypetodist } from "@yors/vite-plugin-make-type";
import {
  makeBannerText,
  stdUmdName,
  burnFuncToMakeFilename,
} from "@yors/vite-plugin-util-nano";

import * as url from "url";

/**
 *
 * @sample
 * ```
 * thisfile(import.meta.url)
 * ```
 */
export function thisfile(l: string = "") {
  const __filename = url.fileURLToPath(l ? l : import.meta.url);
  const __dirname = url.fileURLToPath(new URL(".", l ? l : import.meta.url));
  return { __filename, __dirname };
}

/**
 *
 * @sample
 * ```
 *  if ismain(import.meta.url,1) main()
 * ```
 */
export function ismain(l: string = "", index: number = 0) {
  return thisfile(l).__filename == process.argv[index];
}

let { __dirname } = thisfile(import.meta.url);

import pkg from "./package.json";
const isDevEnv = process.argv.slice(2).includes("--watch");
const jsfileOutDir: string = "dist";
const tsTypeOutDir: string = "types";
const jsfileSrcDir = "src";
const jslibformats: LibraryFormats[] = ["cjs", "es", "umd"];
let typeoption = {
  jsfileOutDir,
  tsTypeOutDir,
  jsfileSrcDir,
  root: path.join(__dirname),
};

let bannerText = makeBannerText(pkg);
let plugins = [
  maketypetodist(typeoption),
  minijsindist({ banner: bannerText }),
];
export default defineConfig({
  build: {
    minify: false,
    outDir: jsfileOutDir,
    emptyOutDir: !isDevEnv,
    // target: 'node14',
    lib: {
      entry: [jsfileSrcDir, "main.ts"].join("/"),
      name: stdUmdName(pkg.name, false),
      formats: jslibformats,
      // fileName: format => format === 'es' ? '[name].mjs' : '[name].js',
      fileName: burnFuncToMakeFilename("6"),
    },
    rollupOptions: {
      external: [
        "vite",
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
        ...Object.keys(
          "dependencies" in pkg ? (pkg.dependencies as object) : {}
        ),
      ],
      output: {
        exports: "named",
      },
    },
  },
  plugins: plugins.filter((v) => v),
});
