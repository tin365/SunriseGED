import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'super_admin' | 'editor' | 'viewer';
  sessionId: string;
  kind?: 'session' | 'pre_2fa';
}

const encoder = new TextEncoder();

function key(secret: string) {
  return encoder.encode(secret);
}

export async function signToken(secret: string, payload: JwtPayload, ttlSeconds: number) {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(key(secret));
}

export async function verifyToken(secret: string, token: string) {
  const { payload } = await jwtVerify(token, key(secret));
  return payload as unknown as JwtPayload & { iat: number; exp: number };
}

export async function sha256(input: string) {
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function createId(prefix = '') {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const id = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return prefix ? `${prefix}_${id}` : id;
}
