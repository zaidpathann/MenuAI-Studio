import { api } from "./client";
import type { ClientAccessKey, Design, ExtractedMenu, Project, User } from "../types";

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/login", { email, password });
  return data;
}

export async function getProjectsRequest() {
  const { data } = await api.get<{ projects: Project[] }>("/projects");
  return data.projects;
}

export async function createProjectRequest(input: { name: string; restaurantName: string }) {
  const { data } = await api.post<{ project: Project }>("/projects", input);
  return data.project;
}

export async function getProjectRequest(projectId: string) {
  const { data } = await api.get<{ project: Project; designs: Design[] }>(`/projects/${projectId}`);
  return data;
}

export async function deleteProjectRequest(projectId: string) {
  const { data } = await api.delete<{ success: boolean; deletedProjectId: string }>(`/projects/${projectId}`);
  return data;
}

export async function uploadPdfRequest(projectId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{ uploadedFile: Project["uploadedFiles"][number] }>(
    `/projects/${projectId}/upload`,
    form
  );
  return data;
}

export async function extractProjectRequest(projectId: string) {
  const { data } = await api.post<{ extractedData: ExtractedMenu }>(`/projects/${projectId}/extract`);
  return data.extractedData;
}

export async function generateDesignsRequest(projectId: string) {
  const { data } = await api.post<{ designs: Design[]; count: number }>(`/projects/${projectId}/generate`);
  return data;
}

export async function getDesignRequest(designId: string) {
  const { data } = await api.get<{ design: Design }>(`/designs/${designId}`);
  return data.design;
}

export async function saveCanvasRequest(designId: string, canvasState: Design["canvasState"]) {
  const { data } = await api.patch<{ design: Design }>(`/designs/${designId}/canvas`, { canvasState });
  return data.design;
}

export async function publishDesignRequest(designId: string) {
  const { data } = await api.post<{ design: Design; project: Project }>(`/designs/${designId}/publish`);
  return data;
}

export async function createClientKeyRequest(projectId: string) {
  const { data } = await api.post<{ accessKey: string }>("/access/keys", { projectId });
  return data.accessKey;
}

export async function listClientKeysRequest(projectId: string) {
  const { data } = await api.get<{ accessKeys: ClientAccessKey[] }>("/access/keys", {
    params: { projectId }
  });
  return data.accessKeys;
}

export async function verifyClientKeyRequest(accessKey: string) {
  const { data } = await api.post<{ project: Pick<Project, "name" | "restaurantName">; designs: Design[] }>(
    "/access/verify",
    { accessKey }
  );
  return data;
}
