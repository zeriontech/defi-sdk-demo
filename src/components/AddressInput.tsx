import React, { useState } from "react";
import styles from "./AddressInput.module.css";

export const AddressInput = ({
  onSubmit,
}: {
  onSubmit(address?: string): void;
}) => {
  const [value, setValue] = useState<string | undefined>("");

  return (
    <form
      className={styles.container}
      onSubmit={e => {
        e.preventDefault();
        onSubmit(value);
        setValue("");
      }}
    >
      <input
        autoComplete="off"
        className={styles.input}
        placeholder="Paste Ethereum Address"
        value={value}
        onChange={e => setValue(e.target.value || "")}
      ></input>
      <div style={{ width: "8px" }} />
      <button
        type="submit"
        disabled={!value}
        style={{ pointerEvents: value ? "auto" : "none" }}
      >
        Go!
      </button>
    </form>
  );
};
