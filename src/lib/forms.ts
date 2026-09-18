/**
 * Every site form posts FormData to this Google Apps Script web app, which writes
 * each submission to the "EBM Website Forms" Google Sheet on the
 * tech@empiricbusinessmedia.com account (script: scripts/google-sheets-forms.gs).
 * A form's hidden `form` field names the Sheet tab it lands in.
 *
 * Post FormData, never JSON: a JSON body triggers a CORS preflight that Apps
 * Script cannot answer. NEXT_PUBLIC_FORM_ENDPOINT overrides the URL without a
 * code change — redeploying the script as a new deployment changes it.
 */
export const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbxAPDNzuSnkDwW-mFKuOPcFPj-wYNOGdXS2moKEaQGIVw8h9Fi0VluskVtt28ZFG4Hr/exec'
