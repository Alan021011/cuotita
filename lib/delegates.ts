import { eq, and } from 'drizzle-orm';
import { db, initLocalDb } from '../db/client';
import { delegates } from '../db/schema';
import { nanoid } from 'nanoid';

export type Delegate = typeof delegates.$inferSelect;

export async function addDelegate(data: { poolId: string; address: string; name?: string }) {
  await initLocalDb();
  const existing = await db
    .select()
    .from(delegates)
    .where(and(eq(delegates.poolId, data.poolId), eq(delegates.address, data.address)));
  if (existing.length > 0) return existing[0];

  const [delegate] = await db
    .insert(delegates)
    .values({
      id: nanoid(12),
      poolId: data.poolId,
      address: data.address,
      name: data.name || null,
    })
    .returning();
  return delegate;
}

export async function listDelegates(poolId: string) {
  await initLocalDb();
  return db.select().from(delegates).where(eq(delegates.poolId, poolId));
}

export async function isDelegate(poolId: string, address: string): Promise<boolean> {
  await initLocalDb();
  const rows = await db
    .select()
    .from(delegates)
    .where(and(eq(delegates.poolId, poolId), eq(delegates.address, address)));
  return rows.length > 0;
}
