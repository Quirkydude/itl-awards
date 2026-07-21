/** Format Ghana local numbers (0244…) to 233… for SMS providers */
export function formatPhone(to: string): string {
  const cleaned = to.replace(/[\s\-+]/g, "");
  if (cleaned.startsWith("233")) return cleaned;
  if (cleaned.startsWith("0")) return "233" + cleaned.slice(1);
  return cleaned;
}
