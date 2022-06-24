import { Plugin } from "@naxt/runtime";

export const getBuildPlugins = () => {
  const prePlugins: Plugin[] = [];
  const postPlugins: Plugin[] = [];

  return { pre: prePlugins, post: postPlugins };
};
