import { NextResponse } from "next/server";
import { requireSignedAddress } from "@/lib/server-auth";
import { recordEarnMovement, listEarnMovements, EarnError } from "@/lib/earn";

/** Personal Earn history: private to the authenticated wallet, never someone else's. */
export async function GET(request: Request) {
  const auth = await requireSignedAddress(request);
  if (!auth.ok) return auth.response;

  const movements = await listEarnMovements(auth.address);
  return NextResponse.json({ movements });
}

export async function POST(request: Request) {
  const auth = await requireSignedAddress(request);
  if (!auth.ok) return auth.response;

  let body: {
    provider?: string;
    opportunityId?: string;
    kind?: string;
    amount?: string;
    assetCode?: string;
    txHash?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { provider, opportunityId, kind, amount, assetCode, txHash } = body;
  if (
    !provider ||
    !opportunityId ||
    (kind !== "deposit" && kind !== "withdraw") ||
    !amount ||
    !assetCode ||
    !txHash
  ) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  try {
    const movement = await recordEarnMovement({
      address: auth.address,
      provider,
      opportunityId,
      kind,
      amount,
      assetCode,
      txHash,
    });
    return NextResponse.json({ movement }, { status: 201 });
  } catch (err) {
    if (err instanceof EarnError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("POST /api/earn/movements error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
