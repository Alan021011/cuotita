import { NextResponse } from 'next/server';
import { getClaim, markClaimPaid, ClaimError } from '@/lib/claims';
import { getPoolWithTotal } from '@/lib/pools';
import { requirePoolOrganizer } from '@/lib/server-auth';
import { verifyTxOnRPC } from '@/lib/stellar';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const claim = await getClaim(id);
    if (!claim) {
      return NextResponse.json({ error: 'Reclamo no encontrado' }, { status: 404 });
    }

    const pool = await getPoolWithTotal(claim.poolId);
    if (!pool) {
      return NextResponse.json({ error: 'Fondo no encontrado' }, { status: 404 });
    }

    // Only the organizer's wallet holds the pool's funds, so only they can pay out.
    const auth = await requirePoolOrganizer(request, pool.organizerAddress);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { txHash } = body;
    if (!txHash || typeof txHash !== 'string') {
      return NextResponse.json({ error: 'Falta el hash de la transacción' }, { status: 400 });
    }

    // Memo carries the claim id (not the pool id) so the payout is tied to this reclamo.
    const verification = await verifyTxOnRPC(txHash, claim.requesterAddress, claim.amountUsdc, claim.id, pool.organizerAddress);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }

    const updated = await markClaimPaid(id, txHash);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ClaimError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error paying claim:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
