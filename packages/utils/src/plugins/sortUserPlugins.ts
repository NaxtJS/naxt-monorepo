import { Plugin } from "@naxt/runtime";

export const sortUserPlugins = (plugins: Plugin[]) =>
  plugins.flat().reduce(
    (acc, plugin) => {
      const enforce = plugin.enforce || "normal";
      acc[enforce].push(plugin);
      return acc;
    },
    { pre: [] as Plugin[], post: [] as Plugin[], normal: [] as Plugin[] }
  );
