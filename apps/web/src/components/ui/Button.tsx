import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

const variants = {
  primary: "bg-neutral-950 text-white border-neutral-950 hover:bg-neutral-800",
  secondary: "bg-white text-neutral-950 border-neutral-300 hover:bg-neutral-100",
  ghost: "bg-transparent text-neutral-700 border-transparent hover:bg-neutral-100",
  danger: "bg-red-600 text-white border-red-600 hover:bg-red-700"
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
