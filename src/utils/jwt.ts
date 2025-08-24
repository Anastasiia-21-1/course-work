import jwt from 'jsonwebtoken';
import { env } from './env.mjs';

const JWT_SECRET = {
  type: env.HASURA_JWT_SECRET_TYPE || "HS256",
  key:
    env.HASURA_JWT_SECRET_KEY ||
    "your-secret-key-change-in-production",
};

const JWT_CONFIG = {
  expiresIn: "7d" as const,
  algorithm: JWT_SECRET.type as "HS256" | "RS512",
};

export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET.key, JWT_CONFIG);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET.key, { algorithms: [JWT_CONFIG.algorithm] });
  } catch (error) {
    throw new Error('Invalid token');
  }
}
