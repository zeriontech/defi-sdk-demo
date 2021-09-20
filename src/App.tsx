import React from "react";
import { client } from "defi-sdk";
import styles from "./App.module.css";

// export const endpoint = "wss://api-staging.zerion.io";
// export const API_TOKEN = "Zerion.0JOY6zZTTw6yl5Cvz9sdmXc7d5AhzVMG";

// client.configure({
//   url: endpoint,
//   apiToken: API_TOKEN,
//   hooks: {
//     willSendRequest: request => {
//       (request.payload as any).lol = "lol";
//       return request;
//     },
//   },
// });
// Object.assign(window, { client });

const App = () => {
  return (
    <div className={styles.page}>
      
    </div>
  );
};

export default App;
