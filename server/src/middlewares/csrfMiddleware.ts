
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import { Application, Request, Response, NextFunction } from 'express';

const csrfProtection = csrf({ cookie: true });

export const setupCSRF = (app: Application) => {
  app.use(cookieParser());

  // Apply CSRF conditionally
  app.use((req: Request, res: Response, next: NextFunction) => {
    const excludedRoutes = ['/api/auth/login', '/api/auth/register'];

    if (excludedRoutes.includes(req.path)) {
      return next();  // Skip CSRF for login and register
    }

    csrfProtection(req, res, next);
  });

  // Set CSRF token for all non-excluded routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.csrfToken) {
      const token = req.csrfToken();
      res.cookie('XSRF-TOKEN', token, { httpOnly: false, secure: false });
      res.locals.csrfToken = token;
    }
    next();
  });
};