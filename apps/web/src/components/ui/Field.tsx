import type { InputHTMLAttributes, ReactNode } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  action?: ReactNode;
};

export function Field({ label, action, className = "", ...props }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-700">
      <span className="flex items-center justify-between gap-3">
        {label}
        {action}
      </span>
      <input
        className={`h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-200 ${className}`}
        {...props}
      />
    </label>
  );
}
