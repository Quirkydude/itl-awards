const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY!;
const SENDER_ID = process.env.ARKESEL_SENDER_ID ?? "ITL Awards";

/** Format Ghana local numbers (0244…) to 233… for Arkesel */
export function formatPhone(to: string): string {
  const cleaned = to.replace(/[\s\-+]/g, "");
  if (cleaned.startsWith("233")) return cleaned;
  if (cleaned.startsWith("0")) return "233" + cleaned.slice(1);
  return cleaned;
}

function headers() {
  return {
    "api-key": ARKESEL_API_KEY,
    "Content-Type": "application/json",
  };
}

/**
 * Arkesel OTP generate — Arkesel creates + delivers the code.
 * POST https://sms.arkesel.com/api/otp/generate
 */
export async function generateOTP(to: string) {
  const number = formatPhone(to);

  const res = await fetch("https://sms.arkesel.com/api/otp/generate", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      expiry: 5,
      length: 6,
      medium: "sms",
      message:
        "Your ITL Awards Night code is %otp_code%. Valid for %expiry% minutes. Do not share this code.",
      number,
      sender_id: SENDER_ID.slice(0, 11),
      type: "numeric",
    }),
  });

  const data = await res.json();
  // Success code is "1000"
  if (data.code !== "1000") {
    console.error("Arkesel OTP generate error:", data);
    throw new Error(data.message || "Failed to send verification code");
  }
  return data;
}

/**
 * Arkesel OTP verify — Arkesel checks the code.
 * POST https://sms.arkesel.com/api/otp/verify
 */
export async function verifyArkeselOTP(to: string, code: string) {
  const number = formatPhone(to);

  const res = await fetch("https://sms.arkesel.com/api/otp/verify", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      code,
      number,
    }),
  });

  const data = await res.json();
  // Success code is "1100"
  if (data.code !== "1100") {
    console.error("Arkesel OTP verify error:", data);
    const msg =
      data.code === "1104"
        ? "Incorrect code. Try again."
        : data.code === "1105"
          ? "Code expired. Request a new one."
          : data.message || "Verification failed";
    throw new Error(msg);
  }
  return data;
}

/**
 * Bulk SMS gateway — for thank-you / notification messages only.
 * POST https://sms.arkesel.com/api/v2/sms/send
 */
export async function sendSMS(to: string, message: string) {
  const formatted = formatPhone(to);
  // v2 SMS prefers +233… per their docs, but 233… also works; keep + for bulk
  const recipient = formatted.startsWith("233") ? `+${formatted}` : formatted;

  const res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      sender: SENDER_ID.slice(0, 11),
      message,
      recipients: [recipient],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Arkesel SMS error:", data);
    throw new Error("SMS send failed");
  }
  return data;
}
