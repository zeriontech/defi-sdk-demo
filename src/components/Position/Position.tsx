import React from "react";
import type { AddressPosition, Asset as TAsset } from "defi-sdk";
import styles from "./Position.module.css";
import {
  get24hDiff,
  get24hRelativeDiff,
  getPositionsPrice,
  getAssetSymbol,
  getPositionValue,
  getAssetPrice,
} from "./helpers";

interface PositionProps {
  position: AddressPosition;
}

export const Position = ({ position }: PositionProps) => {
  const { asset } = position;
  return (
    <div className={styles.position}>
      <img
        className={styles.icon}
        src={asset.icon_url || ""}
        alt={getAssetSymbol(asset)}
      />

      <span className={styles.title}>
        <div>{asset.name}</div>
        <div className={styles.chain}>{position.chain}</div>
      </span>

      <span className={styles.number}>
        {`${getPositionValue(position).toFixed(2)}${asset.symbol}`}
      </span>

      <div className={styles.value}>
        <div className={styles.number}>
          {`$${getPositionsPrice(position).toFixed(2)}`}
        </div>
        <div
          className={styles.number}
          style={{
            color: get24hRelativeDiff(position) < 0 ? "#ff4a4a" : "#01a643",
          }}
        >
          {`${get24hRelativeDiff(position)}% ($${get24hDiff(position)})`}
        </div>
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
        alt={getAssetSymbol(asset)}
      />
      <span className={styles.title}>{asset.name}</span>
      <div className={styles.number}>
        {`$${getAssetPrice(asset).toFixed(2)}`}
      </div>
    </div>
  );
};
