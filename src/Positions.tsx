import React from "react";
import { AddressPosition, useAddressPositions } from "defi-sdk";
import { Position } from "./components";

interface PositionsProps {
  address?: string;
}

export const Positions = ({ address }: PositionsProps) => {
  // add code to fetch address posiitons
  const value = { positions: [] } as { positions: AddressPosition[] };
  //end

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
