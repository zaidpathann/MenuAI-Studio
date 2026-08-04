import { CheckCircle2, XCircle } from "lucide-react";

export type ToastState = {
  type: "success" | "error";
  message: string;
};

export function Toast({ toast, onClose }: { toast: ToastState | null; onClose: () => void }) {
  if (!toast) {
    return null;
  }

  const Icon = toast.type === "success" ? CheckCircle2 : XCircle;
  const tone =
    toast.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`fixed right-5 top-5 z-50 flex max-w-sm items-start gap-3 rounded-lg border p-4 shadow-sm ${tone}`}>
      <Icon className="mt-0.5 shrink-0" size={18} />
      <p className="text-sm font-medium">{toast.message}</p>
      <button className="ml-auto text-xs font-semibold opacity-70 hover:opacity-100" type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
