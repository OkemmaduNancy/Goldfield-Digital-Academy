import { NextResponse } from "next/server";
import { TOTAL_SPOTS } from "@/lib/capacity";
import { countPaidRegistrations } from "@/lib/registrations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const taken = await countPaidRegistrations();
    const remaining = Math.max(0, TOTAL_SPOTS - taken);

    return NextResponse.json(
      { total: TOTAL_SPOTS, remaining },
      {
        headers: {
          // Cached for a couple of minutes so busy days don't hit the database on every visit
          "Cache-Control":
            "public, max-age=0, s-maxage=120, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Could not count spots:", error);
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
