import { LockKeyhole, Utensils } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../api/client";
import { loginRequest } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Toast } from "../../components/ui/Toast";
import type { ToastState } from "../../components/ui/Toast";
import { useAuthStore } from "../../store/authStore";

export function Login() {
  const navigate = useNavigate();
  const { token, setSession } = useAuthStore();
  const [email, setEmail] = useState("admin@menuai.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setToast({ type: "error", message: "Email and password are required." });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginRequest(email, password);
      setSession(data.token, data.user);
      navigate("/admin");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f3] px-5 py-10">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-950 text-white">
              <Utensils size={24} />
            </span>
            <span className="text-xl font-semibold text-neutral-950">MenuAI Studio</span>
          </div>
          <h1 className="mt-10 max-w-2xl text-5xl font-semibold leading-tight text-neutral-950">
            Internal menu design workflow for agency delivery.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
            Upload menus, generate five premium design directions, edit copy and placement, then publish a client view.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-neutral-950">
              <LockKeyhole size={20} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-neutral-950">Admin Login</h2>
              <p className="text-sm text-neutral-500">JWT session</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in" : "Sign In"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
