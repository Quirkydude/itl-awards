import { NextRequest, NextResponse } from "next/server";
import { hasVoted } from "@/lib/voteStore";
import {
  clearVerificationCookie,
  getVerifiedPhone,
} from "@/lib/verificationSession";

export async function GET(request: NextRequest) {
  try {
    const phone = getVerifiedPhone(request);
    if (!phone) {
      return NextResponse.json({ verified: false, submitted: false });
    }

    const submitted = await hasVoted(phone);
    const response = NextResponse.json({
      verified: !submitted,
      submitted,
      phone,
    });

    if (submitted) clearVerificationCookie(response);
    return response;
  } catch (error) {
    console.error("Verification session check failed:", error);
    return NextResponse.json(
      { error: "Could not check verification session" },
      { status: 500 }
    );
  }
}
