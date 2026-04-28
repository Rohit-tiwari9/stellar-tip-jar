/**
 * wallet.js — Freighter wallet integration layer
 * Handles detection, connect, and signing
 */

const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';

/**
 * Detect if Freighter is installed
 */
export function isFreighterInstalled() {
  return (
    typeof window !== "undefined" &&
    (window.freighterApi || window.freighter)
  );
}

/**
 * Get Freighter instance safely
 */
function getFreighter() {
  const freighter = window.freighterApi || window.freighter;

  if (!freighter) {
    throw new Error("Freighter wallet not found");
  }

  return freighter;
}

/**
 * Connect wallet and return public key
 */
export async function connectWallet() {
  if (!isFreighterInstalled()) {
    throw new Error("Freighter wallet is not installed.");
  }

  const freighter = getFreighter();

  // Step 1: Request connection
  const connection = await freighter.isConnected();

  if (!connection.isConnected) {
    await freighter.setAllowed();
  }

  // Step 2: Ensure Testnet
  try {
    const networkDetails = await freighter.getNetworkDetails();

    if (!networkDetails.networkUrl?.includes("testnet")) {
      await freighter.setNetwork("TESTNET");
    }
  } catch (err) {
    console.warn("Network switch skipped:", err);
  }

  // Step 3: Get public key
  const result = await freighter.getPublicKey();

  const publicKey =
    typeof result === "string" ? result : result?.publicKey;

  if (!publicKey) {
    throw new Error("Failed to retrieve wallet address.");
  }

  return publicKey;
}

/**
 * Sign transaction XDR
 */
export async function signTransaction(xdr) {
  if (!isFreighterInstalled()) {
    throw new Error("Freighter wallet is not installed.");
  }

  const freighter = getFreighter();

  const signed = await freighter.signTransaction(xdr, {
    networkPassphrase: TESTNET_PASSPHRASE,
  });

  return typeof signed === "string"
    ? signed
    : signed?.signedTxXdr;
}