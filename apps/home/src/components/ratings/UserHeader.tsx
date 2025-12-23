// apps/restaurant-ratings/src/components/ratings/UserHeader.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "@/app/ratings/page.module.css";

interface UserHeaderProps {
  userEmail: string;
}

export function UserHeader({ userEmail }: UserHeaderProps) {
  const [displayName, setDisplayName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDisplayName() {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const { data } = await response.json();
          if (data?.display_name) {
            setDisplayName(data.display_name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch display name:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDisplayName();
  }, []);

  async function handleSave() {
    if (!displayName.trim()) {
      setError("顯示名稱不能為空");
      return;
    }
    if (displayName.trim().length > 20) {
      setError("顯示名稱不能超過 20 個字元");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ display_name: displayName.trim() }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "儲存失敗");
      }

      setIsEditing(false);
      // 重新載入頁面以更新顯示
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.userHeader}>
      <div>
        歡迎，{userEmail}
        {!isLoading && (
          <span className={styles.displayNameSection}>
            {isEditing ? (
              <span className={styles.displayNameEdit}>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setError(null);
                  }}
                  placeholder="輸入顯示名稱"
                  maxLength={20}
                  className={styles.displayNameInput}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className={styles.saveButton}
                >
                  {isSaving ? "儲存中..." : "儲存"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                  }}
                  className={styles.cancelButton}
                >
                  取消
                </button>
                {error && (
                  <span className={styles.errorText}>{error}</span>
                )}
              </span>
            ) : (
              <span className={styles.displayNameDisplay}>
                {displayName ? (
                  <>
                    <span className={styles.displayNameLabel}>顯示名稱：</span>
                    <span className={styles.displayNameValue}>{displayName}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className={styles.editButton}
                      title="編輯顯示名稱"
                    >
                      ✏️
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={styles.setDisplayNameButton}
                  >
                    設定顯示名稱
                  </button>
                )}
              </span>
            )}
          </span>
        )}
      </div>
      <form action="/auth/logout" method="POST">
        <button type="submit" className={styles.logoutButton}>
          登出
        </button>
      </form>
    </div>
  );
}

