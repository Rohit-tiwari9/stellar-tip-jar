/**
 * transaction.js — Build, sign, and submit XLM payment transactions
 *
 * Uses the Stellar SDK and Freighter for signing.
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from '../wallet/wallet.js';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

/**
 * @typedef {Object} TxResult
 * @property {boolean} success
 * @property {string}  hash         — transaction hash on success
 * @property {string}  [error]      — error message on failure
 * @property {string}  [errorCode]  — Stellar result code on failure
 */

/**
 * Build, sign, and submit an XLM payment transaction.
 * @param {string} senderAddress   — public key of the sender
 * @param {string} destination     — public key of the recipient
 * @param {string|number} amount   — XLM amount to send (e.g. "10" or 10)
 * @returns {Promise<TxResult>}
 */
export async function sendXLMPayment(senderAddress, destination, amount) {
  const server = new StellarSdk.Horizon.Server(HORIZON_URL, {
    allowHttp: false,
  });

  // 1. Load sender account (sequence number)
  const sourceAccount = await server.loadAccount(senderAddress);

  // 2. Build transaction
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount: parseFloat(amount).toFixed(7),
      })
    )
    .setTimeout(60)
    .build();

  // 3. Sign with Freighter
  const signedXDR = await signTransaction(transaction.toXDR());

  if (!signedXDR) {
    throw new Error('Freighter did not return a signed transaction.');
  }

  // 4. Rebuild from signed XDR & submit
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXDR,
    NETWORK_PASSPHRASE
  );

  const result = await server.submitTransaction(signedTx);

  return {
    success: true,
    hash: result.hash,
  };
}

/**
 * Extract a human-readable error message from a Stellar Horizon submission error.
 * @param {unknown} err
 * @returns {string}
 */
export function parseTxError(err) {
  // Horizon API error with extras.result_codes
  if (err?.response?.data?.extras?.result_codes) {
    const codes = err.response.data.extras.result_codes;
    const opCode = codes.operations?.[0];

    const opMessages = {
      op_underfunded: 'Insufficient XLM balance.',
      op_no_destination: 'Recipient account does not exist on Testnet.',
      op_low_reserve: 'Recipient account needs a minimum XLM reserve.',
      op_bad_auth: 'Authorization failed.',
    };

    if (opCode && opMessages[opCode]) {
      return opMessages[opCode];
    }

    return `Transaction failed: ${opCode ?? codes.transaction ?? 'unknown error'}`;
  }

  // User cancelled in Freighter
  if (err?.message?.toLowerCase().includes('user declined')) {
    return 'Transaction was cancelled by the user.';
  }

  return err?.message ?? 'An unexpected error occurred.';
}
