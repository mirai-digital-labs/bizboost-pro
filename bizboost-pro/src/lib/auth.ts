import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import prisma from './db';
import { findFallbackUserByEmail } from './fallbackUsers';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const email = credentials.email.toLowerCase().trim();

        // 1. Try finding in database
        let user: any = null;
        try {
          user = await prisma.user.findUnique({
            where: { email },
            include: { subscription: true },
          });
        } catch (dbErr) {
          console.warn('Prisma DB lookup skipped/failed, falling back to local user store:', dbErr);
        }

        // 2. If not found in DB or DB offline, check fallback user store
        if (!user) {
          user = findFallbackUserByEmail(email);
        }

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || email.split('@')[0],
          role: user.role || 'USER',
          subscription: user.subscription || { plan: 'STARTER', status: 'ACTIVE' },
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/signup',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // @ts-ignore
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.subscription = user.subscription;
      }
      
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string;
        // @ts-ignore
        session.user.subscription = token.subscription as any;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'bizboost-pro-secure-auth-secret-key-prod-2026',
};

export default NextAuth(authOptions);
