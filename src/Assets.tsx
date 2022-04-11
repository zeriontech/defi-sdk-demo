import { useAddressAssets } from "defi-sdk";
import React from "react";
import { Asset } from "./components";

interface AssetsProps {
  address?: string;
}

export const Assets = ({ address = "" }: AssetsProps) => {
  const assets = useAddressAssets({ address, currency: "USD" });

  return assets.value ? (
    <>
      {Object.entries(assets.value).map(([hash, asset]) => (
        <Asset key={hash} addressAsset={asset} />
      ))}
    </>
  ) : (
    <div>Loading...</div>
  );
};
