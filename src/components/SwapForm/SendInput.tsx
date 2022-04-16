import { AddressPosition, useAddressPositions } from "defi-sdk";
import React, { useState } from "react";
import { Position } from "../Position/Position";
import { Menu } from "../utils/Menu";
import styles from "./SwapForm.module.css";

interface SendInputProps {
  address: string;
  sendPosition: AddressPosition | null;
  onValueChange(value: number): void;
  onPositionChange(position: AddressPosition): void;
}

export function SendInput({
  address,
  sendPosition,
  onValueChange,
  onPositionChange,
}: SendInputProps) {
  const [sendMenuOpen, setSendMenuOpen] = useState(false);

  const { value: addressPositions } = useAddressPositions(
    {
      currency: "usd",
      address: address || "",
    },
    {
      enabled: Boolean(address),
    },
  );

  return (
    <div className={styles.firstRow}>
      <input
        className={styles.formInput}
        placeholder="0"
        type="number"
        onChange={e => onValueChange(Number(e.target.value))}
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
            alt={sendPosition.asset.symbol?.slice(0, 3).toUpperCase() || "TOK"}
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
                onPositionChange(position);
                setSendMenuOpen(false);
              }}
            >
              <Position position={position} />
            </button>
          ))}
        </Menu>
      ) : null}
    </div>
  );
}
