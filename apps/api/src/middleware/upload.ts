import multer from "multer";

const maxPdfSizeBytes = 10 * 1024 * 1024;

export const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxPdfSizeBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return cb(new Error("Only PDF uploads are allowed for this MVP"));
    }

    return cb(null, true);
  }
});
