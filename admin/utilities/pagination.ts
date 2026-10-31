export const listindex = (limit: number, pageSelect: number, index: number) => {
  return (pageSelect - 1) * limit + index + 1;
};
