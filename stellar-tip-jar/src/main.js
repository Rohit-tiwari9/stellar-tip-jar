/**
 * main.js — App controller
 *
 * Orchestrates wallet, balance, transaction, and UI modules.
 * No DOM manipulation here — delegates everything to ui.js.
 */

import { isFreighterInstalled, connectWallet } from './wallet/wallet.js';
import { fetchXLMBalance } from './services/balance.js';
import { sendXLMPayment, parseTxError } from './services/transaction.js';
import { isValidStellarAddress } from './utils/helpers.js';
import {
  bindEvents,
  showNoFreighterBanner,
  showDashboard,
  showConnectScreen,
  renderBalance,
  setBalanceLoading,
  setConnectLoading,
  setSendLoading,
  setRefreshSpinning,
  showSuccessFeedback,
  showErrorFeedback,
  clearFeedback,
  getFormValues,
  clearForm,
} from './ui/ui.js';

// ── App state ─────────────────────────────────────────────────────────────────

let connectedAddress = null;

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleConnect() {
  setConnectLoading(true);
  try {
    const address = await connectWallet();
    connectedAddress = address;
    showDashboard(address);
    await loadBalance();
  } catch (err) {
    console.error('[Wallet] Connection failed:', err);
    setConnectLoading(false);
    // Surface error in the feedback block (re-use it on connect screen)
    showErrorFeedback(err.message ?? 'Wallet connection failed.');
    document.getElementById('tx-feedback').style.display = 'block';
  }
}

function handleDisconnect() {
  connectedAddress = null;
  showConnectScreen();
}

async function handleRefresh() {
  if (!connectedAddress) {
    return;
  }
  setRefreshSpinning(true);
  setBalanceLoading();
  try {
    const balance = await fetchXLMBalance(connectedAddress);
    renderBalance(balance);
  } catch (err) {
    console.error('[Balance] Refresh failed:', err);
    document.getElementById('balance-display').textContent = 'Error';
  } finally {
    setRefreshSpinning(false);
  }
}

async function handleSend() {
  if (!connectedAddress) {
    return;
  }

  clearFeedback();
  const { recipient, amount } = getFormValues();

  // — Validation —
  if (!recipient) {
    showErrorFeedback('Please enter a recipient address.');
    return;
  }

  if (!isValidStellarAddress(recipient)) {
    showErrorFeedback('Invalid Stellar address. It must start with G and be 56 characters.');
    return;
  }

  if (recipient === connectedAddress) {
    showErrorFeedback('You cannot send XLM to yourself.');
    return;
  }

  if (!amount) {
    showErrorFeedback('Please enter an amount to send.');
    return;
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    showErrorFeedback('Amount must be a positive number.');
    return;
  }

  // — Transaction flow —
  setSendLoading(true, 'Signing...');

  try {
    const result = await sendXLMPayment(connectedAddress, recipient, amount);

    setSendLoading(false);
    showSuccessFeedback(result.hash);
    clearForm();

    // Refresh balance after successful send
    await loadBalance();
  } catch (err) {
    console.error('[Transaction] Failed:', err);
    setSendLoading(false);
    showErrorFeedback(parseTxError(err));
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function loadBalance() {
  if (!connectedAddress) {
    return;
  }
  setRefreshSpinning(true);
  setBalanceLoading();
  try {
    const balance = await fetchXLMBalance(connectedAddress);
    renderBalance(balance);
  } catch (err) {
    console.error('[Balance] Load failed:', err);
    document.getElementById('balance-display').textContent = 'N/A';
  } finally {
    setRefreshSpinning(false);
  }
}

function init() {
  // Bind all UI event handlers
  bindEvents({
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onRefresh: handleRefresh,
    onSend: handleSend,
  });

  // Check if Freighter is installed on page load
  if (!isFreighterInstalled()) {
    showNoFreighterBanner();
  }

  console.log('[Stellar Tip Jar] Initialized on Testnet');
}

// Boot
init();
