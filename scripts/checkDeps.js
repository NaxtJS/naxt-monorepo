/**
 *
 * @typedef {{
 *    dependencies: string[],
 *    devDependencies: string[],
 *    missing: Record<string, string[]>,
 *    using: Record<string, string[]>,
 *    invalidFiles: Record<string, string[]>,
 *    invalidDirs: Record<string, string[]>
 *  }} DepCheck
 */

const { resolve, basename } = require("path");
const glob = require("glob");
const EventEmitter = require("events");

const { workspaces } = require("../package.json");
const { writeFileSync } = require("fs");

const packages = [".", ...workspaces]
  .map(workspace => glob.sync(workspace, { absolute: true }))
  .flat()
  .map(pkg => {
    const pkgJsonFile = resolve(pkg, "package.json");
    const pkgJson = require(pkgJsonFile);
    return { root: pkgJsonFile, pkg: pkgJson };
  });

const missingPackages = {};
process.stdin
  .on(
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
        writeFileSync(missingDepFile, JSON.stringify({ dependencies }, null, 2));
        console.log(`Wrote missing dependencies to file: ${missingDepFile}`);
      } catch (e) {
        console.log(cleanData);
      }
    }
  )
  .on("end", () => {});
