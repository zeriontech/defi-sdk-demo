import BigNumber from "bignumber.js";
import { Asset } from "defi-sdk";
import { Quote } from "./../../requests/getQuotes";
import { ETHEREUM } from "../../constants/chains";
import { convert } from "../../utils";

export function getFeeFiatPrice(
  gas: string | number,
  gasPrice: string,
  nativeAsset: Asset,
) {
  if (gas && gasPrice && nativeAsset) {
    const gasPriceInEth = convert(
      gasPrice,
      0 - (nativeAsset.implementations?.[ETHEREUM].decimals || 18),
    );
    const totalGasInEth = gasPriceInEth.times(new BigNumber(gas));
    if (nativeAsset.price) {
      return totalGasInEth.times(nativeAsset.price.value).toFixed(2);
    }
  }
  return "";
}

export function getQuoteReceive(quote: Quote, asset: Asset) {
  return convert(
    Number(quote.output_amount),
    0 - (asset.implementations?.[ETHEREUM].decimals || 18),
  ).toFixed(2);
}
