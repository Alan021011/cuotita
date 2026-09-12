import { eq, and, desc } from 'drizzle-orm';
import { db, initLocalDb } from '../db/client';
import { claims, claimApprovals } from '../db/schema';
import { isDelegate } from './delegates';
import { nanoid } from 'nanoid';
import { CLAIM_QUORUM } from './constants';

export type Claim = typeof claims.$inferSelect;
export type ClaimApproval = typeof claimApprovals.$inferSelect;

export { CLAIM_QUORUM };

export class ClaimError extends Error {}

export async function createClaim(data: {
  poolId: string;
  requesterAddress: string;
  requesterName?: string;
  category: string;
  amountBs?: string;
  amountUsdc: string;
  photoDataUrl: string;
  quoteDataUrl?: string;
  description?: string;
}) {
  await initLocalDb();
  const [claim] = await db
    .insert(claims)
    .values({
      id: nanoid(12),
      poolId: data.poolId,
      requesterAddress: data.requesterAddress,
      requesterName: data.requesterName || null,
      category: data.category,
      amountBs: data.amountBs || null,
      amountUsdc: data.amountUsdc,
      photoDataUrl: data.photoDataUrl,
      quoteDataUrl: data.quoteDataUrl || null,
      description: data.description || null,
    })
    .returning();
  return claim;
}

export async function getClaim(id: string) {
  await initLocalDb();
  const [claim] = await db.select().from(claims).where(eq(claims.id, id));
  return claim || null;
}

export async function listClaimApprovals(claimId: string) {
  await initLocalDb();
  return db.select().from(claimApprovals).where(eq(claimApprovals.claimId, claimId));
}

export type ClaimWithApprovals = Claim & { approvals: ClaimApproval[] };

export async function listClaims(poolId: string): Promise<ClaimWithApprovals[]> {
  await initLocalDb();
  const poolClaims = await db
    .select()
    .from(claims)
    .where(eq(claims.poolId, poolId))
    .orderBy(desc(claims.createdAt));

  const withApprovals = await Promise.all(
    poolClaims.map(async (claim) => ({
      ...claim,
      approvals: await listClaimApprovals(claim.id),
    }))
  );
  return withApprovals;
}

/**
 * Casts a delegate's approve/reject vote. Quorum is symmetric: whichever side
 * (approvals or rejections) reaches CLAIM_QUORUM first decides the claim,
 * same pattern already validated in the fondo-comunitario sibling project.
 */
export async function castApproval(data: {
  claimId: string;
  delegateAddress: string;
  decision: 'approve' | 'reject';
}) {
  await initLocalDb();

  const claim = await getClaim(data.claimId);
  if (!claim) throw new ClaimError('Reclamo no encontrado');
  if (claim.status !== 'pending') {
    throw new ClaimError('Este reclamo ya fue resuelto');
  }

  const authorized = await isDelegate(claim.poolId, data.delegateAddress);
  if (!authorized) {
    throw new ClaimError('Solo los delegados del fondo pueden votar');
  }

  const existingVotes = await listClaimApprovals(data.claimId);
  if (existingVotes.some((v) => v.delegateAddress === data.delegateAddress)) {
    throw new ClaimError('Ya votaste en este reclamo');
  }

  await db.insert(claimApprovals).values({
    id: nanoid(12),
    claimId: data.claimId,
    delegateAddress: data.delegateAddress,
    decision: data.decision,
  });

  const votes = await listClaimApprovals(data.claimId);
  const approveCount = votes.filter((v) => v.decision === 'approve').length;
  const rejectCount = votes.filter((v) => v.decision === 'reject').length;

  let newStatus: 'approved' | 'rejected' | null = null;
  if (approveCount >= CLAIM_QUORUM) newStatus = 'approved';
  else if (rejectCount >= CLAIM_QUORUM) newStatus = 'rejected';

  if (newStatus) {
    await db.update(claims).set({ status: newStatus }).where(eq(claims.id, data.claimId));
  }

  return getClaim(data.claimId);
}

export async function markClaimPaid(claimId: string, payoutTxHash: string) {
  await initLocalDb();
  const claim = await getClaim(claimId);
  if (!claim) throw new ClaimError('Reclamo no encontrado');
  if (claim.status !== 'approved') {
    throw new ClaimError('El reclamo debe estar aprobado antes de pagarlo');
  }

  const existingTx = await db
    .select()
    .from(claims)
    .where(and(eq(claims.payoutTxHash, payoutTxHash)));
  if (existingTx.length > 0) {
    throw new ClaimError('Esta transacción ya fue registrada');
  }

  const [updated] = await db
    .update(claims)
    .set({ status: 'paid', payoutTxHash })
    .where(eq(claims.id, claimId))
    .returning();
  return updated;
}
