export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "published"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "archived"
        ? "border-neutral-300 bg-neutral-100 text-neutral-600"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>{status}</span>;
}
