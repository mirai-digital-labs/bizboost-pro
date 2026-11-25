'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, QrCode, MessageSquare, BarChart3, Settings,
  Users, Star, TrendingUp, Bell, LogOut, Plus, Eye, Phone,
  MapPin, Calendar, ChevronRight, ExternalLink, Download,
  CheckCircle, Shield, Sparkles, X, Check, Copy, RefreshCw,
  Sliders, MessageCircle, Search, Loader2, Printer, Building2,
  ShieldCheck, Upload, Palette, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import QRCode from 'qrcode';

// Color adjustment helper
function adjustColorBrightness(hex: string, percent: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  } catch {
    return hex;
  }
}

// Rounded rectangle drawing helper
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Client-side QR generation with Brand Logo centered
async function generateBrandedQRCode(
  scanUrl: string,
  color: string,
  logoUrl?: string,
  brandInitial?: string
): Promise<string> {
  if (typeof window === 'undefined') return '';
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 440;

    QRCode.toCanvas(
      canvas,
      scanUrl,
      {
        width: 440,
        margin: 2,
        color: { dark: color || '#1d4ed8', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      },
      (error) => {
        if (error) {
          QRCode.toDataURL(scanUrl, { width: 440, margin: 2, color: { dark: color || '#1d4ed8', light: '#ffffff' } })
            .then(resolve)
            .catch(() => resolve(''));
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(canvas.toDataURL('image/png'));
          return;
        }

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 52;

        if (logoUrl) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            // White circular background for logo with drop shadow
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Circular Brand Color Ring
            ctx.strokeStyle = color || '#1d4ed8';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
            ctx.stroke();

            // Clip and draw logo image
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, cx - radius, cy - radius, radius * 2, radius * 2);
            ctx.restore();

            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = () => {
            drawMonogram(ctx, cx, cy, radius, color, brandInitial);
            resolve(canvas.toDataURL('image/png'));
          };
          img.src = logoUrl;
        } else {
          drawMonogram(ctx, cx, cy, radius, color, brandInitial);
          resolve(canvas.toDataURL('image/png'));
        }
      }
    );
  });
}

function drawMonogram(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  initial?: string
) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = color || '#1d4ed8';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = color || '#1d4ed8';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const text = (initial || '⭐').slice(0, 2).toUpperCase();
  ctx.fillText(text, cx, cy + 2);
}

// Generate complete High-Res Printable Tabletop Standee Poster (800x1100 px)
async function generateTabletopStandeeImage({
  businessName,
  qrDataUrl,
  logoUrl,
  brandColor,
  category,
}: {
  businessName: string;
  qrDataUrl: string;
  logoUrl?: string;
  brandColor: string;
  category: string;
}): Promise<string> {
  if (typeof window === 'undefined') return qrDataUrl;
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return qrDataUrl;

  const mainColor = brandColor || '#dc2626';
  const darkerColor = adjustColorBrightness(mainColor, -25);

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1100);
  grad.addColorStop(0, mainColor);
  grad.addColorStop(0.32, darkerColor);
  grad.addColorStop(0.32, '#f8fafc');
  grad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1100);

  // Top Header Area
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  // Subtitle
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('⭐ REVIEW US ON GOOGLE ⭐', 400, 65);

  // Business Name
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText(businessName, 400, 118);

  // Category
  ctx.font = '500 18px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(category || 'Verified Google Profile', 400, 152);

  // Standee Acrylic Card
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 110, 200, 580, 710, 28);
  ctx.fill();
  ctx.restore();

  // Border on Card
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  roundRect(ctx, 110, 200, 580, 710, 28);
  ctx.stroke();

  // Stars & Instructions
  ctx.fillStyle = '#f59e0b';
  ctx.font = '34px sans-serif';
  ctx.fillText('★ ★ ★ ★ ★', 400, 260);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText('Point your phone camera here', 400, 305);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText('Share your experience in 10 seconds', 400, 335);

  // Draw QR Image
  if (qrDataUrl) {
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    await new Promise((res) => {
      qrImg.onload = res;
      qrImg.onerror = res;
      qrImg.src = qrDataUrl;
    });
    ctx.drawImage(qrImg, 190, 370, 420, 420);
  }

  // Bottom Pill on Card
  ctx.fillStyle = mainColor;
  roundRect(ctx, 220, 830, 360, 46, 23);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px Inter, sans-serif';
  ctx.fillText('⚡ AI Review Assistant Included', 400, 859);

  // Footer text
  ctx.fillStyle = '#64748b';
  ctx.font = '600 17px Inter, sans-serif';
  ctx.fillText('Thank you for supporting our local business!', 400, 970);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter, sans-serif';
  ctx.fillText('Powered by BizBoost Pro', 400, 1005);

  return canvas.toDataURL('image/png');
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'qr' | 'reviews' | 'analytics' | 'customers' | 'settings'>('overview');

  // Interactive Modals
  const [addBusinessModal, setAddBusinessModal] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [replyModal, setReplyModal] = useState<{ name: string; text: string; rating: number } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [generatingReply, setGeneratingReply] = useState(false);

  // QR Code Tab State & Brand Theme Customization
  const [qrColor, setQrColor] = useState('#dc2626');
  const [standeeColor, setStandeeColor] = useState('#dc2626');
  const [brandLogo, setBrandLogo] = useState<string | null>(null);
  const [ownerVerified, setOwnerVerified] = useState<boolean>(true);
  const [standeePosterUrl, setStandeePosterUrl] = useState<string>('');
  const [selectedBusinessId, setSelectedBusinessId] = useState('kb-1');
  const [generatedQrUrl, setGeneratedQrUrl] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const res = uploadEvent.target?.result as string;
      setBrandLogo(res);
    };
    reader.readAsDataURL(file);
  };

  const setPresetBrandEmoji = (emoji: string) => {
    if (typeof window === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(60, 60, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = standeeColor || '#dc2626';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 60, 68);
    setBrandLogo(canvas.toDataURL('image/png'));
  };

  const handleDownloadStandee = (name: string) => {
    if (!standeePosterUrl) return;
    const link = document.createElement('a');
    link.download = `BizBoost-Standee-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = standeePosterUrl;
    link.click();
  };

  // Business state
  const [businesses, setBusinesses] = useState([
    { id: 'kb-1', name: 'Karachi Biryani House', location: 'Karachi, Pakistan', category: 'Restaurant', reviews: 156, rating: 4.8, googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4' },
    { id: 'lg-2', name: 'Lahori Grill & Cafe', location: 'Lahore, Pakistan', category: 'Cafe & Grill', reviews: 91, rating: 4.6, googlePlaceId: 'ChIJ5TCOcRaY5zsR65GLOXy9cmg' },
  ]);

  // Add Business Modal Wizard State (ReviewBro Live Google Search Flow)
  const [addBusinessStep, setAddBusinessStep] = useState(1);
  const [createdBizQr, setCreatedBizQr] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [placesQuery, setPlacesQuery] = useState('');
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesResults, setPlacesResults] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [manualPlaceMode, setManualPlaceMode] = useState(false);
  const [step1Error, setStep1Error] = useState('');
  const [newBusinessForm, setNewBusinessForm] = useState({
    name: '',
    phone: '',
    selectedGoogleBranch: '',
    city: '',
    state: '',
    country: 'Pakistan',
    category: 'Fast food restaurant',
    googlePlaceId: '',
    googleReviewUrl: '',
    rating: 4.2,
    userRatingsTotal: 460,
    keywords: ['Best Quality', 'Helpful Staff', 'Affordable Pricing'],
  });

  // Recent reviews state
  const [reviewsList, setReviewsList] = useState([
    { id: 1, name: 'Ahmed Khan', rating: 5, text: 'Amazing food and quick service! Definitely my favorite spot.', date: '2 hours ago', status: 'published', business: 'Karachi Biryani House' },
    { id: 2, name: 'Sara Ali', rating: 4, text: 'Good experience, neat ambience and friendly staff.', date: '5 hours ago', status: 'published', business: 'Karachi Biryani House' },
    { id: 3, name: 'Zeeshan Tariq', rating: 2, text: 'The food was cold when served, had to wait 30 mins.', date: '1 day ago', status: 'private', business: 'Lahori Grill & Cafe' },
    { id: 4, name: 'Usman Malik', rating: 5, text: 'Best biryani in town, highly recommended!', date: '2 days ago', status: 'published', business: 'Karachi Biryani House' },
    { id: 5, name: 'Farah Naz', rating: 1, text: 'Staff at counter was unresponsive and order was mixed up.', date: '3 days ago', status: 'private', business: 'Lahori Grill & Cafe' },
  ]);

  const [reviewFilter, setReviewFilter] = useState<'all' | 'public' | 'private'>('all');

  // Settings State & Local SEO Keyword Training (from transcript)
  const [trainedKeywords, setTrainedKeywords] = useState<string[]>([
    'Best Fast Food in Jhang',
    'Crispy Fried Chicken',
    'Best Biryani in Karachi',
    'Top Rated Quality Products'
  ]);
  const [settingsForm, setSettingsForm] = useState({
    businessName: 'Karachi Biryani House',
    reviewThreshold: 3,
    emailAlerts: true,
    whatsappAlerts: true,
    phoneNumber: '+92 300 1234567',
  });

  const [settingsSaved, setSettingsSaved] = useState(false);

  // Generate QR when selected business, color or brand logo changes
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bizboost-pro.vercel.app';
    const scanUrl = `${origin}/scan/${selectedBusinessId}`;
    const curBiz = businesses.find(b => b.id === selectedBusinessId);
    const initial = curBiz?.name || 'FB';

    generateBrandedQRCode(scanUrl, qrColor, brandLogo || undefined, initial)
      .then(url => {
        setGeneratedQrUrl(url);
        generateTabletopStandeeImage({
          businessName: curBiz?.name || 'Your Business',
          qrDataUrl: url,
          logoUrl: brandLogo || undefined,
          brandColor: qrColor,
          category: curBiz?.category || 'Fast food restaurant',
        }).then(poster => setStandeePosterUrl(poster)).catch(err => console.warn(err));
      })
      .catch(err => console.warn('QR error:', err));
  }, [selectedBusinessId, qrColor, brandLogo]);

  // Debounced Google Places Search (ReviewBro Feature)
  useEffect(() => {
    const trimmed = placesQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setPlacesResults([]);
      setPlacesLoading(false);
      return;
    }

    setPlacesLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (data?.results) {
          setPlacesResults(data.results);
        }
      } catch (err) {
        console.warn('Places search failed:', err);
      } finally {
        setPlacesLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [placesQuery]);

  const handleSelectGooglePlace = (place: any) => {
    setSelectedPlace(place);
    const cityName = place.city || 'Jhang';
    
    // Dynamic high-converting Local SEO keywords tailored to category & city
    let autoKeywords = ['Helpful Staff', 'Affordable Pricing', 'High Quality'];
    const cat = (place.category || '').toLowerCase();
    if (cat.includes('marquee') || cat.includes('wedding') || cat.includes('banquet') || cat.includes('hall')) {
      autoKeywords = [`Best Marquee in ${cityName}`, `Top Wedding Venue in ${cityName}`, `Luxury Banquet Hall`, `Grand Stage Decor & Ample Parking`];
    } else if (cat.includes('saree') || cat.includes('wholesale') || cat.includes('retail') || cat.includes('clothing')) {
      autoKeywords = [`Best Sarees Shop in ${cityName}`, `Top Wholesale Saree in ${cityName}`, `Designer Bridal Sarees`, `Affordable Wholesale Rates`];
    } else if (cat.includes('restaurant') || cat.includes('cafe') || cat.includes('biryani') || cat.includes('grill') || cat.includes('food')) {
      autoKeywords = [`Best Food in ${cityName}`, `Top Family Restaurant in ${cityName}`, `Authentic Taste`, `Fast Service & Great Ambience`];
    } else if (cat.includes('salon') || cat.includes('beauty') || cat.includes('spa')) {
      autoKeywords = [`Best Salon in ${cityName}`, `Top Bridal Makeup`, `Professional Hair Stylist`, `Clean & Relaxing Ambience`];
    } else if (cat.includes('clinic') || cat.includes('hospital') || cat.includes('healthcare') || cat.includes('dental')) {
      autoKeywords = [`Best Clinic in ${cityName}`, `Top Specialist Doctor in ${cityName}`, `Trusted Healthcare Service`];
    } else if (cat.includes('auto') || cat.includes('workshop')) {
      autoKeywords = [`Best Car Workshop in ${cityName}`, `Reliable Auto Service in ${cityName}`, `Genuine Parts & Fast Repair`];
    }

    setNewBusinessForm(prev => ({
      ...prev,
      name: place.name,
      selectedGoogleBranch: place.name,
      city: place.city || '',
      state: place.state || '',
      country: place.country || 'Pakistan',
      category: place.category || 'Local Business & Retail',
      googlePlaceId: place.placeId || '',
      googleReviewUrl: place.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${place.placeId}`,
      rating: place.rating !== undefined ? place.rating : 4.2,
      userRatingsTotal: place.userRatingsTotal !== undefined ? place.userRatingsTotal : 460,
      keywords: autoKeywords,
    }));
  };

  const openAddBusinessModal = () => {
    setAddBusinessStep(1);
    setPlacesQuery('');
    setPlacesResults([]);
    setSelectedPlace(null);
    setManualPlaceMode(false);
    setNewBusinessForm({
      name: '',
      phone: '',
      selectedGoogleBranch: '',
      city: '',
      state: '',
      country: 'Pakistan',
      category: 'Fast food restaurant',
      googlePlaceId: '',
      googleReviewUrl: '',
      rating: 4.2,
      userRatingsTotal: 460,
      keywords: ['Best Fast Food in Jhang', 'Crispy Fried Chicken', 'Quick Service & Polite Staff'],
    });
    setAddBusinessModal(true);
  };

  // Handle Add Business (Transcript flow)
  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = newBusinessForm.selectedGoogleBranch || newBusinessForm.name;
    if (!finalName) return;

    const newId = `biz-${Date.now()}`;
    const fullLocation = [newBusinessForm.city, newBusinessForm.state, newBusinessForm.country].filter(Boolean).join(', ') || 'Jhang, Punjab, Pakistan';
    const newBiz = {
      id: newId,
      name: finalName,
      location: fullLocation,
      category: newBusinessForm.category,
      reviews: newBusinessForm.userRatingsTotal || selectedPlace?.userRatingsTotal || 460,
      rating: newBusinessForm.rating || selectedPlace?.rating || 4.2,
      googlePlaceId: newBusinessForm.googlePlaceId || 'ChIJH0eTpPmZYzkRxcf3uOQADmQ',
    };

    setBusinesses([newBiz, ...businesses]);
    setSelectedBusinessId(newId);

    // Generate Branded QR in one instant ("Ek Jhatke Mein") with centered logo
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bizboost-pro.vercel.app';
      const scanUrl = `${origin}/scan/${newId}`;
      const brandedQr = await generateBrandedQRCode(scanUrl, standeeColor, brandLogo || undefined, finalName);
      setCreatedBizQr(brandedQr);

      const standeePoster = await generateTabletopStandeeImage({
        businessName: finalName,
        qrDataUrl: brandedQr,
        logoUrl: brandLogo || undefined,
        brandColor: standeeColor,
        category: newBusinessForm.category,
      });
      setStandeePosterUrl(standeePoster);
    } catch (err) {
      console.warn('QR gen error in wizard:', err);
    }

    setAddBusinessStep(3);
  };

  // Generate AI reply to customer review
  const handleGenerateReply = (review: { name: string; text: string; rating: number }) => {
    setReplyModal(review);
    setGeneratingReply(true);

    setTimeout(() => {
      if (review.rating >= 4) {
        setReplyText(`Dear ${review.name}, thank you so much for your wonderful 5-star review! We are delighted that you enjoyed your meal with us. Our team looks forward to welcoming you back soon!`);
      } else {
        setReplyText(`Dear ${review.name}, thank you for your candid feedback. We sincerely apologize that your experience did not meet expectations. Please reach out to our management at 0300-1234567 so we can make this right for you.`);
      }
      setGeneratingReply(false);
    }, 800);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 flex flex-col justify-between ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              {sidebarOpen && <span className="text-lg font-black text-gray-900 tracking-tight">BizBoost Pro</span>}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'qr', label: 'QR Codes & Stands', icon: QrCode },
              { id: 'reviews', label: 'Reviews & AI Replies', icon: MessageSquare },
              { id: 'analytics', label: 'Live Analytics', icon: BarChart3 },
              { id: 'customers', label: 'Private Complaints', icon: Shield },
              { id: 'settings', label: 'Business Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Upgrade & User Profile */}
        <div className="p-3 border-t border-gray-100 space-y-3">
          {sidebarOpen && (
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 text-primary-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pro Plan Active</span>
              </div>
              <p className="text-xs text-white/80 mb-2.5">18 of 100 AI reviews used this month.</p>
              <button
                onClick={() => setUpgradeModal(true)}
                className="w-full py-1.5 bg-white text-primary-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition"
              >
                Upgrade to Unlimited
              </button>
            </div>
          )}

          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {session?.user?.name ? session.user.name.slice(0, 2).toUpperCase() : 'BB'}
              </div>
              {sidebarOpen && (
                <div className="truncate">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {session?.user?.name || 'Ahmed Khan'}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {session?.user?.email || 'owner@restaurant.pk'}
                  </div>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-1.5 text-gray-400 hover:text-danger-600 rounded-lg hover:bg-white transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Sticky Header */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 capitalize">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'qr' && 'QR Code Generator & Table Stands'}
                {activeTab === 'reviews' && 'Google Reviews & AI Responder'}
                {activeTab === 'analytics' && 'Traffic & Conversion Analytics'}
                {activeTab === 'customers' && 'Private Feedback Inbox (1-3 Stars)'}
                {activeTab === 'settings' && 'Business Profile & Review Threshold'}
              </h1>
              <p className="text-xs text-gray-500">Live operational data for your locations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/scan/${selectedBusinessId}`}
              target="_blank"
              className="btn btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary-600" />
              <span>Test Customer View</span>
            </Link>
            <button
              onClick={openAddBusinessModal}
              className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Location</span>
            </button>
          </div>
        </header>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card border border-gray-100">
                <div className="flex items-center justify-between text-warning-500 mb-2">
                  <Star className="w-6 h-6 fill-warning-500" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-success-50 text-success-600">+0.3 this mo</span>
                </div>
                <div className="text-3xl font-black text-gray-900">4.8 ★</div>
                <div className="text-xs text-gray-500 mt-1">Average Google Rating</div>
              </div>

              <div className="card border border-gray-100">
                <div className="flex items-center justify-between text-primary-600 mb-2">
                  <QrCode className="w-6 h-6" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">+18% scans</span>
                </div>
                <div className="text-3xl font-black text-gray-900">247</div>
                <div className="text-xs text-gray-500 mt-1">Total QR Scans</div>
              </div>

              <div className="card border border-gray-100">
                <div className="flex items-center justify-between text-success-600 mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-success-50 text-success-600">+23 new</span>
                </div>
                <div className="text-3xl font-black text-gray-900">189</div>
                <div className="text-xs text-gray-500 mt-1">5-Star Google Reviews</div>
              </div>

              <div className="card border border-gray-100">
                <div className="flex items-center justify-between text-warning-600 mb-2">
                  <Shield className="w-6 h-6" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-warning-50 text-warning-700">100% Resolved</span>
                </div>
                <div className="text-3xl font-black text-gray-900">12</div>
                <div className="text-xs text-gray-500 mt-1">Negative Reviews Shielded</div>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Active Locations */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">Your Business Locations</h3>
                    <button onClick={openAddBusinessModal} className="text-xs text-primary-600 font-bold hover:underline">
                      + Add Location
                    </button>
                  </div>

                  <div className="space-y-3">
                    {businesses.map((b) => (
                      <div 
                        key={b.id} 
                        onClick={() => setSelectedBusinessId(b.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedBusinessId === b.id ? 'border-primary-500 bg-primary-50/40 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-sm">
                            {b.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">{b.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {b.location} • {b.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <div className="text-sm font-bold text-warning-500 flex items-center gap-1 justify-end">
                              <Star className="w-3.5 h-3.5 fill-warning-500" />
                              {b.rating}
                            </div>
                            <div className="text-[11px] text-gray-500">{b.reviews} reviews</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${selectedBusinessId === b.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {selectedBusinessId === b.id ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Reviews preview */}
                <div className="card border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">Recent Feedback Activity</h3>
                    <button onClick={() => setActiveTab('reviews')} className="text-xs text-primary-600 font-bold hover:underline">
                      View All Reviews
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reviewsList.slice(0, 3).map((r) => (
                      <div key={r.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-gray-900">{r.name}</span>
                            <span className="text-[10px] text-gray-400">• {r.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'published' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}`}>
                              {r.status === 'published' ? 'Posted on Google' : 'Private Inbox'}
                            </span>
                            <div className="flex">
                              {[...Array(r.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-warning-500 fill-warning-500" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live QR Preview */}
              <div className="space-y-6">
                <div className="card border border-gray-100 text-center">
                  <h3 className="font-bold text-sm text-gray-900 mb-1">Live Table QR Stand</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {businesses.find(b => b.id === selectedBusinessId)?.name || 'Your Business'}
                  </p>

                  <div className="p-4 bg-gradient-to-b from-primary-50 to-blue-50/50 rounded-2xl border border-primary-100 inline-block mb-4 shadow-sm">
                    {generatedQrUrl ? (
                      <img src={generatedQrUrl} alt="QR Code" className="w-44 h-44 mx-auto rounded-lg shadow-sm" />
                    ) : (
                      <div className="w-44 h-44 bg-white rounded-lg flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={generatedQrUrl}
                      download={`BizBoost-QR-${selectedBusinessId}.png`}
                      className="btn btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PNG
                    </a>
                    <button
                      onClick={() => setActiveTab('qr')}
                      className="btn btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Customize QR
                    </button>
                  </div>
                </div>

                {/* Quick Growth Tips */}
                <div className="card border border-gray-100 bg-gradient-to-br from-blue-50/60 to-primary-50/40">
                  <div className="flex items-center gap-2 text-primary-700 font-bold text-xs mb-2">
                    <Sparkles className="w-4 h-4" />
                    Growth Tip for Today
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Place QR cards directly inside bill folders or near table numbers. Restaurants see a 310% increase in scan volume when the waiter politely asks: <i>"Please rate our food on this QR stand"</i>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: QR CODES & STANDS */}
        {activeTab === 'qr' && (
          <div className="p-6 max-w-4xl space-y-6">
            <div className="card border border-gray-100">
              <h3 className="font-bold text-base text-gray-900 mb-1">Customize & Print Your QR Codes</h3>
              <p className="text-xs text-gray-500 mb-6">Choose brand colors and download high-resolution print files for table tents.</p>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div>
                    <label className="label text-xs">Select Location</label>
                    <select
                      value={selectedBusinessId}
                      onChange={(e) => setSelectedBusinessId(e.target.value)}
                      className="input text-sm"
                    >
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Logo Upload in Tab 2 */}
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-primary-600" />
                        Brand Logo & Center QR Icon
                      </label>
                      {brandLogo && (
                        <button
                          type="button"
                          onClick={() => setBrandLogo(null)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-white border-2 border-dashed border-gray-300 hover:border-primary-500 flex items-center justify-center overflow-hidden shadow-xs">
                          {brandLogo ? (
                            <img src={brandLogo} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center">
                              <Upload className="w-4 h-4 text-gray-400 mx-auto" />
                              <span className="text-[8px] text-gray-500 font-medium block">Logo</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-800">
                          {brandLogo ? 'Custom Logo Active' : 'Click to Upload Logo'}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { label: '🍗 Fri Chicks', emoji: '🍗' },
                            { label: '🥩 BBQ Grill', emoji: '🥩' },
                            { label: '🍚 Biryani', emoji: '🍚' },
                            { label: '🛍️ Retail', emoji: '🛍️' },
                          ].map((p, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setPresetBrandEmoji(p.emoji)}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 hover:border-primary-400 text-gray-700"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label text-xs">Standee & QR Brand Theme Color</label>
                    <div className="flex items-center gap-2.5">
                      {[
                        { name: 'Fri Chicks Red', color: '#dc2626' },
                        { name: 'Royal Blue', color: '#1d4ed8' },
                        { name: 'Emerald Green', color: '#059669' },
                        { name: 'Warm Amber', color: '#d97706' },
                        { name: 'Classic Dark', color: '#111827' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          onClick={() => {
                            setQrColor(c.color);
                            setStandeeColor(c.color);
                          }}
                          style={{ backgroundColor: c.color }}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform ${
                            qrColor === c.color ? 'scale-110 ring-2 ring-offset-2 ring-primary-500' : ''
                          }`}
                          title={c.name}
                        >
                          {qrColor === c.color && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs text-gray-600 border border-gray-200">
                    <div className="font-bold text-gray-900">Printing Tips:</div>
                    <div>• Tabletop Standee (Acrylic Stand): <b>4" × 6" inches (A6)</b></div>
                    <div>• Bill Book Folder Sticker: <b>2" × 2" inches</b></div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {standeePosterUrl && (
                      <button
                        type="button"
                        onClick={() => handleDownloadStandee(businesses.find(b => b.id === selectedBusinessId)?.name || 'Standee')}
                        className="btn btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        Download Standee PNG
                      </button>
                    )}
                    <a
                      href={generatedQrUrl}
                      download={`bizboost-qr-${selectedBusinessId}.png`}
                      className="btn btn-secondary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Download QR
                    </a>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn btn-outline text-xs py-2.5 px-3 flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>

                <div className="text-center bg-gray-50/70 p-6 rounded-2xl border border-gray-200">
                  {/* Standee Preview */}
                  <div
                    style={{
                      background: `linear-gradient(145deg, ${standeeColor}, ${adjustColorBrightness(standeeColor, -25)})`,
                    }}
                    className="max-w-[240px] mx-auto p-4 rounded-2xl text-white shadow-xl text-center mb-3"
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      {brandLogo ? (
                        <img src={brandLogo} alt="Logo" className="w-7 h-7 rounded-full bg-white object-cover p-0.5 border border-white/50" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          {(businesses.find(b => b.id === selectedBusinessId)?.name || 'FC').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="text-left truncate text-xs font-bold">
                        {businesses.find(b => b.id === selectedBusinessId)?.name}
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl shadow-md inline-block my-1">
                      <img src={generatedQrUrl} alt="QR Code" className="w-40 h-40 mx-auto" />
                    </div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider mt-1">Review Us on Google</div>
                    <div className="text-[10px] text-white/80">⚡ AI-Powered Reviews</div>
                  </div>

                  <div className="font-bold text-sm text-gray-900">
                    {businesses.find(b => b.id === selectedBusinessId)?.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Customized Table Standee with Centered Brand Logo</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: REVIEWS & AI REPLIES */}
        {activeTab === 'reviews' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${reviewFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}
                >
                  All Reviews ({reviewsList.length})
                </button>
                <button
                  onClick={() => setReviewFilter('public')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${reviewFilter === 'public' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}
                >
                  Posted to Google (4-5 ★)
                </button>
                <button
                  onClick={() => setReviewFilter('private')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${reviewFilter === 'private' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}
                >
                  Private Feedback (1-3 ★)
                </button>
              </div>

              <span className="text-xs text-gray-500">Auto-synced with Google Review Place ID</span>
            </div>

            <div className="space-y-4">
              {reviewsList
                .filter(r => {
                  if (reviewFilter === 'public') return r.status === 'published';
                  if (reviewFilter === 'private') return r.status === 'private';
                  return true;
                })
                .map((rev) => (
                  <div key={rev.id} className="card border border-gray-100 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-gray-900">{rev.name}</span>
                        <span className="text-xs text-gray-400">• {rev.date}</span>
                        <span className="text-xs text-primary-600 font-medium">({rev.business})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-warning-500 fill-warning-500' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rev.status === 'published' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                        }`}>
                          {rev.status === 'published' ? 'Google Review' : 'Private Complaint'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">{rev.text}</p>
                    </div>

                    <button
                      onClick={() => handleGenerateReply(rev)}
                      className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                      <span>Generate AI Reply</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 4: LIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">QR Scan Conversion Rate</div>
                <div className="text-3xl font-black text-primary-600 mb-1">76.5%</div>
                <p className="text-xs text-gray-500">76 out of 100 scans converted into positive reviews.</p>
              </div>

              <div className="card border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Customer Device Type</div>
                <div className="text-3xl font-black text-gray-900 mb-1">94% Mobile</div>
                <p className="text-xs text-gray-500">88% Android, 6% iPhone, 6% Desktop scans.</p>
              </div>

              <div className="card border border-gray-100">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Google Ranking Jump</div>
                <div className="text-3xl font-black text-success-600 mb-1">Top 3</div>
                <p className="text-xs text-gray-500">Your profile now ranks in the Top 3 local pack.</p>
              </div>
            </div>

            <div className="card border border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Monthly Scan & Review Velocity</h3>
              <div className="space-y-4">
                {[
                  { month: 'November 2026', scans: 142, reviews: 108, pct: '76%' },
                  { month: 'October 2026', scans: 95, reviews: 71, pct: '74%' },
                  { month: 'September 2026', scans: 48, reviews: 34, pct: '70%' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span>{item.month}</span>
                      <span>{item.reviews} Reviews ({item.scans} Scans)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full" style={{ width: item.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: PRIVATE COMPLAINTS (1-3 Stars) */}
        {activeTab === 'customers' && (
          <div className="p-6 space-y-6">
            <div className="card border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Protected Private Complaints Inbox (1-3 Stars)</h3>
                    <p className="text-xs text-gray-600">
                      These reviews are <b>never posted to Google</b>. Only you (the authenticated owner: <b>{session?.user?.email || 'mahzare.official@gmail.com'}</b>) can view these private complaints.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-full flex items-center gap-1 flex-shrink-0">
                  <Check className="w-3 h-3" />
                  Owner Access Verified
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {reviewsList.filter(r => r.status === 'private').map((c) => (
                <div key={c.id} className="card border border-gray-100 flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{c.name}</span>
                      <span className="text-xs text-gray-400">• {c.date}</span>
                    </div>
                    <div className="flex gap-1 text-warning-500">
                      {[...Array(c.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-warning-500" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{c.text}</p>
                    <div className="text-[11px] text-gray-500">Customer Location: <b>{c.business}</b></div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Contact Customer
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 max-w-2xl space-y-6">
            <div className="card border border-gray-100">
              <h3 className="font-bold text-base text-gray-900 mb-1">Business Profile & Review Shield Settings</h3>
              <p className="text-xs text-gray-500 mb-6">Manage review threshold and notification preferences.</p>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="label text-xs">Primary Business Name</label>
                  <input
                    type="text"
                    value={settingsForm.businessName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                    className="input text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="label text-xs">Review Routing Threshold</label>
                  <select
                    value={settingsForm.reviewThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, reviewThreshold: Number(e.target.value) })}
                    className="input text-sm"
                  >
                    <option value={3}>1 to 3 Stars = Private Feedback, 4 to 5 Stars = Google Review (Recommended)</option>
                    <option value={4}>1 to 4 Stars = Private Feedback, 5 Stars Only = Google Review (Strict)</option>
                    <option value={2}>1 to 2 Stars = Private Feedback, 3 to 5 Stars = Google Review (Permissive)</option>
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">Customers who select stars below this threshold will never be directed to Google.</p>
                </div>

                {/* Local SEO Keywords Training (Transcript Feature) */}
                <div className="p-4 bg-primary-50/60 rounded-xl border border-primary-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    <label className="text-xs font-bold text-gray-900">Local SEO Keywords Training</label>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-3">
                    Train the AI with your target local keywords (e.g. <em>"Best Fast Food in Jhang"</em>, <em>"Best Biryani in Karachi"</em>). When customer scans the QR, the AI naturally weaves these keywords into their Google reviews to boost your Google 3-Pack Maps ranking!
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trainedKeywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white text-primary-800 border border-primary-200 shadow-xs font-medium">
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => setTrainedKeywords(trainedKeywords.filter((_, idx) => idx !== i))}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newKeywordInput.trim()) {
                          e.preventDefault();
                          if (!trainedKeywords.includes(newKeywordInput.trim())) {
                            setTrainedKeywords([...trainedKeywords, newKeywordInput.trim()]);
                          }
                          setNewKeywordInput('');
                        }
                      }}
                      placeholder="Type keyword & press Enter (e.g. Best Fast Food in Jhang)"
                      className="input text-xs bg-white text-gray-900 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newKeywordInput.trim() && !trainedKeywords.includes(newKeywordInput.trim())) {
                          setTrainedKeywords([...trainedKeywords, newKeywordInput.trim()]);
                          setNewKeywordInput('');
                        }
                      }}
                      className="btn btn-secondary text-xs px-4"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label text-xs">Manager WhatsApp for Instant Alerts</label>
                  <input
                    type="text"
                    value={settingsForm.phoneNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                    className="input text-sm"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.emailAlerts}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emailAlerts: e.target.checked })}
                      className="rounded"
                    />
                    <span>Receive instant email notification when negative feedback arrives</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.whatsappAlerts}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappAlerts: e.target.checked })}
                      className="rounded"
                    />
                    <span>Send monthly review performance summary</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button type="submit" className="btn btn-primary text-xs py-2.5 px-6">
                    Save Changes
                  </button>
                  {settingsSaved && (
                    <span className="text-xs text-success-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Settings successfully updated!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Add Business Modal (ReviewBro Transcript Flow) */}
      {addBusinessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => { setAddBusinessModal(false); setAddBusinessStep(1); }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step Progress Indicators */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${addBusinessStep === 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                1. Google Match
              </span>
              <span className="text-gray-300">→</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${addBusinessStep === 2 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                2. Category & SEO
              </span>
              <span className="text-gray-300">→</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${addBusinessStep === 3 ? 'bg-success-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                3. QR Generated
              </span>
            </div>

            {/* STEP 1: Live Google Business Profile Autocomplete Search (ReviewBro Feature) */}
            {addBusinessStep === 1 && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-blue-100 text-blue-700">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">Search Your Business on Google Maps</h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Type your business or shop name to automatically connect your official Google Business Profile and sync reviews.
                  </p>
                </div>

                {/* Google Places Live Search Box */}
                <div className="space-y-1.5">
                  <label className="label text-xs flex items-center justify-between">
                    <span>Business Name / Google Listing</span>
                    {placesLoading && (
                      <span className="text-[11px] text-primary-600 flex items-center gap-1 font-medium">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Searching Google Maps...
                      </span>
                    )}
                  </label>

                  <div className="relative">
                    {!placesQuery && (
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Search className="w-4 h-4" />
                      </div>
                    )}
                    <input
                      type="text"
                      value={placesQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPlacesQuery(val);
                        setNewBusinessForm(prev => ({ ...prev, name: val, selectedGoogleBranch: val }));
                        if (selectedPlace && val !== selectedPlace.name) {
                          setSelectedPlace(null);
                        }
                      }}
                      placeholder="e.g. Fri Chicks Jhang, Kababjees, Savour Foods, or Al Rehman Biryani..."
                      className={`input pr-10 text-sm bg-white text-gray-900 transition-all ${
                        placesQuery ? 'pl-3.5' : 'pl-10'
                      }`}
                      autoFocus
                    />
                    {placesQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setPlacesQuery('');
                          setPlacesResults([]);
                          setSelectedPlace(null);
                          setNewBusinessForm(prev => ({ ...prev, name: '', selectedGoogleBranch: '' }));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Active Selected Google Listing Card */}
                {selectedPlace && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 animate-fade-in">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">{selectedPlace.name}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                              Google Verified
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-600 mt-0.5">{selectedPlace.formattedAddress}</div>
                          <div className="flex items-center gap-2 mt-1 text-[11px]">
                            <span className="text-warning-600 font-bold flex items-center gap-0.5">
                              ⭐ {selectedPlace.rating}
                            </span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-600 font-medium">{selectedPlace.userRatingsTotal} Google reviews</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-primary-700 font-medium">{selectedPlace.category}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPlace(null)}
                        className="text-[11px] text-gray-500 hover:text-gray-800 underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Google Search Dropdown Results List */}
                {!selectedPlace && placesResults.length > 0 && (
                  <div className="space-y-2 pt-1 animate-fade-in max-h-64 overflow-y-auto pr-1">
                    <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                      <span className="font-bold text-gray-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Google Places Results ({placesResults.length})
                      </span>
                      <span>Click to link your profile</span>
                    </div>

                    {placesResults.map((place, idx) => {
                      const isSelected = selectedPlace?.id === place.id || newBusinessForm.selectedGoogleBranch === place.name;
                      return (
                        <div
                          key={place.id || idx}
                          onClick={() => handleSelectGooglePlace(place)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50/70 shadow-sm'
                              : 'border-gray-200 hover:border-primary-400 bg-white hover:bg-gray-50/80'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0 pr-2">
                            {/* Google Maps Pin Icon */}
                            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <MapPin className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-gray-900 truncate">
                                {place.name}
                              </div>
                              <div className="text-[11px] text-gray-500 truncate">
                                {place.formattedAddress}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                                <span className="text-warning-600 font-bold">⭐ {place.rating}</span>
                                <span className="text-gray-400">·</span>
                                <span className="text-gray-500">{place.userRatingsTotal} reviews</span>
                                <span className="text-gray-400">·</span>
                                <span className="text-blue-600 font-medium">{place.category}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <CheckCircle className="w-5 h-5 text-primary-600" />
                            ) : (
                              <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-primary-600 hover:text-white transition">
                                Link
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Unlisted business manual entry toggle */}
                <div className="pt-1">
                  {!manualPlaceMode ? (
                    <button
                      type="button"
                      onClick={() => setManualPlaceMode(true)}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium hover:underline flex items-center gap-1"
                    >
                      + My business is unlisted or I want to paste my Google review link manually
                    </button>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800">Manual Google Listing Setup</span>
                        <button
                          type="button"
                          onClick={() => setManualPlaceMode(false)}
                          className="text-[11px] text-gray-500 hover:text-gray-700"
                        >
                          Hide
                        </button>
                      </div>

                      <div>
                        <label className="label text-[11px]">Direct Google Review Link (Optional)</label>
                        <input
                          type="url"
                          value={newBusinessForm.googleReviewUrl}
                          onChange={(e) => setNewBusinessForm({ ...newBusinessForm, googleReviewUrl: e.target.value })}
                          placeholder="https://search.google.com/local/writereview?placeid=..."
                          className="input text-xs bg-white text-gray-900"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                          You can find this inside your Google Business Profile dashboard under "Ask for reviews".
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manager Contact Number & Owner Authentication Shield */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Owner Authentication & Alert Security</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Verified Session
                    </span>
                  </div>

                  <div>
                    <label className="label text-xs flex items-center justify-between">
                      <span>Official Business Phone / WhatsApp (Verified Match)</span>
                      {selectedPlace?.phone && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Google Profile Phone Linked
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={newBusinessForm.phone}
                      onChange={(e) => {
                        setNewBusinessForm({ ...newBusinessForm, phone: e.target.value });
                        if (step1Error) setStep1Error('');
                      }}
                      placeholder="e.g. +92 300 1234567 or 0321 9876543"
                      className="input text-sm bg-white text-gray-900"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      {selectedPlace?.phone
                        ? 'Strict Check Active: Enter the exact phone number registered on this Google Business Profile.'
                        : 'Requires a valid 10+ digit official business number. (Live Google Profile phone/email matching activates with Google Places API & Google OAuth).'}
                    </p>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-1 bg-white p-2.5 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={ownerVerified}
                      onChange={(e) => {
                        setOwnerVerified(e.target.checked);
                        if (step1Error) setStep1Error('');
                      }}
                      className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                    />
                    <div className="text-[11px] text-gray-700 leading-snug">
                      <strong>I verify that I am the authorized owner / manager of this business profile.</strong>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Private customer details and negative feedback are encrypted and restricted solely to your authenticated account.
                      </div>
                    </div>
                  </label>

                  {step1Error && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-[11px] font-medium text-red-700 flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{step1Error}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const enteredDigits = (newBusinessForm.phone || '').replace(/\D/g, '');
                      if (enteredDigits.length < 10) {
                        setStep1Error('Please enter a valid 10+ digit official phone number attached to this business.');
                        return;
                      }
                      if (selectedPlace?.phone) {
                        const officialDigits = selectedPlace.phone.replace(/\D/g, '');
                        if (officialDigits.length >= 7 && enteredDigits.slice(-9) !== officialDigits.slice(-9)) {
                          setStep1Error('Verification Failed: Entered phone number does not match the official number on this Google Business Profile.');
                          return;
                        }
                      }
                      if (!ownerVerified) {
                        setStep1Error('Please check the authorization box to confirm you are the owner/manager.');
                        return;
                      }
                      setStep1Error('');
                      setAddBusinessStep(2);
                    }}
                    disabled={!placesQuery && !newBusinessForm.name}
                    className={`btn btn-primary flex-1 text-xs py-3 ${
                      !placesQuery && !newBusinessForm.name ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Continue to Category & SEO Keywords →
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddBusinessModal(false)}
                    className="btn btn-secondary text-xs px-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Category, City & Local SEO Keywords Training */}
            {addBusinessStep === 2 && (
              <form onSubmit={handleAddBusiness} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Category & Local SEO Keywords</h3>
                  <p className="text-xs text-gray-500">Confirm your category and train the AI with your target search keywords.</p>
                </div>

                <div>
                  <label className="label text-xs">Selected Branch</label>
                  <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800">
                    {newBusinessForm.selectedGoogleBranch || newBusinessForm.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Category</label>
                    <select
                      value={newBusinessForm.category}
                      onChange={(e) => setNewBusinessForm({ ...newBusinessForm, category: e.target.value })}
                      className="input text-xs bg-white text-gray-900"
                    >
                      <option value="Wedding venue">Wedding venue & Banquet Hall</option>
                      <option value="Fast food restaurant">Fast food restaurant</option>
                      <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                      <option value="Retail Store & Wholesale">Retail Store & Wholesale</option>
                      <option value="Salon & Beauty">Salon, Spa & Beauty</option>
                      <option value="Clinic & Healthcare">Clinic & Healthcare</option>
                      <option value="Auto Workshop & Detailing">Auto Workshop & Services</option>
                      <option value="Fashion & Boutique">Fashion & Clothing</option>
                      <option value="Local Business & Retail">Local Business & Retail</option>
                    </select>
                  </div>
                  <div>
                    <label className="label text-xs">City / Area</label>
                    <input
                      type="text"
                      value={newBusinessForm.city || 'Jhang'}
                      onChange={(e) => setNewBusinessForm({ ...newBusinessForm, city: e.target.value })}
                      className="input text-xs bg-white text-gray-900"
                      placeholder="e.g. Jhang, Karachi, Lahore or Islamabad"
                    />
                  </div>
                </div>

                {/* Google Maps Live Synced Rating & Total Reviews (Editable by Owner) */}
                <div className="grid grid-cols-2 gap-3 p-2.5 bg-amber-50/60 rounded-xl border border-amber-200">
                  <div>
                    <label className="label text-[11px] font-bold text-amber-950 flex items-center gap-1">
                      <span>⭐ Google Maps Rating</span>
                      <span className="text-[10px] text-amber-700 font-normal">(Synced / Editable)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={newBusinessForm.rating || 4.2}
                      onChange={(e) => setNewBusinessForm({ ...newBusinessForm, rating: parseFloat(e.target.value) || 4.2 })}
                      className="input text-xs bg-white text-gray-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="label text-[11px] font-bold text-amber-950 flex items-center gap-1">
                      <span>📝 Total Google Reviews</span>
                      <span className="text-[10px] text-amber-700 font-normal">(e.g. 460)</span>
                    </label>
                    <input
                      type="number"
                      value={newBusinessForm.userRatingsTotal || 460}
                      onChange={(e) => setNewBusinessForm({ ...newBusinessForm, userRatingsTotal: parseInt(e.target.value) || 0 })}
                      className="input text-xs bg-white text-gray-900 font-bold"
                    />
                  </div>
                </div>

                {/* Brand Logo & Tabletop Standee Theme Customization */}
                <div className="p-3.5 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                      <Palette className="w-4 h-4 text-primary-600" />
                      <span>Brand Logo & Tabletop Standee Theme</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Center of QR & Standee Header</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="relative group cursor-pointer flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-gray-300 group-hover:border-primary-500 flex items-center justify-center overflow-hidden shadow-xs">
                        {brandLogo ? (
                          <img src={brandLogo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-1">
                            <Upload className="w-4 h-4 text-gray-400 mx-auto mb-0.5" />
                            <span className="text-[9px] text-gray-500 font-medium block">Upload Logo</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-semibold text-gray-800">
                        {brandLogo ? 'Brand Logo Attached ✓' : 'Upload restaurant or shop logo (PNG / JPG)'}
                      </div>
                      <p className="text-[10px] text-gray-500 leading-tight">
                        Appears centered inside your QR code & on your tabletop standee.
                      </p>

                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[10px] text-gray-400">Sample Badges:</span>
                        {[
                          { label: '🍗 Crispy Chicken', emoji: '🍗' },
                          { label: '🥩 BBQ Grill', emoji: '🥩' },
                          { label: '🍚 Biryani House', emoji: '🍚' },
                          { label: '🛍️ Retail', emoji: '🛍️' },
                        ].map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setPresetBrandEmoji(p.emoji)}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 hover:border-primary-400 text-gray-700 font-medium"
                          >
                            {p.label}
                          </button>
                        ))}
                        {brandLogo && (
                          <button
                            type="button"
                            onClick={() => setBrandLogo(null)}
                            className="text-[10px] text-red-500 hover:underline ml-1"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Standee Theme Color</label>
                    <div className="flex items-center gap-2">
                      {[
                        { name: 'Fri Chicks Red', color: '#dc2626' },
                        { name: 'Royal Blue', color: '#1d4ed8' },
                        { name: 'Emerald Green', color: '#059669' },
                        { name: 'Amber Gold', color: '#d97706' },
                        { name: 'Luxury Charcoal', color: '#1f2937' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => {
                            setStandeeColor(c.color);
                            setQrColor(c.color);
                          }}
                          style={{ backgroundColor: c.color }}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform ${
                            standeeColor === c.color ? 'scale-110 ring-2 ring-offset-2 ring-primary-500' : ''
                          }`}
                          title={c.name}
                        >
                          {standeeColor === c.color && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Local Keywords Section */}
                <div className="p-3.5 bg-primary-50/60 rounded-xl border border-primary-200">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-bold text-gray-900">Train AI with Local SEO Keywords</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2.5">
                    When customers scan your QR and generate reviews, AI will inject these keywords into Google reviews to rank your business #1!
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {newBusinessForm.keywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-white text-primary-800 border border-primary-200 font-medium">
                        {kw}
                        <button
                          type="button"
                          onClick={() => setNewBusinessForm({
                            ...newBusinessForm,
                            keywords: newBusinessForm.keywords.filter((_, idx) => idx !== i)
                          })}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newKeywordInput.trim()) {
                          e.preventDefault();
                          if (!newBusinessForm.keywords.includes(newKeywordInput.trim())) {
                            setNewBusinessForm({
                              ...newBusinessForm,
                              keywords: [...newBusinessForm.keywords, newKeywordInput.trim()]
                            });
                          }
                          setNewKeywordInput('');
                        }
                      }}
                      placeholder="e.g. Best Fast Food in Jhang"
                      className="input text-xs bg-white text-gray-900 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newKeywordInput.trim() && !newBusinessForm.keywords.includes(newKeywordInput.trim())) {
                          setNewBusinessForm({
                            ...newBusinessForm,
                            keywords: [...newBusinessForm.keywords, newKeywordInput.trim()]
                          });
                          setNewKeywordInput('');
                        }
                      }}
                      className="btn btn-secondary text-xs px-3"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="submit" className="btn btn-primary flex-1 text-xs py-3">
                    Finish Setup & Generate QR Code ⚡
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddBusinessStep(1)}
                    className="btn btn-secondary text-xs px-4"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: One-Instant QR Code Generated ("Ek Jhatke Mein!") */}
            {addBusinessStep === 3 && (
              <div className="text-center py-2 animate-fade-in space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-success-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">QR Code Generated in One Instant!</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Your QR code for <strong>{newBusinessForm.selectedGoogleBranch || newBusinessForm.name}</strong> is live and ready to print!
                  </p>
                </div>

                {/* Standee Preview Card with Brand Theme & Center Logo */}
                <div
                  style={{
                    background: `linear-gradient(145deg, ${standeeColor}, ${adjustColorBrightness(standeeColor, -25)})`,
                  }}
                  className="max-w-[280px] mx-auto p-5 rounded-3xl text-white shadow-2xl text-center relative overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {brandLogo ? (
                      <img
                        src={brandLogo}
                        alt="Logo"
                        className="w-10 h-10 rounded-full bg-white object-cover shadow-sm p-0.5 border border-white/50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-sm font-black">
                        {(newBusinessForm.selectedGoogleBranch || newBusinessForm.name || 'FC').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="text-left min-w-0">
                      <div className="font-extrabold text-sm leading-tight truncate">
                        {newBusinessForm.selectedGoogleBranch || newBusinessForm.name}
                      </div>
                      <div className="text-[10px] opacity-85 uppercase tracking-wider font-semibold">
                        Review Us On Google
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl shadow-lg inline-block my-2 border border-white/20">
                    {createdBizQr ? (
                      <img src={createdBizQr} alt="Standee QR with Logo" className="w-44 h-44 object-contain mx-auto rounded-lg" />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-gray-400 text-xs">Generating Standee QR...</div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-warning-400 text-warning-400" />
                    ))}
                  </div>
                  <div className="text-xs font-bold text-white mt-1">Point Camera to Review</div>
                  <div className="text-[10px] text-white/80 mt-0.5">⚡ AI-Powered Instant Feedback</div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  {standeePosterUrl && (
                    <button
                      type="button"
                      onClick={() => handleDownloadStandee(newBusinessForm.selectedGoogleBranch || newBusinessForm.name || 'Business')}
                      className="btn btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Standee PNG
                    </button>
                  )}
                  {createdBizQr && (
                    <a
                      href={createdBizQr}
                      download={`BizBoost-QR-${(newBusinessForm.name || 'business').toLowerCase().replace(/\s+/g, '-')}.png`}
                      className="btn btn-secondary flex-1 text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download QR
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-outline flex-1 text-xs py-2.5 flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAddBusinessModal(false);
                    setAddBusinessStep(1);
                  }}
                  className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
                >
                  Close & Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Review Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setReplyModal(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">AI Suggested Response</h3>
                <p className="text-[11px] text-gray-500">Replying to {replyModal.name}'s review</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl mb-4 text-xs text-gray-600 italic">
              "{replyModal.text}"
            </div>

            <div className="mb-4">
              <label className="label text-xs">Generated Response</label>
              {generatingReply ? (
                <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl">
                  Generating AI personalized response...
                </div>
              ) : (
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="input text-xs min-h-[100px]"
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(replyText);
                  setReplyModal(null);
                }}
                className="btn btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Response & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {upgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Upgrade Subscription</h3>
            <p className="text-xs text-gray-500 mb-5">Select an unlimited plan to boost all your restaurant locations.</p>

            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-xl border-2 border-primary-500 bg-primary-50/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-gray-900">Business Plan (10 Locations)</div>
                  <div className="text-xs text-gray-500">Unlimited AI reviews, WhatsApp alerts, staff badges</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-primary-600">PKR 2,500/mo</div>
                  <div className="text-[10px] text-gray-400">$9 / month</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-gray-900">Agency Plan (Unlimited)</div>
                  <div className="text-xs text-gray-500">Reseller rights, custom subdomains, white label QR</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-gray-900">PKR 6,000/mo</div>
                  <div className="text-[10px] text-gray-400">$22 / month</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-1 mb-5">
              <div>• <b>Payment Methods:</b> JazzCash, EasyPaisa, Bank Transfer, or Credit Card.</div>
              <div>• Contact support on WhatsApp: <b>+92 300 1234567</b></div>
            </div>

            <button
              onClick={() => setUpgradeModal(false)}
              className="btn btn-primary w-full text-xs py-2.5 font-bold"
            >
              Contact Support for Direct Activation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
