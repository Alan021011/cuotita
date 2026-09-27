import { createHash } from "crypto";
import { Keypair, rpc, Transaction, Networks, Operation } from "@stellar/stellar-sdk";

// SDF doesn't run a free public Soroban RPC for mainnet (only testnet), so
// 'soroban-mainnet.stellar.org' was never a real host — it doesn't resolve.
// mainnet.sorobanrpc.com is a real, community-run public mainnet endpoint.
const RPC_URL = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
  ? 'https://mainnet.sorobanrpc.com'
  : 'https://soroban-testnet.stellar.org';

const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
  ? Networks.PUBLIC
  : Networks.TESTNET;

export const STELLAR_EXPERT_URL = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
  ? 'https://stellar.expert/explorer/public'
  : 'https://stellar.expert/explorer/testnet';

/** USDC issuer on Stellar testnet (Pollar's own testnet faucet issuer). */
const USDC_ISSUER_TESTNET = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
/** USDC issuer on Stellar mainnet — Circle's official issuing account. */
const USDC_ISSUER_MAINNET = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';
const USDC_ISSUER = process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
  ? USDC_ISSUER_MAINNET
  : USDC_ISSUER_TESTNET;

function normalizeAmount(amt: string) {
  if (!amt.includes('.')) return amt + '.0000000';
  const [int, frac] = amt.split('.');
  return `${int}.${frac.padEnd(7, '0').slice(0, 7)}`;
}

export interface VerificationResult {
  valid: boolean;
  error?: string;
  from?: string;
  asset_code?: string;
  asset_issuer?: string;
  memo?: string;
}

export async function verifyTxOnRPC(
  hash: string,
  expectedTo: string,
  expectedAmount: string,
  expectedPoolId: string,
  expectedFrom?: string | null
): Promise<VerificationResult> {
  try {
    const server = new rpc.Server(RPC_URL);
    const txRes = await server.getTransaction(hash);

    if (txRes.status === 'NOT_FOUND') {
      return { valid: false, error: "Transaction does not exist on RPC or is too old" };
    }

    if (txRes.status !== 'SUCCESS') {
      return { valid: false, error: "Transaction failed on-chain" };
    }

    // Parse XDR
    const tx = new Transaction(txRes.envelopeXdr, NETWORK_PASSPHRASE);
    
    let memoValue = '';
    if (tx.memo && tx.memo.value) {
      memoValue = typeof tx.memo.value === 'string' 
        ? tx.memo.value 
        : Buffer.from(tx.memo.value).toString('utf8');
    }

    if (tx.memo.type !== 'text' || memoValue !== expectedPoolId) {
      return { valid: false, error: `Memo mismatch: expected poolId "${expectedPoolId}", got "${memoValue || '(none)'}"` };
    }

    const normalizedExpected = normalizeAmount(expectedAmount);

    let paymentOp: Operation.Payment | undefined;
    for (const op of tx.operations) {
      if (op.type === 'payment' && op.destination === expectedTo) {
        if (normalizeAmount(op.amount) === normalizedExpected) {
          paymentOp = op as Operation.Payment;
          break;
        }
      }
    }

    if (!paymentOp) {
      return { valid: false, error: "No matching payment operation found (wrong recipient or amount)" };
    }

    const assetCode = paymentOp.asset.isNative() ? 'native' : paymentOp.asset.getCode();
    const assetIssuer = paymentOp.asset.isNative() ? '' : paymentOp.asset.getIssuer();

    if (assetCode !== 'USDC' || assetIssuer !== USDC_ISSUER) {
      return { valid: false, error: `Invalid asset: expected USDC (${USDC_ISSUER}), got ${assetCode} (${assetIssuer || 'n/a'})` };
    }

    const onChainFrom = paymentOp.source || tx.source;

    if (!onChainFrom) {
      return { valid: false, error: "Could not determine sender from on-chain data" };
    }

    if (expectedFrom && onChainFrom !== expectedFrom) {
      return { valid: false, error: `Sender mismatch: expected ${expectedFrom}, got ${onChainFrom}` };
    }

    return {
      valid: true,
      from: onChainFrom,
      asset_code: assetCode,
      asset_issuer: assetIssuer,
      memo: memoValue
    };
  } catch (err) {
    console.error("Error verifyTxOnRPC:", err);
    return { valid: false, error: "Connection or parsing error with Stellar RPC" };
  }
}

/**
 * Verifies an Earn deposit/withdraw (Soroban contract call, e.g. Blend) on RPC.
 * Unlike verifyTxOnRPC (classic payment op), we can't decode the exact amount
 * from a Soroban invoke_host_function without that contract's ABI, so this only
 * confirms the transaction really happened, succeeded on-chain, and was signed
 * by the expected address — enough to stop a fabricated history entry. The
 * amount/kind recorded alongside it come from the same request that told the
 * Pollar SDK to build this exact transaction, not from an untrusted client claim.
 */
export async function verifyEarnTxOnRPC(
  hash: string,
  expectedAddress: string
): Promise<VerificationResult> {
  try {
    const server = new rpc.Server(RPC_URL);
    const txRes = await server.getTransaction(hash);

    if (txRes.status === 'NOT_FOUND') {
      return { valid: false, error: "Transaction does not exist on RPC or is too old" };
    }
    if (txRes.status !== 'SUCCESS') {
      return { valid: false, error: "Transaction failed on-chain" };
    }

    const tx = new Transaction(txRes.envelopeXdr, NETWORK_PASSPHRASE);
    if (tx.source !== expectedAddress) {
      return { valid: false, error: `Sender mismatch: expected ${expectedAddress}, got ${tx.source}` };
    }

    return { valid: true, from: tx.source };
  } catch (err) {
    console.error("Error verifyEarnTxOnRPC:", err);
    return { valid: false, error: "Connection or parsing error with Stellar RPC" };
  }
}

const SEP53_PREFIX = "Stellar Signed Message:\n";

function sha256(data: Buffer): Buffer {
  return createHash("sha256").update(data).digest();
}

function decodeSignature(signature: string): Buffer | null {
  const trimmed = signature.trim();
  try {
    const b64 = Buffer.from(trimmed, "base64");
    if (b64.length === 64) return b64;
  } catch { }
  if (/^[0-9a-fA-F]{128}$/.test(trimmed)) {
    return Buffer.from(trimmed, "hex");
  }
  return null;
}

/** Verify a SEP-53 message signature against a Stellar G… address. */
export function verifySessionSignature(opts: {
  address: string;
  message: string;
  signature: string;
}): boolean {
  if (!/^G[A-Z2-7]{55}$/.test(opts.address)) return false;
  const sig = decodeSignature(opts.signature);
  if (!sig) return false;

  const payload = Buffer.concat([
    Buffer.from(SEP53_PREFIX, "utf8"),
    Buffer.from(opts.message, "utf8"),
  ]);
  const digest = sha256(payload);

  try {
    return Keypair.fromPublicKey(opts.address).verify(digest, sig);
  } catch {
    return false;
  }
}

