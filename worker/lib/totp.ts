import * as OTPAuth from 'otpauth';

export function createTotp(email: string, secret?: string) {
  return new OTPAuth.TOTP({
    issuer: 'Sunrise GED',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret ? OTPAuth.Secret.fromBase32(secret) : new OTPAuth.Secret({ size: 20 })
  });
}

export function generateTotpSecret(email: string) {
  const totp = createTotp(email);
  return {
    secret: totp.secret.base32,
    uri: totp.toString()
  };
}

export function verifyTotp(email: string, secret: string, token: string) {
  const totp = createTotp(email, secret);
  return totp.validate({ token, window: 1 }) !== null;
}
