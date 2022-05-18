import { Plugin } from "rollup";
import { Parser } from "acorn";
import { simple } from "acorn-walk";
import MagicString from "magic-string";
import { Path } from "@naxt/utils";
import { ResolveQuery } from "@naxt/types";

export const worker = (): Plugin => ({
  name: "naxt:worker-plugin",

  transform(code, source) {
    const ast = Parser.parse(code, { ecmaVersion: "latest", sourceType: "module" });
    const path = Path.from(source);
    const codeMs = new MagicString(code);
    const pluginContext = this;

    const basename = path.basename[0].toUpperCase() + path.basename.slice(1);

    simple(ast, {
      ExportDefaultDeclaration(node: any) {
        const { declaration } = node;
        const code = codeMs.slice(declaration.start, declaration.end);
        codeMs.overwrite(node.start, node.end, `export const ${basename} = ${code}`);
      }
    });

    return { code: codeMs.toString() };
  }
});

worker.post = (): Plugin => ({
  name: "naxt:worker-post-processing"
});
