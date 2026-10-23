/**
 * Builds the request a bespoke registration form sends to the client's Google
 * Apps Script.
 *
 * The script's contract (its code was shared by EBM on 23 Oct 2026):
 * - it reads `e.parameter`, so the body is form-encoded, never JSON — JSON
 *   would also trigger a CORS preflight that Apps Script cannot answer;
 * - `targetSheet` picks the tab, and a missing one silently means "Sheet1";
 * - every header cell in row 1 is filled from the field of the same name, so
 *   field names are a contract, not a preference;
 * - it stamps `Timestamp` itself but leaves `registerTime` to the form;
 * - it answers HTTP 200 either way, with `{ result: 'success' | 'error' }`.
 */

export const REGISTRATION_FIELDS = [
  'company',
  'firstName',
  'lastName',
  'designation',
  'city',
  'country',
  'email',
  'number',
] as const

export type RegistrationField = (typeof REGISTRATION_FIELDS)[number]
export type RegistrationValues = Record<RegistrationField, string>

const MAX_LENGTH = 200

/**
 * Makes a value safe to land in a Google Sheet cell.
 *
 * Sheets reads a cell that starts with `=`, `+`, `-` or `@` as a formula — so a
 * registrant could plant one — and turns `+91…` into a number, dropping the
 * plus. A leading apostrophe stores the text exactly as typed and is not shown.
 */
export function sheetSafe(value: string): string {
  const v = value.replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH)
  return /^[=+\-@]/.test(v) ? `'${v}` : v
}

/**
 * Digits only, with a leading + kept when it was typed. 7 to 15 digits, the
 * range of real phone numbers (E.164). Returns null when it is not a number.
 */
export function normalisePhone(raw: string): string | null {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) return null
  if (/[^\d\s()+\-.]/.test(trimmed)) return null
  return trimmed.startsWith('+') ? `+${digits}` : digits
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Field-level checks. Returns a message per invalid field, in form order. */
export function validateRegistration(values: RegistrationValues): Partial<Record<RegistrationField, string>> {
  const errors: Partial<Record<RegistrationField, string>> = {}
  const need = (field: RegistrationField, label: string) => {
    if (values[field].trim().length < 2) errors[field] = `Enter your ${label}.`
  }
  need('firstName', 'first name')
  need('lastName', 'last name')
  need('company', 'company name')
  need('designation', 'designation')
  need('city', 'city')
  need('country', 'country')
  if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email address, like name@company.com.'
  if (!normalisePhone(values.number)) {
    errors.number = 'Enter a valid phone number, 7 to 15 digits. You can start with + and the country code.'
  }
  return errors
}

/** "2026-10-23 15:42:10" in IST, the stamp format EBM's sheets already use. */
export function istStamp(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`
}

/**
 * The body to POST. Only the sheet's own columns plus `targetSheet` — nothing
 * else, so no stray value can end up in someone else's column.
 */
export function buildRegistrationBody(
  values: RegistrationValues,
  targetSheet: string,
  now: Date = new Date(),
): URLSearchParams {
  const body = new URLSearchParams()
  body.set('targetSheet', targetSheet)
  for (const field of REGISTRATION_FIELDS) {
    const raw = field === 'number' ? (normalisePhone(values.number) ?? values.number) : values[field]
    body.set(field, sheetSafe(raw))
  }
  body.set('registerTime', istStamp(now))
  return body
}

/** True only when the script says it wrote the row. */
export function isRecorded(response: unknown): boolean {
  return (
    typeof response === 'object' &&
    response !== null &&
    (response as { result?: unknown }).result === 'success'
  )
}
