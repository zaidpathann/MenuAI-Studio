import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/ui/AdminLayout";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { AccessPage } from "./pages/access/AccessPage";
import { Dashboard } from "./pages/admin/Dashboard";
import { Editor } from "./pages/admin/Editor";
import { Login } from "./pages/admin/Login";
import { ProjectCreate } from "./pages/admin/ProjectCreate";
import { ProjectDetail } from "./pages/admin/ProjectDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/access" element={<AccessPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects/new" element={<ProjectCreate />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="designs/:designId/editor" element={<Editor />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
