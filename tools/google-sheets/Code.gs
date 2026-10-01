/**
 * RSVP → Google Sheets bridge for the wedding invitation.
 *
 * 1. Create a Google Sheet, then Extensions → Apps Script and paste this file.
 * 2. HOST_KEY is already set to the host passcode; change it if this file is ever shared.
 * 3. Deploy → New deployment → Web app.
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Copy the Web app URL into `wedding.rsvp.endpoint` in src/data/weddingData.js.
 *
 * The sheet itself stays private: nothing on the site needs link sharing, and
 * the analytics data only leaves this script when the passcode matches.
 */

const SHEET_NAME = 'rsvps';
const HEADERS = ['name', 'contact', 'attendance', 'guests', 'message', 'at'];
// Opens /analytics and authorises its "Clear all". Keep it here, in the script —
// anywhere in the site's JavaScript and the guest list is public.
const HOST_KEY = 'TNAutomation123!';

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse((e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return out({ ok: false, error: 'Malformed request body.' });
  }

  if (body.action === 'clear') {
    if (body.key !== HOST_KEY) return out({ ok: false, error: 'Wrong passcode.' });
    var blank = sheet_();
    if (blank.getLastRow() > 1) blank.deleteRows(2, blank.getLastRow() - 1);
    return out({ ok: true, cleared: true });
  }

  if (!String(body.name || '').trim() || !String(body.contact || '').trim()) {
    return out({ ok: false, error: 'A name and a way to reach you are both required.' });
  }

  var target = sheet_();
  var row = [
    String(body.name).trim(),
    String(body.contact).trim(),
    body.attendance === 'decline' ? 'decline' : 'accept',
    Number(body.guests) || 1,
    String(body.message || '').trim(),
    new Date().toISOString(),
  ];

  // Re-submitting with the same contact edits that guest's row instead of
  // counting them twice.
  var existing = findRow_(target, row[1]);
  if (existing) {
    target.getRange(existing, 1, 1, HEADERS.length).setValues([row]);
  } else {
    target.appendRow(row);
  }

  return out({ ok: true, updated: Boolean(existing) });
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.key !== HOST_KEY) return out({ ok: false, error: 'Wrong passcode.' });

  var values = sheet_().getDataRange().getValues();
  var head = values.shift().map(String);
  var rows = values
    .filter(function (r) { return String(r[0]).trim(); })
    .map(function (r) {
      var row = {};
      head.forEach(function (header, i) {
        row[header] = r[i];
      });
      return row;
    });

  return out({ ok: true, rows: rows });
}

function sheet_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function findRow_(sheet, contact) {
  if (sheet.getLastRow() < 2) return 0;
  var column = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < column.length; i += 1) {
    if (String(column[i][0]).trim().toLowerCase() === contact.toLowerCase()) return i + 2;
  }
  return 0;
}

function out(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
