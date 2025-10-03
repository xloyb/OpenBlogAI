// authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import prisma from "@src/utils/client";
import { JwtPayload, verifyAccessToken } from "@utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`[AUTH] ${req.method} ${req.path} - checking authentication`);
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(`[AUTH] Token: ${token ? token.substring(0, 20) + "..." : "none"}`);

  if (!token) {
    console.log(`[AUTH] No token provided, returning 401`);
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    // Verify user status in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isAdmin: true, isBlocked: true }
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({ error: "Account is blocked" });
      return;
    }

    // Attach fresh user status to request
    req.user = {
      userId: user.id,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// authorizeAdmin remains the same
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
};