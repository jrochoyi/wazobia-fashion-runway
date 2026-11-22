
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'wazobia-admin';
const SESSION_DURATION = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters');
  }
  return secret;
}

function sign(value: string) {
  return createHmac('sha256', getSecret())
    .update(value)
    .digest('hex');
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function isAdminSessionValid(token?: string | null) {
  if (!token) return false;

  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature) return false;

  const expiry = Number(expiresAt);
  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = sign(expiresAt);

  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;

  return timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex')
  );
}

export { COOKIE_NAME, SESSION_DURATION };
