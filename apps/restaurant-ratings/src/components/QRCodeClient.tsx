"use client";
import { useEffect, useState } from "react";

export default function QRCodeClient({ url }: { url?: string }) {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    try {
      const u = url ?? window.location.origin;
      setTarget(u);
    } catch (e) {
      setTarget(null);
    }
  }, [url]);

  if (!target) return null;

  const src = `https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=${encodeURIComponent(target)}`;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <img src={src} alt={`QR for ${target}`} width={160} height={160} />
      <div style={{ fontSize: 13, color: "#444" }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>用手機掃描快速開啟</div>
        <div style={{ maxWidth: 220, wordBreak: "break-all", opacity: 0.8 }}>{target}</div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#777" }}>
          提示：若手機無法連到 {target}，請改用電腦的 LAN IP（例如 192.168.x.x）或使用暫時外網轉發（ngrok / localtunnel）。
        </div>
      </div>
    </div>
  );
}
