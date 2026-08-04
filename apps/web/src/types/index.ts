export type User = {
  id: string;
  email: string;
  role: "admin";
};

export type MenuItem = {
  name: string;
  description?: string;
  price?: number;
};

export type MenuSection = {
  name: string;
  description?: string;
  items: MenuItem[];
};

export type ExtractedMenu = {
  restaurantName: string;
  currency: string;
  sections: MenuSection[];
  brandColors?: Record<string, string>;
  style?: { mood?: string; typography?: string; spacing?: string };
  businessDetails?: { address?: string; phone?: string; website?: string; serviceNote?: string };
  logo?: { text?: string; placement?: string };
};

export type UploadedFile = {
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
};

export type Project = {
  _id: string;
  name: string;
  restaurantName: string;
  status: "draft" | "published" | "archived";
  createdBy: string;
  extractedData?: ExtractedMenu;
  inputSource?: "pdf" | "image" | "manual";
  uploadedFiles: UploadedFile[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type CanvasElement = {
  id: string;
  type: "text" | "menu-list" | "shape" | "shape-outline";
  // text elements
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  fontStyle?: string;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  // shape elements
  borderWidth?: number;
  opacity?: number;
  // menu-list elements
  sections?: MenuSection[];
  currency?: string;
  layout?: string;
  accentColor?: string;
  mutedColor?: string;
  sectionWeight?: number;
  // common
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};

export type CanvasPage = {
  pageIndex: number;
  background: string;
  elements: CanvasElement[];
};

export type CanvasState = {
  version: number;
  templateId?: string;
  label?: string;
  category?: string;
  page: {
    width: number;
    height: number;
    background: string;
  };
  totalPages?: number;
  pages?: CanvasPage[];
  styles?: {
    palette?: Record<string, string>;
    typography?: Record<string, string | number>;
    layout?: string;
    brand?: Record<string, unknown>;
  };
  elements: CanvasElement[];
};

export type Design = {
  _id: string;
  projectId: string;
  templateId: string;
  batchNumber: number;
  designIndex: number;
  category: string;
  label?: string;
  canvasState: CanvasState;
  thumbnailUrl?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export type ClientAccessKey = {
  _id: string;
  projectId: string;
  accessKey: string;
  expiresAt?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  lastAccessedAt?: string;
};

export type ApiError = {
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};
