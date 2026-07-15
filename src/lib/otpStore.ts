// Vote-once tracking. OTP itself is handled by Arkesel generate/verify.

const votedPhones = new Set<string>();

export function hasVoted(phone: string) {
  return votedPhones.has(phone);
}

export function markVoted(phone: string) {
  votedPhones.add(phone);
}
