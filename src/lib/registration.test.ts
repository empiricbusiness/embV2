import assert from 'node:assert/strict'
import test from 'node:test'
import {
  REGISTRATION_FIELDS,
  buildRegistrationBody,
  isRecorded,
  istStamp,
  normalisePhone,
  sheetSafe,
  validateRegistration,
  type RegistrationValues,
} from '@/lib/registration'

const valid: RegistrationValues = {
  company: 'Acme Industries',
  firstName: 'Asha',
  lastName: 'Rao',
  designation: 'CFO',
  city: 'Mumbai',
  country: 'India',
  email: 'asha.rao@acme.in',
  number: '+91 98765 43210',
}

test('sheetSafe stops a value being read as a formula', () => {
  assert.equal(sheetSafe('=IMPORTXML("http://x","//a")'), `'=IMPORTXML("http://x","//a")`)
  assert.equal(sheetSafe('@SUM(A1)'), "'@SUM(A1)")
  assert.equal(sheetSafe('-1+1'), "'-1+1")
})

test('sheetSafe keeps the plus on a phone number', () => {
  assert.equal(sheetSafe('+919876543210'), "'+919876543210")
})

test('sheetSafe leaves ordinary text alone, tidied', () => {
  assert.equal(sheetSafe('  Acme   Industries '), 'Acme Industries')
  assert.equal(sheetSafe('x'.repeat(250)).length, 200)
})

test('normalisePhone accepts the ways people type numbers', () => {
  assert.equal(normalisePhone('98765 43210'), '9876543210')
  assert.equal(normalisePhone('+91 98765-43210'), '+919876543210')
  assert.equal(normalisePhone('(022) 2640 0000'), '02226400000')
})

test('normalisePhone rejects what is not a phone number', () => {
  assert.equal(normalisePhone('12345'), null)
  assert.equal(normalisePhone('9876543210 ext abc'), null)
  assert.equal(normalisePhone('1'.repeat(16)), null)
})

test('validateRegistration passes a complete entry', () => {
  assert.deepEqual(validateRegistration(valid), {})
})

test('validateRegistration names each bad field', () => {
  const errors = validateRegistration({ ...valid, firstName: ' ', email: 'asha@', number: '12' })
  assert.deepEqual(Object.keys(errors), ['firstName', 'email', 'number'])
})

test('istStamp is IST in the sheet format', () => {
  assert.equal(istStamp(new Date('2026-10-23T10:12:13Z')), '2026-10-23 15:42:13')
  assert.equal(istStamp(new Date('2026-10-27T18:30:00Z')), '2026-10-28 00:00:00')
})

test('the body carries the tab, the sheet columns and the IST time, nothing else', () => {
  const body = buildRegistrationBody(valid, 'News18', new Date('2026-10-23T10:12:13Z'))
  assert.deepEqual(
    [...body.keys()].sort(),
    ['targetSheet', 'registerTime', ...REGISTRATION_FIELDS].sort(),
  )
  assert.equal(body.get('targetSheet'), 'News18')
  assert.equal(body.get('registerTime'), '2026-10-23 15:42:13')
  assert.equal(body.get('number'), "'+919876543210")
  assert.equal(body.get('Timestamp'), null, 'the script stamps Timestamp itself')
})

test('only the script saying success counts as recorded', () => {
  assert.equal(isRecorded({ result: 'success', sheet: 'News18', row: 7 }), true)
  assert.equal(isRecorded({ result: 'error', error: 'Sheet "x" not found.' }), false)
  assert.equal(isRecorded(null), false)
  assert.equal(isRecorded('ok'), false)
})
