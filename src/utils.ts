import BigNumber from "bignumber.js";

export const capitalize = (s?: string) =>
  s ? `${s.slice(0, 1).toUpperCase()}${s.slice(1)}` : "";

export const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export const convert = (value: number | string, decimals: number) => {
  return new BigNumber(value).shiftedBy(decimals || 0);
};
