import React from "react";
import { AddressAsset } from "defi-sdk";
import styles from "./Asset.module.css";
import BigNumber from "bignumber.js";

interface AssetProps {
  addressAsset: AddressAsset;
}

const getAssetValue = ({ quantity, asset }: AddressAsset) => {
  return new BigNumber(quantity).shiftedBy(0 - asset.decimals);
};

const getAssetPrice = ({ quantity, asset }: AddressAsset) => {
  if (asset.price?.value) {
    return getAssetValue({ quantity, asset }).times(asset.price?.value);
  }
  return new BigNumber(0);
};

const get24hDiff = ({ quantity, asset }: AddressAsset) => {
  if (asset.price?.relative_change_24h) {
    return getAssetPrice({ quantity, asset }).times(
      asset.price?.relative_change_24h / 100,
    );
  }
  return 0;
};

export const Asset = ({ addressAsset }: AssetProps) => {
  const { asset } = addressAsset;
  return (
    <div className={styles.asset}>
      <img
        className={styles.icon}
        src={asset.icon_url || ""}
        alt={asset.symbol?.slice(0, 3).toUpperCase() || 'TOK'}
      />
      <span className={styles.title}>{asset.name}</span>
      <span className={styles.number}>{`${getAssetValue(addressAsset).toFixed(
        2,
      )}${asset.symbol}`}</span>
      <div className={styles.value}>
        <div className={styles.number}>{`${getAssetPrice(addressAsset).toFixed(
          2,
        )}$`}</div>
        <div
          className={styles.number}
          style={{
            color: get24hDiff(addressAsset) < 0 ? "#ff4a4a" : "#01a643",
          }}
        >{`${get24hDiff(addressAsset).toFixed(2)}$`}</div>
      </div>
    </div>
  );
};
