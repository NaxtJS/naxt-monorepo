export const debounce = function <T extends Function>(fn: T, delay: number): T {
  let timer = null;

  // @ts-ignore
  return function (...args: any[]) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(fn.bind(context, ...args), delay);
  };
};
