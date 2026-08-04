/**
 * Menu extraction using NVIDIA DeepSeek V4 Flash via OpenAI-compatible SDK.
 * Steps:
 *   1. Extract raw text from PDF buffer using pdf-parse
 *   2. Send extracted text to deepseek-ai/deepseek-v4-flash
 *   3. Return structured JSON (same schema as before)
 */

import OpenAI from "openai";
import pdfParse from "pdf-parse";

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504, 529]);
const DEFAULT_MAX_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 1000;

interface ExtractedSection {
  name: string;
  description?: string;
  items: Array<{ name: string; description?: string; price?: number }>;
}

interface ExtractedMenu {
  restaurantName: string;
  logo: { text: string; placement: string };
  currency: string;
  brandColors: { primary: string; secondary: string; accent: string; paper: string };
  style: { mood: string; typography: string; spacing: string };
  businessDetails: { address: string; phone: string; website: string; serviceNote: string };
  sections: ExtractedSection[];
}

const EXTRACTION_PROMPT = `You are a menu data extraction specialist. Extract ALL content from the restaurant menu text below exactly as written.

Return ONLY a valid JSON object with this exact structure — no markdown, no explanation, just raw JSON:

{
  "restaurantName": "exact restaurant name from menu",
  "currency": "USD or INR or GBP etc — detect from price symbols",
  "brandColors": {
    "primary": "#hex — main dark brand color (guess from context if not explicit)",
    "secondary": "#hex — secondary brand color",
    "accent": "#hex — accent/highlight color",
    "paper": "#hex — background paper color"
  },
  "style": {
    "mood": "one phrase e.g. casual diner, fine dining, street food, Indian restaurant",
    "typography": "describe text style e.g. bold sans-serif, elegant serif",
    "spacing": "compact or open or structured"
  },
  "businessDetails": {
    "address": "full address if present, else empty string",
    "phone": "phone number if present, else empty string",
    "website": "website if present, else empty string",
    "serviceNote": "any tagline, hours, or service message, else empty string"
  },
  "sections": [
    {
      "name": "EXACT section name as printed e.g. Starters, Rice Bowl, Crezy Beef",
      "description": "section subtitle if any, else omit this field",
      "items": [
        {
          "name": "EXACT item name as printed",
          "description": "item description if given, else omit",
          "price": 299
        }
      ]
    }
  ]
}

CRITICAL RULES:
- Extract EVERY item from EVERY section — do not skip any.
- Use EXACT names as printed on the menu.
- Price must be a plain number (no currency symbol). Omit price field if not shown.
- Keep section names exactly as they appear even if misspelled.
- Return ONLY the JSON object. No markdown fences, no other text.

MENU TEXT:
`;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function isRetryableError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status && RETRYABLE_STATUS_CODES.has(status)) {
    return true;
  }

  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("timeout") ||
    message.includes("temporarily unavailable") ||
    message.includes("connection") ||
    message.includes("econnreset") ||
    message.includes("socket hang up")
  );
}

function getProviderRequestId(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const withHeaders = error as { headers?: Record<string, unknown>; request_id?: string };
  const headerReqId = withHeaders.headers?.["nvcf-reqid"];

  if (typeof headerReqId === "string" && headerReqId.trim()) {
    return headerReqId;
  }

  if (typeof withHeaders.request_id === "string" && withHeaders.request_id.trim()) {
    return withHeaders.request_id;
  }

  return undefined;
}

async function createExtractionCompletion(openai: OpenAI, promptText: string) {
  const maxAttempts = Math.max(Number(process.env.EXTRACTION_MAX_RETRIES || DEFAULT_MAX_ATTEMPTS), 1);
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await openai.chat.completions.create({
        model: "deepseek-ai/deepseek-v4-flash",
        messages: [
          {
            role: "user",
            content: promptText
          }
        ],
        temperature: 0.2,
        top_p: 0.95,
        max_tokens: 4096,
        stream: false
      });
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt >= maxAttempts) {
        break;
      }

      const delayMs = BASE_RETRY_DELAY_MS * 2 ** (attempt - 1) + Math.floor(Math.random() * 300);
      console.warn(
        `[pdfExtraction] Attempt ${attempt}/${maxAttempts} failed with transient error. Retrying in ${delayMs}ms.`
      );
      await sleep(delayMs);
    }
  }

  const status = getErrorStatus(lastError);
  const providerRequestId = getProviderRequestId(lastError);
  const reason = getErrorMessage(lastError);
  const statusText = status ? `status ${status}` : "unknown status";
  const reqIdText = providerRequestId ? ` (provider request id: ${providerRequestId})` : "";

  throw new Error(`AI extraction request failed with ${statusText}${reqIdText}. ${reason}`);
}

export async function extractMenuFromPdf(
  pdfBase64: string,
  restaurantName: string,
  apiKey: string
): Promise<ExtractedMenu> {
  // Step 1: Decode base64 → Buffer → extract raw text via pdf-parse
  const pdfBuffer = Buffer.from(pdfBase64, "base64");
  const parsed = await pdfParse(pdfBuffer);
  const menuText = parsed.text?.trim() ?? "";

  if (!menuText) {
    throw new Error("pdf-parse could not extract any text from this PDF. It may be image-based.");
  }

  // Step 2: Call NVIDIA DeepSeek V4 Flash via OpenAI-compatible SDK
  const openai = new OpenAI({
    apiKey: apiKey.replace(/^"|"$/g, ""), // strip surrounding quotes if any
    baseURL: "https://integrate.api.nvidia.com/v1"
  });

  const completion = await createExtractionCompletion(openai, EXTRACTION_PROMPT + menuText);

  // Step 3: Parse the JSON response
  let rawText = completion.choices[0]?.message?.content?.trim() ?? "";

  // Strip markdown fences if model adds them despite instructions
  rawText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Extract first JSON object if there is surrounding reasoning text
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) rawText = jsonMatch[0];

  let parsed2: Partial<ExtractedMenu>;
  try {
    parsed2 = JSON.parse(rawText) as Partial<ExtractedMenu>;
  } catch {
    console.error("[pdfExtraction] JSON parse failed. Raw response:", rawText.slice(0, 500));
    throw new Error(`Failed to parse JSON from AI response. Check server logs.`);
  }

  // Build final typed result with safe fallbacks
  const finalName = parsed2.restaurantName?.trim() || restaurantName;
  const initials = finalName
    .split(/\s+/)
    .map((w: string) => w[0] ?? "")
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return {
    restaurantName: finalName,
    logo: { text: initials, placement: "top-left" },
    currency: parsed2.currency ?? "INR",
    brandColors: parsed2.brandColors ?? {
      primary: "#111827",
      secondary: "#C8A45D",
      accent: "#B8442F",
      paper: "#F7F1E8"
    },
    style: parsed2.style ?? {
      mood: "classic restaurant",
      typography: "serif headings, clean body",
      spacing: "open"
    },
    businessDetails: parsed2.businessDetails ?? {
      address: "",
      phone: "",
      website: "",
      serviceNote: ""
    },
    sections: (parsed2.sections ?? []).filter(
      (s): s is ExtractedSection =>
        typeof s === "object" &&
        typeof s.name === "string" &&
        Array.isArray(s.items) &&
        s.items.length > 0
    )
  };
}
