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

    // Get business info (optional/graceful fallback)
    let business = null;
    try {
      business = await prisma.business.findUnique({
        where: { id: businessId },
        select: { name: true, category: true, userId: true },
      });
    } catch (e) {
      console.warn('Could not query business for review generation:', e);
    }

    const businessName = business?.name || (businessId === 'demo' ? 'Royal Spice Lounge' : 'Your Business');
    const businessType = business?.category || 'Restaurant & Cafe';

    // Generate AI review drafts
    const drafts = await generateReviewVariations({
      rating,
      aspects,
      language,
      businessName,
      businessType,
    });

    // Try to increment usage count if subscription exists
    try {
      if (business?.userId) {
        const subscription = await prisma.subscription.findFirst({
          where: { userId: business.userId },
        });
        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { reviewsUsed: { increment: 1 } },
          });
        }
      }
    } catch (subErr) {
      console.warn('Could not update subscription usage:', subErr);
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
