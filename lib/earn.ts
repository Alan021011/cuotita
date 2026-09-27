import { eq, desc } from 'drizzle-orm';
import { db, initLocalDb } from '../db/client';
import { earnMovements } from '../db/schema';
import { nanoid } from 'nanoid';
import { verifyEarnTxOnRPC } from './stellar';

export type EarnMovement = typeof earnMovements.$inferSelect;

export class EarnError extends Error {}

/**
 * Records a completed Earn deposit/withdraw after verifying the transaction
 * really landed on-chain and was signed by the caller. Mirrors the
 * verify-before-trust pattern used for contributions and claim payouts.
 */
export async function recordEarnMovement(data: {
  address: string;
  provider: string;
  opportunityId: string;
  kind: 'deposit' | 'withdraw';
  amount: string;
  assetCode: string;
  txHash: string;
}) {
  await initLocalDb();

  const existing = await db
    .select()
    .from(earnMovements)
    .where(eq(earnMovements.txHash, data.txHash));
  if (existing.length > 0) {
    throw new EarnError('Esta transacción ya fue registrada');
  }

  const verification = await verifyEarnTxOnRPC(data.txHash, data.address);
  if (!verification.valid) {
    throw new EarnError(verification.error || 'No se pudo verificar la transacción');
  }

  const [movement] = await db
    .insert(earnMovements)
    .values({
      id: nanoid(12),
      address: data.address,
      provider: data.provider,
      opportunityId: data.opportunityId,
      kind: data.kind,
      amount: data.amount,
      assetCode: data.assetCode,
      txHash: data.txHash,
    })
    .returning();
  return movement;
}

export async function listEarnMovements(address: string): Promise<EarnMovement[]> {
  await initLocalDb();
  return db
    .select()
    .from(earnMovements)
    .where(eq(earnMovements.address, address))
    .orderBy(desc(earnMovements.createdAt));
}
