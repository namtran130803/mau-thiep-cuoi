"use client";

import { useRef, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const result = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !result.url) throw new Error(result.error ?? "Tải ảnh thất bại");
      onChange(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="img-upload field">
      <span className="field__label">{label}</span>
      <div className="img-upload__box">
        {value ? (
          <img src={value} alt={label} className="img-upload__preview" />
        ) : (
          <span className="img-upload__placeholder">Chưa có ảnh</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="img-upload__input"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />
      <button
        type="button"
        className="site-btn site-btn--ghost site-btn--sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Đang tải..." : value ? "Đổi ảnh" : "Chọn ảnh"}
      </button>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
