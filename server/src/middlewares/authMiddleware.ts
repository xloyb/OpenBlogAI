import prisma from "@src/utils/client";
import { verifyToken } from "@utils/jwt";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">; 
    }
  }
}

// export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header("Authorization")?.split(" ")[1];

//   if (!token) return res.status(401).json({ error: "Unauthorized" });

//   try {
//     const tokenRecord = await prisma.refreshToken.findUnique({
//       where: { token },
//     });

//     if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
//       res.status(403).json({ error: "Invalid or revoked token" });
//       return;
//     }

//     const user = verifyToken(token);

//     if (user.isBlocked) {
//       res.status(403).json({ error: "Account is blocked" });
//       return;
//     }

//     req.user = user;
//     next();
//   } catch {
//     res.status(403).json({ error: "Invalid token" });
//     return;
//   }
// };

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return; // Explicit return after response
  }

  try {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
      res.status(403).json({ error: "Invalid or revoked token" });
      return; // Explicit return after response
    }

    const user = verifyToken(token);

    if (user.isBlocked) {
      res.status(403).json({ error: "Account is blocked" });
      return; // Explicit return after response
    }

    req.user = user;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
    return; // Explicit return after response
  }
};


export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};