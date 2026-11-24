import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const KNOWN_BUSINESSES: Record<string, any> = {
  'kb-1': {
    name: 'Karachi Biryani House',
    type: 'Restaurant & Cafe',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    reviewThreshold: 3,
  },
  'lg-2': {
    name: 'Lahori Grill & Cafe',
    type: 'Cafe & Grill',
    googlePlaceId: 'ChIJ5TCOcRaY5zsR65GLOXy9cmg',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ5TCOcRaY5zsR65GLOXy9cmg',
    reviewThreshold: 3,
  },
  'demo': {
    name: 'Hari Om Wholesale - Kalewadi Branch',
    type: 'Retail Store & Saree Wholesale',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    reviewThreshold: 3,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businessId = params.id;

    // 1. Try DB first if connected
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
      console.warn('DB query skipped or not configured:', dbError);
    }

    if (business) {
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
    }

    // 2. Check known demo businesses
    if (KNOWN_BUSINESSES[businessId]) {
      const known = KNOWN_BUSINESSES[businessId];
      return NextResponse.json({
        success: true,
        business: {
          id: businessId,
          name: known.name,
          type: known.type,
          reviewThreshold: known.reviewThreshold,
          googleReviewUrl: known.googleReviewUrl,
        },
      });
    }

    // 3. Fallback for newly created businesses
    return NextResponse.json({
      success: true,
      business: {
        id: businessId,
        name: 'Hari Om Wholesale - Kalewadi Branch',
        type: 'Retail Store & Saree Wholesale',
        reviewThreshold: 3,
        googleReviewUrl: `https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4`,
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

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const reviewThreshold = 3;
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
      console.warn('DB write skipped in mock mode:', saveErr);
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
