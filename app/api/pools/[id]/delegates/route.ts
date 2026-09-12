import { NextResponse } from 'next/server';
import { addDelegate, listDelegates } from '@/lib/delegates';
import { getPoolWithTotal } from '@/lib/pools';
import { requirePoolOrganizer } from '@/lib/server-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const delegates = await listDelegates(id);
    return NextResponse.json(delegates);
  } catch (error) {
    console.error('Error listing delegates:', error);
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

    const auth = await requirePoolOrganizer(request, pool.organizerAddress);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { address, name } = body;

    if (!address || typeof address !== 'string' || !/^G[A-Z2-7]{55}$/.test(address)) {
      return NextResponse.json({ error: 'Dirección de delegado inválida' }, { status: 400 });
    }

    const delegate = await addDelegate({ poolId: id, address, name });
    return NextResponse.json(delegate, { status: 201 });
  } catch (error) {
    console.error('Error adding delegate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
