/**
 * @typedef {{
 *    dependencies: string[],
 *    devDependencies: string[],
 *    missing: Record<string, string[]>,
 *    using: Record<string, string[]>,
 *    invalidFiles: Record<string, string[]>,
 *    invalidDirs: Record<string, string[]>
 *  }} DepCheck
 */

const { resolve, dirname } = require("path");
const { writeFileSync, mkdirSync, unlinkSync } = require("fs");

const isDevDep = dep => dep.startsWith("@types") || dep === "@naxt/types";

process.stdin.on(
  "data",
  /** @param {Buffer} data */ data => {
    const cleanData = data
      .toString("utf-8")
      .replace(/➤ YN\d{0,4}:/g, "")
      .trim();

    try {
      const [, repo, matchedData] = cleanData?.match(/^\[([\s\S]+?)]:\s*([\s\S]+?)$/);
      /** @type {DepCheck} */
      const { missing } = JSON.parse(matchedData);
      const dependencies = Object.keys(missing);
      const pkgName = repo.slice(repo.startsWith("@") ? 1 : 0).replace(/\W+/g, "-");
      const missingDepFile = resolve(process.cwd(), "missingRepos", `${pkgName}.json`);

      try {
        unlinkSync(missingDepFile);
      } catch (e) {}
      if (dependencies.length) {
        mkdirSync(dirname(missingDepFile), { recursive: true });
        const deps = dependencies.filter(dep => !isDevDep(dep));
        const devDeps = dependencies.filter(isDevDep);

        writeFileSync(
          missingDepFile,
          JSON.stringify(
            {
              dependencies,
              commands: {
                dep: (deps.length && `yarn workspace ${repo} add ${deps.join(" ")}`) || undefined,
                dev:
                  (devDeps.length && `yarn workspace ${repo} add --dev ${devDeps.join(" ")}`) ||
                  undefined
              }
            },
            null,
            2
          )
        );
        console.log(`[${repo}]: Wrote missing dependencies to file: ${missingDepFile}`);
      }
    } catch (e) {
      console.log(cleanData);
    }
  }
);
