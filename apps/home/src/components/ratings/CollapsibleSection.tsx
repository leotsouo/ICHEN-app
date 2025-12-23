// apps/home/src/components/ratings/CollapsibleSection.tsx
"use client";

import { useState, ReactNode } from "react";
import styles from "@/app/ratings/page.module.css";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.collapsibleSection}>
      <button
        type="button"
        className={styles.collapsibleHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.collapsibleTitle}>
          {icon && <span className={styles.collapsibleIcon}>{icon}</span>}
          {title}
        </span>
        <span className={styles.collapsibleArrow}>
          {isOpen ? "▼" : "▶"}
        </span>
      </button>
      {isOpen && <div className={styles.collapsibleContent}>{children}</div>}
    </div>
  );
}

