/**
 * helpers.js — Shared utility functions
 */

/**
 * Truncate a Stellar public key for display.
 * e.g. GABC...XYZ  (first 6 + last 6 chars)
 * @param {string} address
 * @param {number} [head=6]
 * @param {number} [tail=6]
 * @returns {string}
 */
export function truncateAddress(address, head = 6, tail = 6) {
  if (!address || address.length <= head + tail) {
    return address ?? '';
  }
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

/**
 * Format a raw XLM balance string to a fixed decimal display value.
 * @param {string|number} raw  — raw balance from Horizon (e.g. "9999.9999900")
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatXLM(raw, decimals = 2) {
  const n = parseFloat(raw);
  if (isNaN(n)) {
    return '0.00';
  }
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Basic Stellar G-address validation (starts with G, 56 chars, alphanumeric).
 * @param {string} address
 * @returns {boolean}
 */
export function isValidStellarAddress(address) {
  return typeof address === 'string' && /^G[A-Z0-9]{55}$/.test(address);
}

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
