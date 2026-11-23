import { NextRequest, NextResponse } from 'next/server';
import { generateQRCodeDataURL, generateGoogleReviewUrl } from '@/lib/qr';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, size = 300, color } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Get business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Generate QR code URL
    const scanUrl = `${process.env.NEXT_PUBLIC_APP_URL}/scan/${businessId}`;

    // Generate QR code
    const qrCodeDataUrl = await generateQRCodeDataURL({
      url: scanUrl,
      size,
      color: color || { dark: '#1d4ed8', light: '#ffffff' },
    });

    // Update business with QR code
    await prisma.business.update({
      where: { id: businessId },
      data: {
        qrCodeUrl: scanUrl,
        qrCodeData: qrCodeDataUrl,
      },
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      scanUrl,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { qrCodeData: true, qrCodeUrl: true },
    });

    if (!business || !business.qrCodeData) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      qrCode: business.qrCodeData,
      scanUrl: business.qrCodeUrl,
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    );
  }
}
