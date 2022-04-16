import React, { useMemo, useState } from "react";
import { AddressPosition, Asset as TAsset } from "defi-sdk";
import debounce from "lodash/debounce";
import { useQuery } from "react-query";
import { Modal } from "./../utils/Modal";
import styles from "./SwapForm.module.css";
import { getQuotes } from "../../requests/getQuotes";
import { convert } from "../../utils";
import { Quote } from "./../Quote/Quote";
import { ETHEREUM } from "../../constants/chains";
import { useSelectedQuote } from "./helpers";
import { SendInput } from "./SendInput";
import { ReceiveInput } from "./ReceiveInput";

interface SwapFormProps {
  address: string;
}

const SwapFormContent = ({ address }: SwapFormProps) => {
  const [sendValue, setSendValue] = useState<number | undefined>(undefined);
  const debouncedHandleChange = useMemo(() => debounce(setSendValue, 300), []);

  const [sendPosition, setSendPosition] = useState<AddressPosition | null>(
    null,
  );
  const [receiveAsset, setReceiveAsset] = useState<TAsset | null>(null);

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
    return data?.data || [];
  }, [data]);

  const { selectedQuote, setSelecetedQuoteId } = useSelectedQuote(
    quotes,
    sendPosition,
    receiveAsset,
  );

  return (
    <div className={styles.form}>
      <h2 className={styles.formTitle}>Swap!</h2>

      <SendInput
        address={address}
        sendPosition={sendPosition}
        onPositionChange={setSendPosition}
        onValueChange={debouncedHandleChange}
      />
      
      <ReceiveInput
        isLoading={isLoading}
        receiveAsset={receiveAsset}
        selectedQuote={selectedQuote}
        onAssetChange={setReceiveAsset}
      />

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

export const SwapForm = ({ address }: SwapFormProps) => {
  const [showSwapForm, setShowSwapForm] = useState(false);

  if (!address) {
    return null;
  }

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
          <SwapFormContent address={address} />
        </Modal>
      ) : null}
    </>
  );
};
