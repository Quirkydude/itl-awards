import { formatPhone } from "@/lib/phone";

const MOOLR_VAS_KEY = process.env.MOOLR_VAS_KEY!;
const SENDER_ID = (process.env.MOOLR_SENDER_ID ?? "ITL Awards").slice(0, 11);
const MOOLR_BASE_URL =
  process.env.MOOLR_BASE_URL?.replace(/\/$/, "") || "https://api.moolre.com";

type MoolrResponse = {
  status?: number;
  code?: string;
  message?: string;
  data?: unknown;
};

function headers() {
  if (!MOOLR_VAS_KEY) {
    throw new Error("MOOLR_VAS_KEY is not configured");
  }

  return {
    "Content-Type": "application/json",
    "X-API-VASKEY": MOOLR_VAS_KEY,
  };
}

/**
 * Send an SMS via Moolre.
 * POST https://api.moolre.com/open/sms/send
 */
export async function sendSMS(to: string, message: string) {
  const recipient = formatPhone(to);

  const res = await fetch(`${MOOLR_BASE_URL}/open/sms/send`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      type: 1,
      senderid: SENDER_ID,
      messages: [
        {
          recipient,
          message,
        },
      ],
    }),
  });

  const data = (await res.json()) as MoolrResponse;

  if (!res.ok || data.status !== 1) {
    console.error("Moolr SMS error:", data);
    throw new Error(data.message || "Failed to send SMS");
  }

  return data;
}
