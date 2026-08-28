/**
 * RanchAssist™ Stocking Rate Calculator
 * Google Apps Script backend
 * Tool ID: stocking-rate-calculator
 * Version: 1.0.0
 *
 * User project data is not persisted server-side. This backend is used only
 * to serve the web app and, when explicitly requested, send an email summary.
 */

const RA_TOOL = Object.freeze({
  id: 'stocking-rate-calculator',
  name: 'Stocking Rate Calculator',
  version: '1.0.0'
});

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Stocking Rate Calculator | RanchAssist')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/**
 * Sends a user-requested stocking-rate summary.
 * No API keys or user project data are stored.
 */
function shareStockingRateSummary(payload) {
  payload = payload || {};
  const recipient = String(payload.recipient || '').trim();
  const subject = String(payload.subject || 'RanchAssist Stocking Rate Summary').trim().slice(0, 160);
  const summary = String(payload.summary || '').slice(0, 30000);
  const note = String(payload.note || '').slice(0, 5000);
  const timestamp = String(payload.timestamp || '');

  if (!isValidEmail_(recipient)) {
    throw new Error('Enter a valid email address.');
  }
  if (!summary) {
    throw new Error('There is no calculation summary to send.');
  }

  const safeSubject = subject || 'RanchAssist Stocking Rate Summary';
  const plainBody = [
    'RanchAssist™ Stocking Rate Calculator',
    '',
    note ? note + '\n' : '',
    summary,
    '',
    timestamp ? 'Generated: ' + timestamp : '',
    '',
    'Planning estimate only. Local forage conditions and professional/local guidance should govern real stocking decisions.'
  ].filter(Boolean).join('\n');

  const htmlBody = [
    '<div style="font-family:Arial,sans-serif;color:#171715;max-width:720px;margin:auto">',
      '<div style="border-bottom:1px solid #deded8;padding:0 0 16px;margin-bottom:20px">',
        '<div style="font-size:12px;letter-spacing:.08em;color:#666660">RANCHASSIST™</div>',
        '<h1 style="font-size:24px;margin:6px 0 0">Stocking Rate Calculator</h1>',
      '</div>',
      note ? '<p style="font-size:15px;line-height:1.6">' + escapeHtml_(note) + '</p>' : '',
      '<pre style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px;line-height:1.55;background:#f7f7f4;border:1px solid #deded8;border-radius:8px;padding:16px">' + escapeHtml_(summary) + '</pre>',
      timestamp ? '<p style="font-size:12px;color:#666660">Generated: ' + escapeHtml_(timestamp) + '</p>' : '',
      '<p style="font-size:12px;color:#666660;border-top:1px solid #deded8;padding-top:16px;margin-top:20px">Planning estimate only. Local forage conditions and professional/local guidance should govern real stocking decisions.</p>',
    '</div>'
  ].join('');

  MailApp.sendEmail({
    to: recipient,
    subject: safeSubject,
    body: plainBody,
    htmlBody: htmlBody,
    name: 'RanchAssist'
  });

  return { ok: true, message: 'Email sent.' };
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
