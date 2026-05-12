type Props = { value: string; label: string; dark?: boolean };

export function StatCard({ value, label, dark = true }: Props) {
  return (
    <div
      className={`rounded-lg p-5 text-center ${
        dark ? "bg-sd-dark" : "bg-white border border-sd-gray-border"
      }`}
    >
      <div
        className={`font-display text-4xl leading-none ${
          dark ? "text-sd-green" : "text-sd-green-text"
        }`}
      >
        {value}
      </div>
      <div
        className={`mt-1.5 text-[11px] font-medium uppercase tracking-[0.08em] ${
          dark ? "text-white/55" : "text-sd-gray-text"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
