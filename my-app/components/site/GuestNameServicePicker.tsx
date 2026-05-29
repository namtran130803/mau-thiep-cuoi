"use client";

import {
  GUEST_NAME_SERVICE_PRICE,
  GUEST_NAME_WITHOUT_DESC,
  GUEST_NAME_WITHOUT_LABEL,
  GUEST_NAME_WITH_DESC,
  GUEST_NAME_WITH_LABEL,
  formatVnd,
} from "@/lib/pricing";

type GuestNameServicePickerProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  showExtraPrice?: boolean;
};

export default function GuestNameServicePicker({
  value,
  onChange,
  showExtraPrice = true,
}: GuestNameServicePickerProps) {
  return (
    <div className="guest-name-options form-field--full">
      <button
        type="button"
        className={`guest-name-option${!value ? " is-selected" : ""}`}
        onClick={() => onChange(false)}
      >
        <strong>{GUEST_NAME_WITHOUT_LABEL}</strong>
        <span>{GUEST_NAME_WITHOUT_DESC}</span>
      </button>

      <button
        type="button"
        className={`guest-name-option${value ? " is-selected" : ""}`}
        onClick={() => onChange(true)}
      >
        <strong>{GUEST_NAME_WITH_LABEL}</strong>
        <span>
          {GUEST_NAME_WITH_DESC}
          {showExtraPrice ? ` (+${formatVnd(GUEST_NAME_SERVICE_PRICE)})` : ""}
        </span>
      </button>
    </div>
  );
}
