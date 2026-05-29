"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function buildGuestLink(inviteUrl: string, guestName: string): string {
  const trimmedUrl = inviteUrl.trim();
  const trimmedName = guestName.trim();
  if (!trimmedUrl || !trimmedName) return "";
  const url = new URL(trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`);
  url.searchParams.set("guest", trimmedName);
  return url.toString();
}

export default function GuestLinkGenerator() {
  const [inviteUrl, setInviteUrl] = useState("");
  const [guestNames, setGuestNames] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  function handleGenerate() {
    setError("");
    const names = guestNames.split("\n").map((n) => n.trim()).filter(Boolean);

    if (!inviteUrl.trim()) { setError("Vui lòng nhập liên kết thiệp"); return; }
    if (names.length === 0) { setError("Vui lòng nhập ít nhất một tên"); return; }

    try {
      setLinks(names.map((name) => buildGuestLink(inviteUrl, name)));
    } catch {
      setError("Liên kết thiệp không hợp lệ");
    }
  }

  async function copyLink(link: string, index: number) {
    await navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="guest-link-wrap">
      <div className="form-stack">
        <label className="field">
          <span className="field__label">Liên kết thiệp của bạn</span>
          <input
            value={inviteUrl}
            onChange={(e) => setInviteUrl(e.target.value)}
            placeholder="https://goatwedding.vn/nam-va-linh"
          />
        </label>

        <label className="field">
          <span className="field__label">Tên khách mời (mỗi dòng một tên)</span>
          <textarea
            rows={6}
            value={guestNames}
            onChange={(e) => setGuestNames(e.target.value)}
            placeholder={"Anh Nguyễn Văn A\nGia đình Chị Mai\nBạn Minh Anh"}
          />
        </label>

        {error && <p className="form-error-bar">{error}</p>}

        <button type="button" className="site-btn site-btn--primary site-btn--full" onClick={handleGenerate}>
          Tạo liên kết
        </button>
      </div>

      {links.length > 0 && (
        <ul className="guest-link-list">
          {links.map((link, index) => (
            <li key={link}>
              <code>{link}</code>
              <button
                type="button"
                className="site-btn site-btn--ghost site-btn--sm"
                style={{ flexShrink: 0 }}
                onClick={() => copyLink(link, index)}
              >
                {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
