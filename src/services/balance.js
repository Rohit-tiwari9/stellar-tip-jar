/**
 * balance.js — Fetch XLM balance from Stellar Horizon Testnet
 */

const HORIZON_URL = 'https://horizon-testnet.stellar.org';

/**
 * Fetch the native (XLM) balance for a given Stellar public key.
 * @param {string} publicKey — Stellar G-address
 * @returns {Promise<string>} raw balance string (e.g. "10000.0000000")
 * @throws {Error} if account not found or network error
 */
export async function fetchXLMBalance(publicKey) {
  const url = `${HORIZON_URL}/accounts/${encodeURIComponent(publicKey)}`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (res.status === 404) {
    throw new Error(
      'Account not found on Stellar Testnet. Fund it via Friendbot first.'
    );
  }

  if (!res.ok) {
    throw new Error(`Horizon error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const nativeBalance = data.balances?.find((b) => b.asset_type === 'native');

  if (!nativeBalance) {
    throw new Error('No native XLM balance found for this account.');
  }

  return nativeBalance.balance;
}
