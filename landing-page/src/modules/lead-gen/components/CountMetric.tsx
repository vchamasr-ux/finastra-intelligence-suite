export function CountMetric({ label, value, loading, error }: { label: string; value: number; loading: boolean; error: boolean }) {
  const displayValue = loading ? "Loading" : error ? "Unavailable" : value;
  return (
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${label}: ${loading ? "loading" : error ? "unavailable" : value}`}
      data-testid="count-metric-value"
      className="text-lg font-bold text-white leading-none mt-1"
    >
      {displayValue}
    </span>
  );
}
