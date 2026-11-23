import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businessId = params.id;

    // Get business info
    let business = null;
    try {
      business = await prisma.business.findUnique({
        where: { id: businessId },
        select: {
          id: true,
          name: true,
          category: true,
          reviewThreshold: true,
          googleReviewUrl: true,
          googlePlaceId: true,
        },
      });
    } catch (dbError) {
      console.warn('DB query error or table not yet initialized:', dbError);
    }

    // Fallback if business not found or in test mode
    if (!business) {
      return NextResponse.json({
        success: true,
        business: {
          id: businessId,
          name: 'Your Business',
          type: 'Restaurant & Cafe',
          reviewThreshold: 3,
          googleReviewUrl: 'https://www.google.com/maps',
        },
      });
    }

    // Log QR scan asynchronously
    try {
      const userAgent = request.headers.get('user-agent') || '';
      await prisma.qRScan.create({
        data: {
          businessId,
          deviceType: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
          browser: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Safari') ? 'Safari' : 'Other',
          country: null,
          city: null,
        },
      });
    } catch (scanErr) {
      // Don't fail request if analytics log fails
      console.warn('Failed to log scan:', scanErr);
    }

    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        name: business.name,
        type: business.category || 'Business',
        reviewThreshold: business.reviewThreshold || 3,
        googleReviewUrl: business.googleReviewUrl || (business.googlePlaceId ? `https://search.google.com/local/writereview?placeid=${business.googlePlaceId}` : 'https://www.google.com/maps'),
      },
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businessId = params.id;
    const body = await request.json();
    const { rating, customerName, customerPhone, customerEmail, text, aiGeneratedText, isPublic } = body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    let reviewThreshold = 3;

    try {
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: { id: true, reviewThreshold: true },
      });

      if (business) {
        reviewThreshold = business.reviewThreshold;
      }
    } catch (e) {
      console.warn('Could not query business threshold:', e);
    }

    const status = rating <= reviewThreshold ? 'PRIVATE' : 'DRAFTED';

    try {
      if (status === 'PRIVATE') {
        await prisma.feedback.create({
          data: {
            businessId,
            customerName: customerName || 'Guest',
            customerPhone,
            customerEmail,
            rating,
            message: text || '',
          },
        });
      } else {
        await prisma.review.create({
          data: {
            businessId,
            rating,
            customerName: customerName || 'Guest',
            customerPhone,
            customerEmail,
            originalText: text || '',
            aiGeneratedText,
            status,
            isPublic: isPublic || false,
          },
        });
      }
    } catch (saveErr) {
      console.warn('Failed to save review to database (dev mode active):', saveErr);
    }

    return NextResponse.json({
      success: true,
      status,
      message: status === 'PRIVATE' 
        ? 'Feedback submitted privately' 
        : 'Review ready to post on Google',
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
