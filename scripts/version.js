const { resolve, basename } = require("path");
const { inc, valid } = require("semver");
const { writeFileSync } = require("fs");
const glob = require("glob");

const { workspaces } = require("../package.json");

const levels = ["major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease"];
const preIds = ["alpha", "beta"];

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  const [, root] = process.argv;
  console.log(`Usage: ${basename(root)} {{ applications? }} {{ version? }} {{ pre-id? }}
  - application: * if for all, comma-separated names. can be added without organisation name. 
    example: @naxt/monorepo or monorepo both works
    default: *

  - version: one of ${levels.join(", ")} or specific version
    example: 1.3.6, 1.2.4-beta.44, 2.5.1-alpha.423, 3.2.665, patch, prepatch, prerelease
    default: patch

  - pre-id: one of ${preIds.join(", ")} or empty string
    default: empty string
`);

  process.exit(0);
}

const [upgradedPackagesString = "*", incrementLevel = "patch", preId = "beta"] =
  process.argv.slice(2);
const upgradedPackages = upgradedPackagesString.split(",");

if (!(levels.includes(incrementLevel) || valid(incrementLevel))) {
  throw new Error(`Level with name "${incrementLevel}" not found...`);
}

if (incrementLevel === "prerelease" && !preIds.includes(preId)) {
  throw new Error(`Pre version with name "${preId}" not found...`);
}

const packages = [".", ...workspaces]
  .map(workspace => glob.sync(workspace, { absolute: true }))
  .flat()
  .map(pkg => {
    const pkgJsonFile = resolve(pkg, "package.json");
    const pkgJson = require(pkgJsonFile);
    return { root: pkgJsonFile, pkg: pkgJson };
  })
  .filter(
    ({ pkg }) =>
      upgradedPackagesString === "*" ||
      upgradedPackages.includes(pkg.name) ||
      upgradedPackages.some(upgradedPackage => pkg.name.endsWith(upgradedPackage))
  )
  .map(
    pkg => (
      (pkg.pkg.version = valid(incrementLevel)
        ? incrementLevel
        : inc(pkg.pkg.version, incrementLevel, preId)),
      pkg
    )
  );

for (const { root, pkg } of packages) {
  writeFileSync(root, JSON.stringify(pkg, null, 2));
  const set = valid(incrementLevel) ? "set" : "updated";

  console.log(`Package "${pkg.name}" ${set} to version "${pkg.version}"`);
}
