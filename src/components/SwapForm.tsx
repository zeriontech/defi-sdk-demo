import React, { useEffect, useMemo, useState } from "react";
import {
  AddressPosition,
  Asset as TAsset,
  useAddressPositions,
  useAssetsInfo,
  useAssetsPrices,
} from "defi-sdk";
import debounce from "lodash/debounce";
import { popularAssets } from "../constants/codes";
import { useAddress } from "../hooks/useAddress";
import { Menu } from "./utils/Menu";
import { Modal } from "./utils/Modal";
import { Asset, Position } from "./Position";
import styles from "./SwapForm.module.css";
import { getQuotes } from "../requests/getQuotes";
import { useQuery } from "react-query";
import { convert } from "../utils";
import { Quote } from "./Quote";
import { ETHEREUM } from "../constants/chains";

const SwapFormContent = () => {
  const [address] = useAddress();

  const [sendMenuOpen, setSendMenuOpen] = useState(false);
  const [receiveMenuOpen, setReceiveMenuOpen] = useState(false);

  const [sendValue, setSendValue] = useState<number | undefined>(undefined);

  const [sendPosition, setSendPosition] = useState<AddressPosition | null>(
    null,
  );
  const [receiveAsset, setReceiveAsset] = useState<TAsset | null>(null);

  const { value: addressPositions } = useAddressPositions(
    {
      currency: "usd",
      address: address || "",
    },
    {
      enabled: Boolean(address),
    },
  );

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

  const debouncedHandleChange = useMemo(() => debounce(setSendValue, 300), []);

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

  const quotesParams = useMemo(() => {
    if (!sendPosition || !receiveAsset || !sendValue) {
      return null;
    }
    return {
      amount: convert(
        sendValue,
        sendPosition.asset.implementations?.[ETHEREUM].decimals || 18,
      ).toFixed(),
      input_token: sendPosition.asset.asset_code,
      output_token: receiveAsset.asset_code,
      input_chain: ETHEREUM,
      slippage: "3",
    };
  }, [sendPosition, receiveAsset, sendValue]);

  const { data, isLoading } = useQuery(
    ["getQuotes", quotesParams],
    () => (quotesParams ? getQuotes(quotesParams) : null),
    {
      retry: 1,
      refetchInterval: 20000,
      enabled: Boolean(quotesParams),
    },
  );

  const quotes = useMemo(() => {
    return data?.data;
  }, [data]);

  const [selectedQuoteId, setSelecetedQuoteId] = useState<string | null>(null);

  const selectedQuote = useMemo(() => {
    return quotes?.length
      ? selectedQuoteId
        ? quotes.find(
            quote => quote.contract_metadata?.id === selectedQuoteId,
          ) || quotes[0]
        : quotes[0]
      : null;
  }, [quotes, selectedQuoteId]);

  const receiveValue = useMemo(
    () =>
      isLoading
        ? "Loading..."
        : receiveAsset && selectedQuote
        ? convert(
            Number(selectedQuote.output_amount),
            0 - (receiveAsset.implementations?.[ETHEREUM].decimals || 18),
          ).toFixed(2)
        : 0,
    [isLoading, receiveAsset, selectedQuote],
  );

  console.log(selectedQuoteId);

  useEffect(() => {
    setSelecetedQuoteId(null);
  }, [sendPosition, receiveAsset]);

  return (
    <div className={styles.form}>
      <h2 className={styles.formTitle}>Swap!</h2>
      <div className={styles.firstRow}>
        <input
          className={styles.formInput}
          placeholder="0"
          type="number"
          onChange={e => debouncedHandleChange(Number(e.target.value))}
        />
        <button
          disabled={!addressPositions}
          onClick={() => setSendMenuOpen(current => !current)}
          className={styles.formButton}
        >
          {sendPosition ? (
            <img
              className={styles.buttonIcon}
              src={sendPosition.asset.icon_url || ""}
              alt={
                sendPosition.asset.symbol?.slice(0, 3).toUpperCase() || "TOK"
              }
            />
          ) : null}
          {!addressPositions
            ? "Loading..."
            : sendPosition
            ? sendPosition.asset.symbol
            : "Send token"}
        </button>
        {sendMenuOpen ? (
          <Menu onDissmiss={() => setSendMenuOpen(false)}>
            {addressPositions?.positions.map(position => (
              <button
                key={position.id}
                className={styles.assetMenuButton}
                onClick={() => {
                  setSendPosition(position);
                  setSendMenuOpen(false);
                }}
              >
                <Position position={position} />
              </button>
            ))}
          </Menu>
        ) : null}
      </div>
      <div className={styles.secondRow}>
        <input
          className={styles.formInput}
          placeholder="0"
          type="text"
          value={receiveValue}
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
                  setReceiveAsset(asset);
                  setReceiveMenuOpen(false);
                }}
              >
                <Asset asset={asset} />
              </button>
            ))}
          </Menu>
        ) : null}
      </div>

      <div className={styles.quotes}>
        {receiveAsset
          ? quotes?.map((quote, index) => (
              <button
                className={styles.quoteButton}
                key={quote.contract_metadata?.id || index}
                onClick={() =>
                  setSelecetedQuoteId(quote.contract_metadata?.id || null)
                }
                style={{
                  borderColor:
                    quote.contract_metadata?.id ===
                    selectedQuote?.contract_metadata?.id
                      ? "#2558d9"
                      : "#e6e7e9",
                }}
              >
                <Quote quote={quote} asset={receiveAsset} />
              </button>
            ))
          : null}
      </div>
    </div>
  );
};

export const SwapForm = () => {
  const [showSwapForm, setShowSwapForm] = useState(false);

  return (
    <>
      {!showSwapForm ? (
        <button
          className={styles.swapButton}
          onClick={() => setShowSwapForm(current => !current)}
        >
          Swap!
        </button>
      ) : null}
      {showSwapForm ? (
        <Modal onDissmiss={() => setShowSwapForm(false)}>
          <SwapFormContent />
        </Modal>
      ) : null}
    </>
  );
};
