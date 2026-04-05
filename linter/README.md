# eslint-plugin-doc-comment

TypeScript の function 宣言・アロー関数・関数式に JSDoc コメントがなければエラーを出す ESLint プラグイン。

## 使い方（Flat Config 直接 import）

```ts
// eslint.config.ts
import docComment from "./path/to/eslint-plugin-doc-comment";

export default [
  {
    plugins: {
      "doc-comment": docComment,
    },
    rules: {
      "doc-comment/require-doc-comment": "error",
    },
  },
];
```

## ルール

### `require-doc-comment`

関数の直前に `/** ... */` 形式の JSDoc コメントを要求する。

**検出対象:**

- `function` 宣言
- アロー関数（`const fn = () => {}`）
- 関数式（`const fn = function() {}`）
