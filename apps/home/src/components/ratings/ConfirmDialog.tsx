// apps/restaurant-ratings/src/components/ratings/ConfirmDialog.tsx
"use client";

import { useState, ReactNode } from "react";
import styles from "@/app/ratings/page.module.css";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  children: (openDialog: () => void) => ReactNode;
  danger?: boolean;
}

export function ConfirmDialog({
  title,
  message,
  confirmText = "確認",
  cancelText = "取消",
  onConfirm,
  onCancel,
  children,
  danger = false,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    if (!isLoading) {
      setIsOpen(false);
      onCancel?.();
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      // 錯誤處理由調用者負責
      console.error("確認操作失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {children(openDialog)}
      
      {isOpen && (
        <div className={styles.dialogOverlay} onClick={closeDialog}>
          <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <h3 className={styles.dialogTitle}>{title}</h3>
            </div>
            
            <div className={styles.dialogBody}>
              <p className={styles.dialogMessage}>{message}</p>
            </div>
            
            <div className={styles.dialogFooter}>
              <button
                type="button"
                className={styles.dialogButton}
                onClick={closeDialog}
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`${styles.dialogButton} ${danger ? styles.dialogButtonDanger : styles.dialogButtonPrimary}`}
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "處理中..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

