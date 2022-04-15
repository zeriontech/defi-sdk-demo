import axios from "axios";

interface getQuotesParams {
  input_token: string;
  output_token: string;
  input_chain: string;
  amount: string;
  from?: string;
  slippage?: string;
  gasPrice?: string;
  source_id?: string;
}

export interface Quote {
  guaranteed_output_amount: string;
  output_amount: string;
  token_spender: string;
  contract_metadata: {
    id: string;
    name: string;
    icon_url: string;
  } | null;
  estimated_gas: number;
  enough_allowance: boolean;
  base_protocol_fee: number;
  marketplace_fee: number;
  protocol_fee: number;
  protocol_fee_amount: string;
}

export async function getQuotes(params: getQuotesParams) {
  return axios.get<Quote[]>("https://transactions.zerion.io/swap/quote/list", {
    params,
  });
}
