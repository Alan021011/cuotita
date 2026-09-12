import { NextResponse } from 'next/server';
import { castApproval, ClaimError } from '@/lib/claims';
import { requireSignedAddress } from '@/lib/server-auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const auth = await requireSignedAddress(request);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { decision } = body;

    if (decision !== 'approve' && decision !== 'reject') {
      return NextResponse.json({ error: 'Decisión inválida' }, { status: 400 });
    }

    const claim = await castApproval({
      claimId: id,
      delegateAddress: auth.address,
      decision,
    });

    return NextResponse.json(claim);
  } catch (error) {
    if (error instanceof ClaimError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error casting vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
