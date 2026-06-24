interface CloseIconProps {
  /** Rendered width/height in px. Defaults to 18. */
  size?: number;
}

/** The close (✕) glyph used by dialog and panel headers. Presentational; inherits `currentColor`. */
export function CloseIcon({ size = 18 }: CloseIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
