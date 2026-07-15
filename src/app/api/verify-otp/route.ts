import { NextRequest, NextResponse } from "next/server";
import { verifyArkeselOTP } from "@/lib/arkesel";
import { hasVoted } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json({ error: "Phone and code required" }, { status: 400 });
    }

    if (hasVoted(phone)) {
      return NextResponse.json(
        { error: "This number has already voted. Each number can only vote once." },
        { status: 403 }
      );
    }

    await verifyArkeselOTP(phone, code);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
