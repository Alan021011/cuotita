import { NextResponse } from 'next/server';
import { createClaim, listClaims } from '@/lib/claims';
import { getPoolWithTotal } from '@/lib/pools';
import { requireSignedAddress } from '@/lib/server-auth';

const ALLOWED_CATEGORIES = ['pantalla', 'freno', 'retrovisor', 'llanta', 'otro'];
/** Rough cap so a photo data URL can't blow up the row (~4MB before base64 overhead). */
const MAX_PHOTO_LENGTH = 5_500_000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const claims = await listClaims(id);
    return NextResponse.json(claims);
  } catch (error) {
    console.error('Error listing claims:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const pool = await getPoolWithTotal(id);
    if (!pool) {
      return NextResponse.json({ error: 'Fondo no encontrado' }, { status: 404 });
    }

    const auth = await requireSignedAddress(request);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { requesterName, category, amountBs, amountUsdc, photoDataUrl, quoteDataUrl, description } = body;

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Categoría de daño inválida' }, { status: 400 });
    }

    if (!amountUsdc || typeof amountUsdc !== 'string' || isNaN(Number(amountUsdc)) || Number(amountUsdc) <= 0) {
      return NextResponse.json({ error: 'El monto en USDC debe ser un número positivo' }, { status: 400 });
    }

    if (!photoDataUrl || typeof photoDataUrl !== 'string' || !photoDataUrl.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Adjunta una foto del daño' }, { status: 400 });
    }

    if (photoDataUrl.length > MAX_PHOTO_LENGTH) {
      return NextResponse.json({ error: 'La foto es demasiado grande' }, { status: 400 });
    }

    const claim = await createClaim({
      poolId: id,
      requesterAddress: auth.address,
      requesterName: requesterName?.trim(),
      category,
      amountBs: amountBs ? String(amountBs) : undefined,
      amountUsdc,
      photoDataUrl,
      quoteDataUrl: quoteDataUrl || undefined,
      description: description?.trim(),
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
