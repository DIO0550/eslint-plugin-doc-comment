import { RuleTester } from "@typescript-eslint/rule-tester";
import { requireDocComment } from "../../src/rules/require-doc-comment.js";
import * as vitest from "vitest";

RuleTester.afterAll = vitest.afterAll;
RuleTester.describe = vitest.describe;
RuleTester.it = vitest.it;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: false,
    },
  },
});

ruleTester.run("require-doc-comment", requireDocComment, {
  valid: [
    // function宣言 + JSDoc
    {
      code: `
/** Adds two numbers. */
function add(a: number, b: number): number {
  return a + b;
}`,
    },
    // アロー関数 + JSDoc
    {
      code: `
/** Adds two numbers. */
const add = (a: number, b: number): number => {
  return a + b;
};`,
    },
    // 関数式 + JSDoc
    {
      code: `
/** Adds two numbers. */
const add = function (a: number, b: number): number {
  return a + b;
};`,
    },
    // 関数でない変数宣言はスキップ
    {
      code: `const x = 42;`,
    },
  ],
  invalid: [
    // function宣言 JSDocなし
    {
      code: `
function add(a: number, b: number): number {
  return a + b;
}`,
      errors: [{ messageId: "missingDocComment", data: { name: "add" } }],
    },
    // アロー関数 JSDocなし
    {
      code: `
const add = (a: number, b: number): number => {
  return a + b;
};`,
      errors: [{ messageId: "missingDocComment", data: { name: "add" } }],
    },
    // 関数式 JSDocなし
    {
      code: `
const add = function (a: number, b: number): number {
  return a + b;
};`,
      errors: [{ messageId: "missingDocComment", data: { name: "add" } }],
    },
    // 通常コメント（//）はJSDocとして認めない
    {
      code: `
// Adds two numbers.
function add(a: number, b: number): number {
  return a + b;
}`,
      errors: [{ messageId: "missingDocComment", data: { name: "add" } }],
    },
  ],
});
