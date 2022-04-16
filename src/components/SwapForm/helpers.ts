import { AddressPosition, Asset } from "defi-sdk";
import { useEffect, useMemo, useState } from "react";
import { ETHEREUM } from "../../constants/chains";
import { Quote } from "../../requests/getQuotes";
import { convert } from "../../utils";

export const useSelectedQuote = (
  quotes: Quote[],
  sendPosition: AddressPosition | null,
  receiveAsset: Asset | null,
) => {
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

  useEffect(() => {
    setSelecetedQuoteId(null);
  }, [sendPosition, receiveAsset]);

  return { selectedQuote, setSelecetedQuoteId };
};

export const getReceiveValue = ({
  isLoading,
  receiveAsset,
  selectedQuote,
}: {
  isLoading: boolean;
  receiveAsset: Asset | null;
  selectedQuote: Quote | null;
}) => {
  return isLoading
    ? "Loading..."
    : receiveAsset && selectedQuote
    ? convert(
        Number(selectedQuote.output_amount),
        0 - (receiveAsset.implementations?.[ETHEREUM].decimals || 18),
      ).toFixed(2)
    : 0;
};
