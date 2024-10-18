import { Request, Response } from "express";

export default async function authLogout(req: Request, res: Response) {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
    sameSite: 'lax', // Protect against CSRF
  });
  res.json({ success: true }).status(200);
}