import { requireDocComment } from "./rules/require-doc-comment.js";

const plugin = {
  rules: {
    "require-doc-comment": requireDocComment,
  },
};

export default plugin;
