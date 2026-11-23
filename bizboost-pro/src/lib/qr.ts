import QRCode from 'qrcode';
import sharp from 'sharp';

export interface QRCodeOptions {
  url: string;
  size?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
  logoUrl?: string;
  logoSize?: number;
}

/**
 * Generate QR code as Data URL
 */
export async function generateQRCodeDataURL(options: QRCodeOptions): Promise<string> {
  const { url, size = 300, margin = 2, color = { dark: '#1d4ed8', light: '#ffffff' } } = options;

  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin,
      color,
      errorCorrectionLevel: 'H',
    });

    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code as Buffer (for download)
 */
export async function generateQRCodeBuffer(options: QRCodeOptions): Promise<Buffer> {
  const { url, size = 300, margin = 2, color = { dark: '#1d4ed8', light: '#ffffff' } } = options;

  try {
    const buffer = await QRCode.toBuffer(url, {
      width: size,
      margin,
      color,
      errorCorrectionLevel: 'H',
    });

    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code with logo overlay
 */
export async function generateQRCodeWithLogo(
  options: QRCodeOptions
): Promise<Buffer> {
  const { url, size = 400, margin = 2, color = { dark: '#1d4ed8', light: '#ffffff' }, logoUrl, logoSize = 80 } = options;

  try {
    // Generate base QR code
    const qrBuffer = await QRCode.toBuffer(url, {
      width: size,
      margin,
      color,
      errorCorrectionLevel: 'H',
    });

    // If no logo, return base QR
    if (!logoUrl) {
      return qrBuffer;
    }

    // Fetch and resize logo
    const logoResponse = await fetch(logoUrl);
    const logoBuffer = Buffer.from(await logoResponse.arrayBuffer());
    
    const resizedLogo = await sharp(logoBuffer)
      .resize(logoSize, logoSize)
      .toBuffer();

    // Create white background for logo
    const logoBackground = await sharp({
      create: {
        width: logoSize + 20,
        height: logoSize + 20,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        {
          input: resizedLogo,
          gravity: 'center',
        },
      ])
      .png()
      .toBuffer();

    // Composite QR with logo
    const finalQR = await sharp(qrBuffer)
      .composite([
        {
          input: logoBackground,
          gravity: 'center',
        },
      ])
      .png()
      .toBuffer();

    return finalQR;
  } catch (error) {
    console.error('Error generating QR code with logo:', error);
    throw new Error('Failed to generate QR code with logo');
  }
}

/**
 * Generate print-ready QR code sheet
 */
export async function generateQRPrintSheet(
  options: QRCodeOptions & {
    businessName: string;
    instruction?: string;
  }
): Promise<Buffer> {
  const { businessName, instruction = 'Scan to leave a review!' } = options;

  try {
    // Generate QR code
    const qrBuffer = await generateQRCodeBuffer({ ...options, size: 400 });

    // Create print sheet
    const printSheet = await sharp({
      create: {
        width: 800,
        height: 600,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        {
          input: qrBuffer,
          top: 100,
          left: 200,
        },
      ])
      .png()
      .toBuffer();

    return printSheet;
  } catch (error) {
    console.error('Error generating print sheet:', error);
    throw new Error('Failed to generate print sheet');
  }
}

/**
 * Generate review URL for Google Business
 */
export function generateGoogleReviewUrl(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

/**
 * Parse Google Review URL to extract place ID
 */
export function parseGoogleReviewUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle different URL formats
    if (url.includes('placeid=')) {
      return urlObj.searchParams.get('placeid');
    }
    
    if (url.includes('/place/')) {
      // Extract from maps.google.com/place/... format
      const match = url.match(/\/place\/([^\/\?]+)/);
      return match ? match[1] : null;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate QR code scan request
 */
export function validateQRScan(data: {
  businessId: string;
  rating: number;
}): { valid: boolean; error?: string } {
  if (!data.businessId) {
    return { valid: false, error: 'Business ID is required' };
  }

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    return { valid: false, error: 'Rating must be between 1 and 5' };
  }

  return { valid: true };
}
