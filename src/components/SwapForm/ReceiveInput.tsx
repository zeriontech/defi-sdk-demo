import React, { useMemo, useState } from "react";
import { useAssetsInfo, useAssetsPrices, Asset as TAsset } from "defi-sdk";
import { popularAssets } from "../../constants/codes";
import { Asset } from "../Position/Position";
import { Menu } from "../utils/Menu";
import { getReceiveValue } from "./helpers";
import styles from "./SwapForm.module.css";
import { Quote } from "../../requests/getQuotes";

interface ReceiveInputProps {
  isLoading: boolean;
  receiveAsset: TAsset | null;
  selectedQuote: Quote | null;
  onAssetChange(asset: TAsset): void;
}

export function ReceiveInput({
  isLoading,
  receiveAsset,
  selectedQuote,
  onAssetChange,
}: ReceiveInputProps) {
  const [receiveMenuOpen, setReceiveMenuOpen] = useState(false);

  const { value: popularAssetsValue } = useAssetsPrices({
    currency: "usd",
    asset_codes: popularAssets,
  });

  const { value: assetsInfoValue } = useAssetsInfo({
    currency: "usd",
    search_query: "",
    // @ts-ignore
    order_by: { market_cap: "desc" },
  });

  const availiableAssets = useMemo(() => {
    return popularAssetsValue && assetsInfoValue
      ? [
          ...Object.values(popularAssetsValue),
          ...assetsInfoValue
            .map(item => item.asset)
            .filter(item => !popularAssets.includes(item.asset_code)),
        ]
      : null;
  }, [popularAssetsValue, assetsInfoValue]);

  return (
    <div className={styles.secondRow}>
      <input
        className={styles.formInput}
        placeholder="0"
        type="text"
        value={getReceiveValue({ isLoading, receiveAsset, selectedQuote })}
        disabled
      />
      <button
        disabled={!availiableAssets}
        className={styles.formButton}
        onClick={() => setReceiveMenuOpen(current => !current)}
      >
        {receiveAsset ? (
          <img
            className={styles.buttonIcon}
            src={receiveAsset.icon_url || ""}
            alt={receiveAsset.symbol?.slice(0, 3).toUpperCase() || "TOK"}
          />
        ) : null}
        {!availiableAssets
          ? "Loading..."
          : receiveAsset
          ? receiveAsset.symbol
          : "Receive token"}
      </button>
      {receiveMenuOpen ? (
        <Menu onDissmiss={() => setReceiveMenuOpen(false)}>
          {availiableAssets?.map(asset => (
            <button
              key={asset.asset_code}
              className={styles.assetMenuButton}
              onClick={() => {
                onAssetChange(asset);
                setReceiveMenuOpen(false);
              }}
            >
              <Asset asset={asset} />
            </button>
          ))}
        </Menu>
      ) : null}
    </div>
  );
}
