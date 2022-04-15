import React from "react";
import styles from "./Menu.module.css";

export function Menu({
  children,
  onDissmiss,
}: React.HTMLProps<HTMLDivElement> & { onDissmiss(): void }) {
  return (
    <>
      <div className={styles.menu} onClick={e => e.stopPropagation()}>
        {children}
      </div>
      <div className={styles.backdrop} onClick={onDissmiss} />
    </>
  );
}
