import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'fallback-secret-for-mobile-jwt-key'
);

export async function createMobileToken(payload: { userId: string, email: string, role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // Tokens last 30 days
    .sign(secretKey);
}

export async function verifyMobileToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string, email: string, role: string };
  } catch (error) {
    return null;
  }
}
