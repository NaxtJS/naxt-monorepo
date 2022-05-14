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

const packages = [".", ...workspaces]
  .map(workspace => glob.sync(workspace, { absolute: true }))
  .flat()
  .map(pkg => {
    const pkgJsonFile = resolve(pkg, "package.json");
    const pkgJson = require(pkgJsonFile);
    return { root: pkgJsonFile, pkg: pkgJson };
  });

//packages

const stdin = new EventEmitter();
let buff = "";

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
        const json = JSON.parse(matchedData);
        const pkg = packages.find(pkg => pkg.pkg.name === repo);
        if (pkg) {
          /**
           * ToDo: Write fix script
           *
           * @param json.missing Missing Dependencies
           * @param pkg.pkg Package.json
           * @param pkg.root Package.json root file
           */
        }
      } catch {
        console.log(cleanData);
      }
    }
  )
  .on("end", () => {});
