import { generateOTP as arkeselGenerate, verifyArkeselOTP } from "@/lib/arkesel";

const DEFAULT_USSD = "*928*01#";

/**
 * Generate + send OTP via Arkesel (SMS). Returns ussd_code so users can
 * retrieve the code with USSD when SMS delivery fails.
 */
export async function generateOTP(to: string) {
  const data = await arkeselGenerate(to);
  return {
    success: true as const,
    ussd_code: data.ussd_code?.trim() || DEFAULT_USSD,
  };
}

/**
 * Verify a user-submitted OTP with Arkesel.
 */
export async function verifyOTP(to: string, code: string) {
  await verifyArkeselOTP(to, String(code).trim());
  return { success: true as const };
}
