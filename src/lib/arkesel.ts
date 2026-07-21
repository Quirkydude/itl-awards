import { formatPhone } from "@/lib/phone";

const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY!;
const SENDER_ID = process.env.ARKESEL_SENDER_ID ?? "ITL Awards";

type ArkeselOtpGenerateResponse = {
  code?: string;
  message?: string;
  ussd_code?: string;
};

type ArkeselOtpVerifyResponse = {
  code?: string;
  message?: string;
};

function headers() {
  if (!ARKESEL_API_KEY) {
    throw new Error("ARKESEL_API_KEY is not configured");
  }

  return {
    "api-key": ARKESEL_API_KEY,
    "Content-Type": "application/json",
  };
}

/**
 * Arkesel OTP generate — Arkesel creates + delivers the code (SMS + USSD retrieve).
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
        "Your ITL Awards Night code is %otp_code%. Valid for %expiry% minutes. Dial *928*01# if not received.",
      number,
      sender_id: SENDER_ID.slice(0, 11),
      type: "numeric",
    }),
  });

  const data = (await res.json()) as ArkeselOtpGenerateResponse;
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

  const data = (await res.json()) as ArkeselOtpVerifyResponse;
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
