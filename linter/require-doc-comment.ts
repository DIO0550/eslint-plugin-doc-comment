import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/doi-and/eslint-plugin-doc-comment/blob/main/docs/rules/${name}.md`,
);

type MessageIds = "missingDocComment";

export const requireDocComment = createRule<[], MessageIds>({
  name: "require-doc-comment",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require JSDoc comments on function declarations and arrow functions",
    },
    messages: {
      missingDocComment:
        "Missing JSDoc comment for '{{ name }}'.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode;

    function hasJSDocBefore(node: Parameters<typeof sourceCode.getCommentsBefore>[0]): boolean {
      const comments = sourceCode.getCommentsBefore(node);
      return comments.some(
        (comment) => comment.type === "Block" && comment.value.startsWith("*"),
      );
    }

    return {
      // function foo() {}
      FunctionDeclaration(node) {
        const name = node.id?.name ?? "(anonymous)";
        if (!hasJSDocBefore(node)) {
          context.report({ node, messageId: "missingDocComment", data: { name } });
        }
      },

      // const foo = () => {} / const foo = function() {}
      VariableDeclaration(node) {
        for (const declarator of node.declarations) {
          if (
            declarator.init &&
            (declarator.init.type === AST_NODE_TYPES.ArrowFunctionExpression ||
              declarator.init.type === AST_NODE_TYPES.FunctionExpression)
          ) {
            const name =
              declarator.id.type === AST_NODE_TYPES.Identifier
                ? declarator.id.name
                : "(anonymous)";

            // JSDocはVariableDeclaration(const/let/var行)の前に付く
            if (!hasJSDocBefore(node)) {
              context.report({
                node: declarator,
                messageId: "missingDocComment",
                data: { name },
              });
            }
          }
        }
      },
    };
  },
});
