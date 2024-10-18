import { NextFunction, Request, Response } from "express";

const jwt = require('jsonwebtoken');

type jwtUser = {
  userId: string;
  iat: number;
  exp: number;
}

export default function authenticateJWTFromCookie(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt; // Read the JWT from the cookie

  if (!token) {
    req.user = null; // No user context
    return next(); // Allow unauthenticated requests to proceed
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: string, user: jwtUser) => {
    if (err) {
      req.user = null; // Invalid or expired token
      return next();
    }

    req.user = user; // Attach user info to the request
    next(); // Continue to the next middleware
  });
}
