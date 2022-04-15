import React from "react";
import { useAddressPositions } from "defi-sdk";
import { Position } from "./components";

interface PositionsProps {
  address?: string;
}

export const Positions = ({ address }: PositionsProps) => {
  const { value } = useAddressPositions(
    {
      currency: "USD",
      address: address || "",
    },
    {
      enabled: Boolean(address),
    },
  );

  return value ? (
    <>
      {value.positions?.map(position => (
        <Position key={position.id} position={position} />
      ))}
    </>
  ) : (
    <div>Loading...</div>
  );
};
