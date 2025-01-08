
import { env } from 'envValidator';
import jwt from 'jsonwebtoken';

export const signToken = (payload: object, expiresIn = '1h') => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};