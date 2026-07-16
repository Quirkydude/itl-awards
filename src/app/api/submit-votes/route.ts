import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/arkesel";
import { hasVoted, saveVote, getAllVotes, buildTally } from "@/lib/voteStore";
import { voteCategories as categories } from "@/data/categories";
import { isVotingOpen } from "@/lib/votingDeadline";
import {
  clearVerificationCookie,
  getVerifiedPhone,
} from "@/lib/verificationSession";

export async function POST(req: NextRequest) {
  try {
    if (!isVotingOpen()) {
      return NextResponse.json(
        { error: "Voting has closed. New submissions are no longer accepted." },
        { status: 403 }
      );
    }

    const phone = getVerifiedPhone(req);
    if (!phone) {
      return NextResponse.json(
        { error: "Your verification has expired. Verify your phone again." },
        { status: 401 }
      );
    }

    const { votes } = await req.json();
    if (!votes || typeof votes !== "object") {
      return NextResponse.json({ error: "Votes are required" }, { status: 400 });
    }

    if (await hasVoted(phone)) {
      return NextResponse.json(
        { error: "This number has already voted." },
        { status: 403 }
      );
    }

    await saveVote(phone, votes);

    const votedCount = Object.values(votes as Record<string, string | null>).filter(
      (v) => v !== null
    ).length;
    const totalCategories = categories.length;

    try {
      await sendSMS(
        phone,
        `Thank you for voting at the ITL Cena a la Lus Awards Night! 🎉\n\nYou voted in ${votedCount} of ${totalCategories} categories. We'll see you at the dinner! 🕯️\n\n— Invitation to Light`
      );
    } catch (smsErr) {
      // Vote is already saved — don't fail the request if SMS fails
      console.error("Thank-you SMS failed:", smsErr);
    }

    const response = NextResponse.json({ success: true });
    clearVerificationCookie(response);
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    const status = message.includes("already voted") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allVotes = await getAllVotes();
    const tally = buildTally(allVotes);

    return NextResponse.json({
      totalVoters: allVotes.length,
      tally,
      raw: allVotes,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load votes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
