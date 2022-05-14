import crypto from "crypto";

export const generateHash = (content: string) =>
  crypto.createHmac("sha256", content).digest("hex").slice(0, 6);
