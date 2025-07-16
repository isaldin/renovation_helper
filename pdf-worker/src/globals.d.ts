/// <reference types="node" />

declare global {
  var __dirname: string;
  var __filename: string;
  var process: NodeJS.Process;
  var Buffer: BufferConstructor;
  var global: typeof globalThis;
}

export {};