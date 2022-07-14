import yargs from "yargs";
import {} from "inquirer";
import { naxt } from "@naxt/runtime";

export const cli = (args: string[] = [], cwd = process.cwd()) => {
  return yargs(args, cwd)
    .command(
      "init [root]",
      "Initialize new application",
      yargs => yargs.positional("root", {}),
      ({ root }) => {}
    )

    .command(
      "generate [schema] [name] [page]",
      "Generate a schemas",
      yargs => yargs.positional("schema", {}).positional("name", {}).positional("page", {}),
      ({ name, page, schema }) => {}
    )

    .command(
      "add",
      "Initialize new application",
      yargs => yargs,
      ({}) => {}
    )

    .command(
      ["serve", "dev"],
      "Run development env for app",
      yargs => yargs.version(false).help(),
      ({}) => {
        naxt({ isDev: true }).serve();
      }
    )

    .command(
      "build",
      "Builds production application",
      yargs =>
        yargs.option("dev", { alias: "d", type: "boolean", default: false }).version(false).help(),
      ({ dev }) => {
        naxt({ isDev: dev }).build();
      }
    )

    .command(
      "serve:prod",
      "Run production env for app",
      yargs => yargs.version(false).help(),
      ({}) => {
        naxt({ isDev: false }).serve({ isProd: true });
      }
    )

    .parse(args);
};
