"use client";

import { useEffect, useState } from "react";
import type { BankOption } from "@/lib/invite/banks";

type BankSelectProps = {
  value: string;
  onChange: (bank: { bankBin: string; bankName: string }) => void;
};

export default function BankSelect({ value, onChange }: BankSelectProps) {
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBanks() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/banks");
        const data = (await res.json()) as { banks?: BankOption[]; error?: string };
        if (!active) return;
        if (!res.ok || !data.banks) {
          throw new Error(data.error ?? "Không tải được danh sách ngân hàng");
        }
        setBanks(data.banks);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Không tải được danh sách ngân hàng");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadBanks();
    return () => {
      active = false;
    };
  }, []);

  function handleChange(bankBin: string) {
    const bank = banks.find((item) => item.bin === bankBin);
    onChange({
      bankBin,
      bankName: bank?.fullName ?? bank?.name ?? "",
    });
  }

  if (loading) {
    return (
      <select disabled className="field__select--loading">
        <option>Đang tải danh sách ngân hàng...</option>
      </select>
    );
  }

  if (error) {
    return (
      <>
        <select disabled>
          <option>Không tải được ngân hàng</option>
        </select>
        <span className="field__error">{error}</span>
      </>
    );
  }

  return (
    <select value={value} onChange={(e) => handleChange(e.target.value)}>
      <option value="">Chọn ngân hàng</option>
      {banks.map((bank) => (
        <option key={bank.bin} value={bank.bin}>
          {bank.name}
        </option>
      ))}
      {value && !banks.some((bank) => bank.bin === value) && (
        <option value={value}>{value} (đã lưu)</option>
      )}
    </select>
  );
}
