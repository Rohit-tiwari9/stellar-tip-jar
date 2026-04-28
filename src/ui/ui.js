/**
 * ui.js — All DOM read/write operations
 *
 * This module owns every UI state transition.
 * No business logic here — only presentation.
 */

import { truncateAddress, formatXLM } from '../utils/helpers.js';

// ── Element refs ─────────────────────────────────────────────────────────────

const connectScreen = document.getElementById('connect-screen');
const dashboard = document.getElementById('dashboard');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const noFreighterBanner = document.getElementById('no-freighter-banner');

const walletAddrEl = document.getElementById('wallet-addr');
const balanceDisplayEl = document.getElementById('balance-display');
const refreshBtn = document.getElementById('refresh-btn');

const recipientInput = document.getElementById('recipient');
const amountInput = document.getElementById('amount');
const sendBtn = document.getElementById('send-btn');
const txFeedback = document.getElementById('tx-feedback');

// ── Exported UI functions ─────────────────────────────────────────────────────

/**
 * Show the "Freighter not installed" banner and disable the connect button.
 */
export function showNoFreighterBanner() {
  noFreighterBanner.style.display = 'block';
  connectBtn.disabled = true;
  connectBtn.textContent = 'Freighter Not Detected';
}

/**
 * Switch from connect screen → dashboard.
 * @param {string} address — full Stellar public key
 */
export function showDashboard(address) {
  connectScreen.style.display = 'none';
  dashboard.style.display = 'block';
  walletAddrEl.textContent = truncateAddress(address);
  walletAddrEl.title = address;
}

/**
 * Switch from dashboard → connect screen.
 */
export function showConnectScreen() {
  dashboard.style.display = 'none';
  connectScreen.style.display = 'block';
  connectBtn.disabled = false;
  connectBtn.textContent = 'Connect Freighter Wallet';
  clearFeedback();
  recipientInput.value = '';
  amountInput.value = '';
}

/**
 * Render the XLM balance.
 * @param {string} raw — raw balance string from Horizon
 */
export function renderBalance(raw) {
  balanceDisplayEl.textContent = formatXLM(raw);
}

/**
 * Put the balance display into a loading/spinning state.
 */
export function setBalanceLoading() {
  balanceDisplayEl.textContent = '—';
}

/**
 * Set the connect button into a loading state.
 * @param {boolean} loading
 */
export function setConnectLoading(loading) {
  if (loading) {
    connectBtn.disabled = true;
    connectBtn.innerHTML = '<span class="btn-spinner"></span> Connecting...';
  } else {
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect Freighter Wallet';
  }
}

/**
 * Set the send button into a loading state.
 * @param {boolean} loading
 * @param {string}  [label]
 */
export function setSendLoading(loading, label = 'Signing...') {
  if (loading) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = `<span class="btn-spinner"></span> ${label}`;
  } else {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send XLM';
  }
}

/**
 * Toggle the refresh button spinning animation.
 * @param {boolean} spinning
 */
export function setRefreshSpinning(spinning) {
  refreshBtn.classList.toggle('spinning', spinning);
}

/**
 * Display a success feedback block with the transaction hash.
 * @param {string} hash
 */
export function showSuccessFeedback(hash) {
  txFeedback.className = 'success';
  txFeedback.innerHTML = `
    <strong>Transaction successful</strong>
    <span>Hash: </span><span class="tx-hash">${hash}</span>
  `;
  txFeedback.style.display = 'block';
}

/**
 * Display an error feedback block.
 * @param {string} message
 */
export function showErrorFeedback(message) {
  txFeedback.className = 'error';
  txFeedback.innerHTML = `<strong>Transaction failed</strong><span class="tx-hash">${message}</span>`;
  txFeedback.style.display = 'block';
}

/**
 * Hide and clear the feedback block.
 */
export function clearFeedback() {
  txFeedback.style.display = 'none';
  txFeedback.className = '';
  txFeedback.innerHTML = '';
}

/**
 * Read and return the current form values.
 * @returns {{ recipient: string, amount: string }}
 */
export function getFormValues() {
  return {
    recipient: recipientInput.value.trim(),
    amount: amountInput.value.trim(),
  };
}

/**
 * Clear the send form inputs.
 */
export function clearForm() {
  recipientInput.value = '';
  amountInput.value = '';
}

/**
 * Bind click handlers for interactive elements.
 * @param {Object} handlers
 * @param {Function} handlers.onConnect
 * @param {Function} handlers.onDisconnect
 * @param {Function} handlers.onRefresh
 * @param {Function} handlers.onSend
 */
export function bindEvents({ onConnect, onDisconnect, onRefresh, onSend }) {
  connectBtn.addEventListener('click', onConnect);
  disconnectBtn.addEventListener('click', onDisconnect);
  refreshBtn.addEventListener('click', onRefresh);
  sendBtn.addEventListener('click', onSend);
}
