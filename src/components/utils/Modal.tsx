import React from "react";
import styles from "./Modal.module.css";

export function Modal({
  children,
  onDissmiss,
}: React.HTMLProps<HTMLDivElement> & { onDissmiss(): void }) {
  return (
    <div className={styles.backdrop} onClick={onDissmiss}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
