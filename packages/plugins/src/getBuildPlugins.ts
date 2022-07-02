import type { Plugin } from "@naxt/types";

export const getBuildPlugins = () => {
  const prePlugins: Plugin[] = [];
  const postPlugins: Plugin[] = [];

  return { pre: prePlugins, post: postPlugins };
};
