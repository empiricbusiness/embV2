/**
 * EBM website forms -> this Google Sheet.
 *
 * Paste into Extensions -> Apps Script of the spreadsheet, then
 * Deploy -> New deployment -> Web app, Execute as: Me, Who has access: Anyone.
 * The web app URL (ending in /exec) is the site's form endpoint.
 *
 * Every form on the site posts FormData here. Its hidden `form` field names the
 * tab the row goes to, created on first use. Row 1 of each tab lists the field
 * names; a field the tab has not seen before becomes a new column, so a form can
 * gain a field without anyone editing this script.
 */
const HONEYPOT = 'company_website' // hidden field that only bots fill in
const SKIP = ['form', HONEYPOT]

function doPost(e) {
  const p = (e && e.parameter) || {}
  if (p[HONEYPOT]) return reply({ ok: true }) // a bot: pretend success, store nothing

  const lock = LockService.getScriptLock()
  lock.waitLock(20000) // two submissions at once must not overwrite each other's row
  try {
    const tab = String(p.form || 'Website').slice(0, 90)
    const book = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = book.getSheetByName(tab) || book.insertSheet(tab)

    const width = sheet.getLastColumn()
    const headers = width ? sheet.getRange(1, 1, 1, width).getValues()[0] : ['Submitted at']
    for (const key of Object.keys(p)) {
      if (!SKIP.includes(key) && !headers.includes(key)) headers.push(key)
    }
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold')
    sheet.setFrozenRows(1)

    sheet.appendRow(headers.map((h) => (h === 'Submitted at' ? new Date() : clean(p[h]))))
    return reply({ ok: true })
  } catch (err) {
    return reply({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

// Opening the URL in a browser answers this, so a deployment can be checked
// without writing a row.
function doGet() {
  return reply({ ok: true, service: 'EBM website forms' })
}

// Text starting with = + - or @ would run as a spreadsheet formula. The leading
// apostrophe keeps it as text and does not show in the cell.
function clean(value) {
  const s = value == null ? '' : String(value).slice(0, 5000)
  return /^[=+\-@]/.test(s) ? "'" + s : s
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}
