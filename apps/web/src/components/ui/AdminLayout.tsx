import { LogOut, Plus, Utensils } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "./Button";

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f6f3]">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <NavLink to="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-950 text-white">
              <Utensils size={20} />
            </span>
            <span>
              <span className="block text-base font-semibold text-neutral-950">MenuAI Studio</span>
              <span className="block text-xs text-neutral-500">{user?.email}</span>
            </span>
          </NavLink>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate("/admin/projects/new")}>
              <Plus size={16} />
              New Project
            </Button>
            <Button variant="ghost" onClick={handleLogout} title="Log out">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}
