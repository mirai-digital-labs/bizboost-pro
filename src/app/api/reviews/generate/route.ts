import { NextRequest, NextResponse } from 'next/server';
import { generateReviewVariations } from '@/lib/gemini';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, rating, language = 'en', aspects = [] } = body;

    // Validate input
    if (!businessId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid input. Business ID and rating (1-5) are required.' },
        { status: 400 }
      );
    }

    // Get business info
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { name: true, category: true },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check usage limits
    const subscription = await prisma.subscription.findFirst({
      where: { userId: (await prisma.business.findUnique({ where: { id: businessId } }))?.userId },
    });

    // For now, allow generation (in production, check limits)
    // const limits = getPlanLimits(subscription?.plan || 'STARTER');
    // if (subscription && subscription.reviewsUsed >= limits.reviewsPerMonth) {
    //   return NextResponse.json({ error: 'Monthly review limit reached' }, { status: 403 });
    // }

    // Generate AI review drafts
    const drafts = await generateReviewVariations({
      rating,
      aspects,
      language,
      businessName: business.name || undefined,
      businessType: business.category || undefined,
    });

    // Increment usage count
    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { reviewsUsed: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      drafts,
    });
  } catch (error) {
    console.error('Error generating review:', error);
    return NextResponse.json(
      { error: 'Failed to generate review. Please try again.' },
      { status: 500 }
    );
  }
}
