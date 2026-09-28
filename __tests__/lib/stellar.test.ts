import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyTxOnRPC } from '../../lib/stellar';
import { Transaction } from '@stellar/stellar-sdk';

vi.mock('@stellar/stellar-sdk', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@stellar/stellar-sdk')>();
  return {
    ...actual,
    Transaction: vi.fn().mockImplementation(function () {
      return {};
    })
  };
});

/** Builds a fake fetch() Response for a Horizon /transactions/{hash} call. */
function horizonResponse(body: { status: number; successful?: boolean; envelope_xdr?: string }) {
  if (body.status === 404) {
    return { status: 404, ok: false, json: async () => ({}) } as Response;
  }
  return {
    status: 200,
    ok: true,
    json: async () => ({ successful: body.successful, envelope_xdr: body.envelope_xdr }),
  } as Response;
}

describe('verifyTxOnRPC', () => {
  const MOCK_HASH = 'mock_hash';
  const MOCK_DESTINATION = 'G_DESTINATION';
  const MOCK_AMOUNT = '10.0000000';
  const MOCK_POOL_ID = 'test-pool-123';
  const MOCK_FROM = 'G_CONTRIBUTOR';
  const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  it('returns error if transaction does not exist (NOT_FOUND)', async () => {
    mockFetch.mockResolvedValueOnce(horizonResponse({ status: 404 }));

    const result = await verifyTxOnRPC(MOCK_HASH, MOCK_DESTINATION, MOCK_AMOUNT, MOCK_POOL_ID);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('does not exist');
  });

  it('returns error if transaction failed on-chain', async () => {
    mockFetch.mockResolvedValueOnce(horizonResponse({ status: 200, successful: false }));

    const result = await verifyTxOnRPC(MOCK_HASH, MOCK_DESTINATION, MOCK_AMOUNT, MOCK_POOL_ID);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('failed on-chain');
  });

  it('returns error if memo does not match poolId', async () => {
    mockFetch.mockResolvedValueOnce(horizonResponse({ status: 200, successful: true, envelope_xdr: 'mock-xdr' }));
    (Transaction as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
      return {
        memo: { type: 'text', value: 'wrong-pool' },
        operations: []
      };
    });

    const result = await verifyTxOnRPC(MOCK_HASH, MOCK_DESTINATION, MOCK_AMOUNT, MOCK_POOL_ID);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Memo mismatch');
  });

  it('returns error if asset is not USDC', async () => {
    mockFetch.mockResolvedValueOnce(horizonResponse({ status: 200, successful: true, envelope_xdr: 'mock-xdr' }));
    (Transaction as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
      return {
        memo: { type: 'text', value: MOCK_POOL_ID },
        operations: [
          {
            type: 'payment',
            destination: MOCK_DESTINATION,
            amount: '10.0000000',
            source: MOCK_FROM,
            asset: {
              isNative: () => true,
              getCode: () => 'XLM',
              getIssuer: () => ''
            }
          }
        ]
      };
    });

    const result = await verifyTxOnRPC(MOCK_HASH, MOCK_DESTINATION, '10', MOCK_POOL_ID);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid asset');
  });

  it('returns valid with on-chain from for a correct USDC transaction', async () => {
    mockFetch.mockResolvedValueOnce(horizonResponse({ status: 200, successful: true, envelope_xdr: 'mock-xdr' }));
    (Transaction as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
      return {
        source: 'G_TRANSACTION_SOURCE',
        memo: { type: 'text', value: MOCK_POOL_ID },
        operations: [
          {
            type: 'payment',
            destination: MOCK_DESTINATION,
            amount: '10.0000000',
            source: MOCK_FROM,
            asset: {
              isNative: () => false,
              getCode: () => 'USDC',
              getIssuer: () => USDC_ISSUER
            }
          }
        ]
      };
    });

    const result = await verifyTxOnRPC(MOCK_HASH, MOCK_DESTINATION, '10', MOCK_POOL_ID);
    expect(result.valid).toBe(true);
    expect(result.from).toBe(MOCK_FROM);
    expect(result.error).toBeUndefined();
  });

  it('returns error if recipient does not match', async () => {
    mockFetch.mockResolvedValueOnce(horizonResponse({ status: 200, successful: true, envelope_xdr: 'mock-xdr' }));
    (Transaction as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
      return {
        memo: { type: 'text', value: MOCK_POOL_ID },
        operations: [
          {
            type: 'payment',
            destination: 'G_OTHER',
            amount: '10.0000000',
            source: MOCK_FROM,
            asset: {
              isNative: () => false,
              getCode: () => 'USDC',
              getIssuer: () => USDC_ISSUER
            }
          }
        ]
      };
    });

    const result = await verifyTxOnRPC(MOCK_HASH, MOCK_DESTINATION, MOCK_AMOUNT, MOCK_POOL_ID);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('No matching payment');
  });

  it('returns error if amount does not match', async () => {
    mockFetch.mockResolvedValueOnce(horizonResponse({ status: 200, successful: true, envelope_xdr: 'mock-xdr' }));
    (Transaction as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
      return {
        memo: { type: 'text', value: MOCK_POOL_ID },
        operations: [
          {
            type: 'payment',
            destination: MOCK_DESTINATION,
            amount: '5.0000000',
            source: MOCK_FROM,
            asset: {
              isNative: () => false,
              getCode: () => 'USDC',
              getIssuer: () => USDC_ISSUER
            }
          }
        ]
      };
    });

    const result = await verifyTxOnRPC(MOCK_HASH, MOCK_DESTINATION, MOCK_AMOUNT, MOCK_POOL_ID);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('No matching payment');
  });
});
