import React from "react";
import styles from "./Position.module.css";
import BigNumber from "bignumber.js";
import type { AddressPosition, Asset as TAsset } from "defi-sdk";

interface PositionProps {
  position: AddressPosition;
}

type PartialPosition = Pick<AddressPosition, "quantity" | "asset">;

const getAssetValue = ({ quantity, asset }: PartialPosition) => {
  return new BigNumber(quantity || 0).shiftedBy(0 - asset.decimals);
};

const getAssetPrice = ({ quantity, asset }: PartialPosition) => {
  if (asset.price?.value) {
    return getAssetValue({ quantity, asset }).times(asset.price?.value);
  }
  return new BigNumber(0);
};

const get24hDiff = ({ quantity, asset }: PartialPosition) => {
  if (asset.price?.relative_change_24h) {
    return getAssetPrice({ quantity, asset }).times(
      asset.price?.relative_change_24h / 100,
    );
  }
  return 0;
};

export const Position = ({ position }: PositionProps) => {
  const { asset } = position;
  return (
    <div className={styles.asset}>
      <img
        className={styles.icon}
        src={asset.icon_url || ""}
        alt={asset.symbol?.slice(0, 3).toUpperCase() || "TOK"}
      />
      <span className={styles.title}>{asset.name}</span>
      <span className={styles.number}>{`${getAssetValue(position).toFixed(2)}${
        asset.symbol
      }`}</span>
      <div className={styles.value}>
        <div className={styles.number}>{`${getAssetPrice(position).toFixed(
          2,
        )}$`}</div>
        <div
          className={styles.number}
          style={{
            color: get24hDiff(position) < 0 ? "#ff4a4a" : "#01a643",
          }}
        >{`${get24hDiff(position).toFixed(2)}$`}</div>
      </div>
    </div>
  );
};

interface AssetProps {
  asset: TAsset;
}

export const Asset = ({ asset }: AssetProps) => {
  return (
    <div className={styles.asset}>
      <img
        className={styles.icon}
        src={asset.icon_url || ""}
        alt={asset.symbol?.slice(0, 3).toUpperCase() || "TOK"}
      />
      <span className={styles.title}>{asset.name}</span>
    </div>
  );
};
