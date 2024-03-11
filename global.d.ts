// global.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { Assertion } from "vitest";

declare module "vitest" {
  interface Assertion<> {
    toHTMLValidate(): void;
  }
}
