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
      const sourcePath = Path.from<{ page: string }>(source);

      if (source.startsWith(entryPointBaseName)) {
        const sourcePagePath = Path.from(sourcePath.query.page);
        const basename = sourcePagePath.basename;
        const componentName = basename[0].toUpperCase() + basename.slice(1);
        entrypoints.add(sourcePagePath.importPath);
        entrypoints.add(sourcePagePath.fullPath);
        return `import { ${componentName} } from "${sourcePagePath.importPath}";\n\n${componentName}();`;
      }
    },

    transform(code, source) {
      if (source.startsWith(NULL_CHAR)) return code;
      if (source.includes("node_modules")) return code;
      if (!entrypoints.has(source)) return code;

      const sourcePath = Path.from(source);
      const ast = Parser.parse(code, { ecmaVersion: "latest", sourceType: "module" });
      const codeMs = new MagicString(code);
      const basename = sourcePath.basename[0].toUpperCase() + sourcePath.basename.slice(1);

      const declaratorVariableNames = {
        Identifier: declarator => declarator.id.name,
        ObjectPattern: declarator => declarator.id.properties.map(property => property.key.name),
        DEFAULT: declarator => {
          throw new Error(declarator.type);
        }
      };

      simple(ast, {
        ExportDefaultDeclaration(node: any) {
          const { declaration } = node;
          const code = codeMs.slice(declaration.start, declaration.end);
          codeMs.overwrite(node.start, node.end, `export const ${basename} = ${code}`);
        },
        ExportNamedDeclaration(node: any) {
          const { declaration } = node;
          const variableNames: string[] = declaration.declarations
            .map(declarator => {
              const declaratorVariableName =
                declaratorVariableNames[declarator.id.type] || declaratorVariableNames.DEFAULT;
              return declaratorVariableName(declarator);
            })
            .flat()
            .filter(Boolean);

          console.log(variableNames);
        }
      });

      return { code: codeMs.toString() };
    }
  };
};

worker.post = (): Plugin => {
  const licenseRegex = /\/\*\*\n\s*\*\s*@license[\s\S]*?\*\//;

  return {
    name: "naxt:worker-post-processing",

    transform(code) {
      let m,
        licences = "";
      while ((m = code.match(licenseRegex))) {
        code = code.replace(licenseRegex, "");
        licences += `${m[0]}\n`;
      }
      config.getConfig("license").append(licences, !!licences);
    }
  };
};

worker.transformToInputFile = (file: string | Path) =>
  `${NULL_CHAR}${ENTRYPOINT_BASENAME}?page=${file instanceof Path ? file.fullPath : file}`;
