import { Parser } from "acorn";
import { simple } from "acorn-walk";
import MagicString from "magic-string";
import {Plugin} from "@naxt/types";
import { config, ENTRYPOINT_BASENAME, Path,  } from "@naxt/runtime";
import { NULL_CHAR } from "..";

export const naxtResolveEntries = (): Plugin => {
  const entryPointBaseName = `${NULL_CHAR}${ENTRYPOINT_BASENAME}`;
  const entrypoints = new Set<string>();
  const reservedVariables = [];
  let licenseAdded = false;

  const license = `/**
 * @license
 * NaxtJS <https://github.com/NaxtJS/naxt-monorepo/wiki>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under Apache License 2.0 <https://raw.githubusercontent.com/NaxtJS/naxt-monorepo/master/LICENSE>
 * Copyright MDReal
 */`;

  const declaratorVariableNames = {
    Identifier: declarator => declarator.id.name,
    ObjectPattern: declarator => declarator.id.properties.map(property => property.key.name),
    DEFAULT: declarator => {
      throw new Error(declarator.type);
    }
  };

  return {
    name: "naxt-resolve-entries-plugin",

    resolveId(source, importer) {
      const appConfig = config.getConfig("appConfig");

      if (source.startsWith(entryPointBaseName)) {
        return source;
      }

      if (importer && source.startsWith(".")) {
        return Path.from(importer).duplicateTo(source).source.findFile().fullImportPath;
      }

      // ToDo: Handle module mapper
      Object.entries(appConfig.moduleMapper).forEach(([moduleName, moduleUrl]) => {
        console.log(moduleName, moduleUrl);
      });
    },

    load(source) {
      const sourcePath = Path.from<{ page: string }>(source);

      if (source.startsWith(entryPointBaseName)) {
        const sourcePagePath = Path.from(sourcePath.query.page);
        const basename = sourcePagePath.basename;
        const componentName = basename[0].toUpperCase() + basename.slice(1);
        entrypoints.add(sourcePagePath.fullImportPath);
        entrypoints.add(sourcePagePath.fullPath);
        return `
${licenseAdded ? "" : ((licenseAdded = !licenseAdded), license)}
import { ${componentName} } from "${sourcePagePath.fullImportPath}";

${componentName}();`;
      }
    },

    transform(code, source) {
      if (source.startsWith(NULL_CHAR)) return;
      if (source.includes("node_modules")) return;
      if (!entrypoints.has(source)) return;
      const sourcePath = Path.from(source);
      const basename = sourcePath.basename[0].toUpperCase() + sourcePath.basename.slice(1);
      const msCode = new MagicString(code);

      try {
        const ast = Parser.parse(msCode.toString(), {
          ecmaVersion: "latest",
          sourceType: "module"
        });
        const self = this;

        simple(ast, {
          ExportDefaultDeclaration(node: any) {
            const { declaration } = node;
            const code = msCode.slice(declaration.start, declaration.end);
            msCode.overwrite(node.start, node.end, `export const ${basename} = ${code}`);
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

            if (
              variableNames.length > 1 &&
              !variableNames.every(
                variable => reservedVariables.includes(variable) || variable !== basename
              )
            ) {
              self.error({ message: "exported variables is more than acceptable" });
            }
          }
        });
      } catch (e) {}

      return {
        code: msCode.toString(),
        map: msCode.generateMap({ hires: true })
      };
    }
  };
};
