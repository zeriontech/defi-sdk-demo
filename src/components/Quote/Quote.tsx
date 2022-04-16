import React, { useMemo } from "react";
import { Asset, useAssetsPrices } from "defi-sdk";
import { Quote as TQuote } from "../../requests/getQuotes";
import styles from "./Quote.module.css";
import { ETH } from "../../constants/codes";
import { useGasPriceInfo } from "../../hooks/useGasInfo";
import { getFeeFiatPrice, getQuoteReceive } from "./helpers";

interface QuoteProps {
  quote: TQuote;
  asset: Asset;
}

export function Quote({ quote, asset }: QuoteProps) {
  const { data: pricesData } = useAssetsPrices({
    currency: "usd",
    asset_codes: [ETH],
  });

  const nativeAsset = useMemo(() => {
    return Object.values(pricesData?.prices || {})[0] || null;
  }, [pricesData]);

  const { data: gasPriceData } = useGasPriceInfo();

  const gasPrice = useMemo(() => {
    return String(gasPriceData?.price.fast);
  }, [gasPriceData]);

  return (
    <div className={styles.quote}>
      <div className={styles.text}>
        {`Receive: $${getQuoteReceive(quote, asset)}`}
      </div>

      <div className={styles.text}>
        {`Network fee: $${getFeeFiatPrice(
          quote.estimated_gas,
          gasPrice,
          nativeAsset,
        )}`}
      </div>

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
