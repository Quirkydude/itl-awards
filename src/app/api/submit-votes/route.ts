import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/arkesel";
import { hasVoted, markVoted } from "@/lib/otpStore";
import { allVotes } from "@/lib/voteStore";
import { categories } from "@/data/categories";

export async function POST(req: NextRequest) {
  try {
    const { phone, votes } = await req.json();

    if (!phone || !votes) {
      return NextResponse.json({ error: "Phone and votes required" }, { status: 400 });
    }

    if (hasVoted(phone)) {
      return NextResponse.json(
        { error: "This number has already voted." },
        { status: 403 }
      );
    }

    allVotes.push({ phone, votes, submittedAt: new Date().toISOString() });
    markVoted(phone);

    const votedCount = Object.values(votes as Record<string, string | null>).filter(
      (v) => v !== null
    ).length;
    const totalCategories = categories.length;

    await sendSMS(
      phone,
      `Thank you for voting at the ITL Cena a la Lus Awards Night! 🎉\n\nYou voted in ${votedCount} of ${totalCategories} categories. We'll see you at the dinner! 🕯️\n\n— Invitation to Light`
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tally: Record<string, Record<string, number>> = {};
  for (const record of allVotes) {
    for (const [catId, nomineeId] of Object.entries(record.votes)) {
      if (!nomineeId) continue;
      if (!tally[catId]) tally[catId] = {};
      tally[catId][nomineeId] = (tally[catId][nomineeId] ?? 0) + 1;
    }
  }

  return NextResponse.json({
    totalVoters: allVotes.length,
    tally,
    raw: allVotes,
  });
}
