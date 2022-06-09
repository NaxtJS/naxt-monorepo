import { Plugin } from "rollup";
import { Parser } from "acorn";
import { simple } from "acorn-walk";
import MagicString from "magic-string";
import { Path } from "@naxt/utils";
import { ResolveQuery } from "@naxt/types";

export const worker = (): Plugin => {
  const entryPointBaseName = `${NULL_CHAR}${ENTRYPOINT_BASENAME}`;
  const entrypoints = new Set<string>();

  return {
    name: "naxt:worker-plugin",

    resolveId(source, importer) {
      if (source.startsWith(entryPointBaseName)) {
        return source;
      }

      if (source.startsWith(".")) {
        return Path.from(importer).relativeTo(source).source.findFile().importPath;
      }
    },

    load(source) {
      const path = sources.get(source);
      const importer = importers.get(source);
      const isEntrypoint = path.getQueryParam("entrypoint");
      const basename = path.basename[0].toUpperCase() + path.basename.slice(1);

      if (isEntrypoint) {
        return `import { ${basename} } from "${path.importPath}"; ${basename}();`;
      }

      if (importer?.getQueryParam("entrypoint")) {
        return importer.source.read();
      }
    },

    transform(code, source) {
      const path = sources.get(source);
      const importer = importers.get(source);

      if (path?.getQueryParam("entrypoint")) {
      }

      if (importer?.getQueryParam("entrypoint")) {
        const ast = Parser.parse(code, {
          ecmaVersion: "latest",
          sourceType: "module"
        });
        const codeMs = new MagicString(code);
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
    }
  };
};

worker.post = (): Plugin => ({
  name: "naxt:worker-post-processing"
});
