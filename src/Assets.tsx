import React from "react";
import { useAddressAssets } from "defi-sdk";
import { Asset } from "./components";

interface AssetsProps {
  address?: string;
}

export const Assets = ({ address }: AssetsProps) => {
  const assets = useAddressAssets(
    {
      currency: "USD",
      address: address || "",
    },
    {
      enabled: Boolean(address),
    },
  );

  console.log(assets)

  return assets.value ? (
    <>
      {Object.entries(assets.value || {})?.map(([code, asset]) => (
        <Asset key={code} addressAsset={asset} />
      ))}
    </>
  ) : (
    <div>Loading...</div>
  );
};
