import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import { formatPhone } from "@/lib/phone";
import { VOTING_ENDS_AT } from "@/lib/votingDeadline";

export const VERIFICATION_COOKIE = "itl_verification";

type VerificationPayload = {
  phone: string;
  exp: number;
};

function getSecret() {
  const secret = process.env.VERIFICATION_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("VERIFICATION_SESSION_SECRET must be at least 32 characters");
  }
  return secret;
}

function sign(encodedPayload: string) {
  return createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function createToken(phone: string) {
  const payload: VerificationPayload = {
    phone: formatPhone(phone),
    exp: VOTING_ENDS_AT.getTime(),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function setVerificationCookie(response: NextResponse, phone: string) {
  const expires = VOTING_ENDS_AT;
  response.cookies.set(VERIFICATION_COOKIE, createToken(phone), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export function clearVerificationCookie(response: NextResponse) {
  response.cookies.set(VERIFICATION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export function getVerifiedPhone(request: NextRequest): string | null {
  const token = request.cookies.get(VERIFICATION_COOKIE)?.value;
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as VerificationPayload;
    if (!payload.phone || payload.exp <= Date.now()) return null;
    return formatPhone(payload.phone);
  } catch {
    return null;
  }
}
