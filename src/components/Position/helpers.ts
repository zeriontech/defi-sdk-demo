import BigNumber from "bignumber.js";
import { AddressPosition, Asset } from "defi-sdk";
import { convert } from "../../utils";

type PartialPosition = Pick<AddressPosition, "quantity" | "asset" | "chain">;

export const getAssetSymbol = (asset: Asset) => {
  return asset.symbol?.slice(0, 3).toUpperCase() || "TOK";
};

export const getPositionValue = ({
  quantity,
  asset,
  chain,
}: PartialPosition) => {
  return convert(
    quantity || 0,
    0 - (asset.implementations?.[chain].decimals || 18),
  );
};

export const getPositionsPrice = ({
  quantity,
  asset,
  chain,
}: PartialPosition) => {
  if (asset.price?.value) {
    return getPositionValue({ quantity, asset, chain }).times(
      asset.price?.value,
    );
  }
  return new BigNumber(0);
};

export const get24hDiff = ({ quantity, asset, chain }: PartialPosition) => {
  if (asset.price?.relative_change_24h) {
    return getPositionsPrice({ quantity, asset, chain })
      .times(asset.price?.relative_change_24h / 100)
      .abs()
      .toFixed(2);
  }
  return 0;
};

export const get24hRelativeDiff = ({ asset }: { asset: Asset }) => {
  return asset.price?.relative_change_24h.toFixed(2) || 0;
};

export const getAssetPrice = (asset: Asset) => {
  return asset.price?.value || 0;
};
