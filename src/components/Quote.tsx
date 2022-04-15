import React, { useMemo } from "react";
import { Asset, useAssetsPrices } from "defi-sdk";
import { ETHEREUM } from "../constants/chains";
import { Quote as TQuote } from "../requests/getQuotes";
import { convert } from "../utils";
import styles from "./Quote.module.css";
import BigNumber from "bignumber.js";
import { ETH } from "../constants/codes";
import { useGasPriceInfo } from "../hooks/useGasInfo";

interface QuoteProps {
  quote: TQuote;
  asset: Asset;
}

function getFeeFiatPrice(
  gas: string | number,
  gasPrice: string,
  nativeAsset: Asset,
) {
  const gasPriceInEth = convert(
    gasPrice,
    0 - (nativeAsset.implementations?.[ETHEREUM].decimals || 18),
  );
  const totalGasInEth = gasPriceInEth.times(new BigNumber(gas));
  if (nativeAsset.price) {
    return totalGasInEth.times(nativeAsset.price.value);
  }
  return null;
}

export function Quote({ quote, asset }: QuoteProps) {
  const { data: pricesData } = useAssetsPrices({
    currency: "usd",
    asset_codes: [ETH],
  });

  console.log(pricesData);

  const nativeAsset = useMemo(() => {
    return Object.values(pricesData?.prices || {})[0] || null;
  }, [pricesData]);

  const { data: gasPriceData } = useGasPriceInfo();

  const gasPrice = useMemo(() => {
    return String(gasPriceData?.price.fast);
  }, [gasPriceData]);

  const gas = quote.estimated_gas;
  const feeFiatPrice =
    gas && gasPrice && nativeAsset
      ? getFeeFiatPrice(gas, gasPrice, nativeAsset)
      : null;

  return (
    <div className={styles.quote}>
      <div className={styles.text}>{`Receive: $${convert(
        Number(quote.output_amount),
        0 - (asset.implementations?.[ETHEREUM].decimals || 18),
      ).toFixed(2)}`}</div>
      <div className={styles.text}>{`Network fee: $${feeFiatPrice?.toFixed(
        2,
      )}`}</div>
      <div className={styles.contract}>
        <img
          className={styles.contractIcon}
          src={quote.contract_metadata?.icon_url || ""}
          alt={quote.contract_metadata?.name || "Quote"}
        />
        {quote.contract_metadata?.name}
      </div>
    </div>
  );
}
