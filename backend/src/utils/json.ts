// utils/json.ts
import { logger } from "./logger";

export function safeJsonParse(text?: string) {
  try {
    const cleaned = text
      ?.replace(/```json/g, "")
      ?.replace(/```/g, "")
      ?.trim();

    return JSON.parse(cleaned || "{}");
  } catch (err) {
    logger.warn("JSON parse failed", { text });
    return {};
  }
}
