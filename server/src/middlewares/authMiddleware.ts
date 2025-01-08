import { verifyToken } from '@utils/jwt';
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';


declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }

export const authenticateJWT = (req: Request, res: Response,
 next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const user = verifyToken(token);
    req.user = user as User;
    next();
  } catch {
    res.sendStatus(403);
  }
};