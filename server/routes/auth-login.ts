import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default async function authLogin(req: Request, res: Response, prisma: PrismaClient) {
  const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    try {
      console.log('email:', email);
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Set the JWT as a secure HTTP-only cookie
      res.cookie('jwt', token, {
        httpOnly: true,  // Prevent client-side JS from accessing it
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: 'lax', // Protect against CSRF
      });
      res.json({ message: 'login successful' }).status(200);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
}