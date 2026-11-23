import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { isValidEmail } from '@/lib/utils';
import { findFallbackUserByEmail, saveFallbackUser } from '@/lib/fallbackUsers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone, country } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user exists (check Prisma first, then fallback)
    let existingUser: any = null;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbCheckErr) {
      console.warn('DB check skipped (no active database connection):', dbCheckErr);
    }

    if (!existingUser) {
      existingUser = findFallbackUserByEmail(email);
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (Prisma if available, otherwise persistent fallback store)
    let user: any = null;
    try {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split('@')[0],
          phone: phone || '',
          country: country || 'PK',
          role: 'USER',
        },
      });

      // Create starter subscription
      try {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: 'STARTER',
            status: 'ACTIVE',
          },
        });
      } catch (subErr) {
        console.warn('Could not create DB subscription:', subErr);
      }
    } catch (dbCreateErr) {
      console.warn('DB create failed, using reliable fallback store:', dbCreateErr);
      user = saveFallbackUser({
        name: name || email.split('@')[0],
        email,
        passwordHash: hashedPassword,
        phone,
        country,
        role: 'USER',
      });
    }

    // Also cache in fallback store for fast retrieval
    try {
      saveFallbackUser({
        name: user.name,
        email: user.email,
        passwordHash: hashedPassword,
        phone,
        country,
        role: user.role,
      });
    } catch (cacheErr) {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
