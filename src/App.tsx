import React from "react";
import { client } from "defi-sdk";
import styles from "./App.module.css";
import { AddressInput } from "./components";
import { useAddress } from "./hooks/useAddress";
import { Assets } from "./Assets";
import { History } from "./History";

// zerion eth address
// 0x42b9df65b219b3dd36ff330a4dd8f327a6ada990

export const endpoint = "wss://api-staging.zerion.io";
export const API_TOKEN = "Zerion.0JOY6zZTTw6yl5Cvz9sdmXc7d5AhzVMG";

client.configure({
  url: endpoint,
  apiToken: API_TOKEN,
  hooks: {
    willSendRequest: request => {
      (request.payload as any).lol = "lol";
      return request;
    },
  },
});

const App = () => {
  const [address, setAddress] = useAddress();

  return (
    <div className={styles.page}>
      <header>
        <AddressInput onSubmit={address => setAddress(address)} />
      </header>
      {address ? (
        <section className={styles.grid}>
          <div className={styles.column}>
            <h1>Assets</h1>
            <Assets address={address} />
          </div>
          <div className={styles.column}>
            <h1>History</h1>
            <History address={address} />
          </div>
        </section>
      ) : (
        <section className={styles.noAddress}>No address :(</section>
      )}
    </div>
  );
};

export default App;
