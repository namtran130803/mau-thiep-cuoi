import type { Ref } from "react";
import type { KeyboardEvent } from "react";

type CoverGateProps = {
  coverGateRef: Ref<HTMLDivElement>;
  className: string;
  isInteractive: boolean;
  coverState: "closed" | "opening" | "opened";
  onOpen: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  brideName: string;
  groomName: string;
};

export default function CoverGate({
  coverGateRef,
  className,
  isInteractive,
  coverState,
  onOpen,
  onKeyDown,
  brideName,
  groomName,
}: CoverGateProps) {
  return (
    <div
      ref={coverGateRef}
      className={className}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : -1}
      aria-label={isInteractive ? "Chạm để mở thiệp" : undefined}
      inert={coverState === "opened" ? true : undefined}
      onClick={isInteractive ? onOpen : undefined}
      onKeyDown={isInteractive ? onKeyDown : undefined}
    >
      <div className="cover-panel cover-panel--left">
        <div className="cover-panel__inner">
          <span className="cover-panel__kicker">Cô dâu</span>
          <span className="cover-panel__name">{brideName}</span>
        </div>
      </div>

      <div className="cover-panel cover-panel--right">
        <div className="cover-panel__inner">
          <span className="cover-panel__kicker">Chú rể</span>
          <span className="cover-panel__name">{groomName}</span>
        </div>
      </div>

      <div className="cover-seal" aria-hidden="true">
        <span className="cover-seal__btn">
          <svg className="cover-seal__heart" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20.7l-7.35-6.58C2.52 12.18 1 10.11 1 7.75 1 4.96 3.46 2.5 6.25 2.5c1.68 0 3.28.82 4.25 2.13.97-1.31 2.57-2.13 4.25-2.13 2.79 0 5.25 2.46 5.25 5.25 0 2.36-1.52 4.43-3.65 6.37L12 20.7z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>

      <p className="cover-hint">Chạm để mở thiệp</p>
    </div>
  );
}
