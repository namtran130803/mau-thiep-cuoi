"use client";

import BankSelect from "@/components/site/BankSelect";
import type { InviteFormData } from "@/lib/validation/invite";

type BankAccountFieldsProps = {
  value: InviteFormData["bankAccount"];
  onChange: (bankAccount: InviteFormData["bankAccount"]) => void;
};

export default function BankAccountFields({ value, onChange }: BankAccountFieldsProps) {
  function update(patch: Partial<InviteFormData["bankAccount"]>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className="form-stack">
      <label className="field">
        <span className="field__label">Số tài khoản</span>
        <input
          inputMode="numeric"
          value={value.accountNumber}
          onChange={(e) => update({ accountNumber: e.target.value })}
          placeholder="Ví dụ: 0886138003"
        />
      </label>

      <label className="field">
        <span className="field__label">Ngân hàng</span>
        <BankSelect
          value={value.bankBin}
          onChange={({ bankBin, bankName }) => update({ bankBin, bankName })}
        />
      </label>

      <label className="field">
        <span className="field__label">Chủ tài khoản</span>
        <input
          value={value.accountName}
          onChange={(e) => update({ accountName: e.target.value })}
          placeholder="Tên in hoa, không dấu"
        />
      </label>
    </div>
  );
}
