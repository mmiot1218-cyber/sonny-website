/**
 * HK Watchlist Apps Script
 * Reads the "HK Watchlist" tab from the Portfolio Watchlist sheet
 * and returns stock data as JSON for the hk-watchlist.html page.
 *
 * DEPLOY STEPS:
 * 1. Open https://script.google.com
 * 2. + New Project → paste this code
 * 3. Save (File → Save, name it "HK Watchlist API")
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL and paste into hk-watchlist.html
 *    → const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
 */

const SHEET_ID = '1DrIel3QIcR6dUqFFgQDwmlh-vCQISukyD-l_BS55q6M';
const TAB_NAME  = 'HK Watchlist';

// Column indices (0-based) in the sheet
const COL_TICKER = 0;  // A
const COL_NAME   = 1;  // B
const COL_PRICE  = 2;  // C
const COL_CHANGE = 3;  // D
const COL_BF     = 7;  // H  D-0 BF
const COL_WR     = 8;  // I  D-0 WR
const COL_TF     = 9;  // J  D-0 TF

function doGet(request) {
  const output = fetchHkWatchlist();
  return ContentService
    .createTextOutput(JSON.stringify(output), 'application/json')
    .setMimeType(ContentService.MimeType.JSON);
}

function fetchHkWatchlist() {
  const ss  = SpreadsheetApp.openById(SHEET_ID);
  const sh  = ss.getSheetByName(TAB_NAME);
  const rows = sh.getDataRange().getValues();

  // Skip header row
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const row  = rows[i];
    const tick = String(row[COL_TICKER] || '').trim();
    if (!tick) continue;  // skip empty rows

    result.push({
      ticker: tick,
      name:   String(row[COL_NAME]   || '').trim(),
      price:  String(row[COL_PRICE]  || '').trim(),
      change: String(row[COL_CHANGE] || '').trim(),
      bf:     Number(row[COL_BF]) || 0,
      wr:     Number(row[COL_WR]) || 0,
      tf:     Number(row[COL_TF]) || 0,
    });
  }
  return result;
}

// Manual test helper (run this to verify it works)
function testFetch() {
  const data = fetchHkWatchlist();
  Logger.log('Stocks fetched: ' + data.length);
  data.forEach(s => Logger.log(JSON.stringify(s)));
}