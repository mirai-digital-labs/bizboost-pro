'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, QrCode, MessageSquare, BarChart3, Settings,
  Users, Star, TrendingUp, Bell, LogOut, Plus, Eye, Phone,
  MapPin, Calendar, ChevronRight, ExternalLink, Download,
  CheckCircle, Shield, Sparkles, X, Check, Copy, RefreshCw,
  Sliders, MessageCircle, Search, Loader2, Printer, Building2
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import QRCode from 'qrcode';

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

  // QR Code Tab State
  const [qrColor, setQrColor] = useState('#1d4ed8');
  const [selectedBusinessId, setSelectedBusinessId] = useState('kb-1');
  const [generatedQrUrl, setGeneratedQrUrl] = useState('');

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
  const [newBusinessForm, setNewBusinessForm] = useState({
    name: '',
    phone: '',
    selectedGoogleBranch: '',
    city: '',
    state: '',
    country: 'Pakistan',
    category: 'Retail Store & Wholesale',
    googlePlaceId: '',
    googleReviewUrl: '',
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
    'Best Sarees Shop in Pune',
    'Best Wholesale Saree in Pune',
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

  // Generate QR when selected business or color changes
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bizboost-pro.vercel.app';
    const scanUrl = `${origin}/scan/${selectedBusinessId}`;

    QRCode.toDataURL(scanUrl, {
      width: 360,
      margin: 2,
      color: { dark: qrColor, light: '#ffffff' },
    })
      .then(url => setGeneratedQrUrl(url))
      .catch(err => console.warn('QR error:', err));
  }, [selectedBusinessId, qrColor]);

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
    const cityName = place.city || 'Pune';
    
    // Dynamic high-converting Local SEO keywords tailored to category & city
    let autoKeywords = ['Helpful Staff', 'Affordable Pricing', 'High Quality'];
    const cat = (place.category || '').toLowerCase();
    if (cat.includes('saree') || cat.includes('wholesale') || cat.includes('retail') || cat.includes('clothing')) {
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
      country: place.country || 'India',
      category: place.category || 'Retail Store & Wholesale',
      googlePlaceId: place.placeId || '',
      googleReviewUrl: place.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${place.placeId}`,
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
      category: 'Retail Store & Wholesale',
      googlePlaceId: '',
      googleReviewUrl: '',
      keywords: ['Best Quality', 'Helpful Staff', 'Affordable Pricing'],
    });
    setAddBusinessModal(true);
  };

  // Handle Add Business (Transcript flow)
  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = newBusinessForm.selectedGoogleBranch || newBusinessForm.name;
    if (!finalName) return;

    const newId = `biz-${Date.now()}`;
    const fullLocation = [newBusinessForm.city, newBusinessForm.state, newBusinessForm.country].filter(Boolean).join(', ') || 'Pune, India';
    const newBiz = {
      id: newId,
      name: finalName,
      location: fullLocation,
      category: newBusinessForm.category,
      reviews: selectedPlace?.userRatingsTotal || 45,
      rating: selectedPlace?.rating || 4.9,
      googlePlaceId: newBusinessForm.googlePlaceId || 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    };

    setBusinesses([newBiz, ...businesses]);
    setSelectedBusinessId(newId);

    // Generate QR in one instant ("Ek Jhatke Mein")
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bizboost-pro.vercel.app';
      const scanUrl = `${origin}/scan/${newId}`;
      const qrDataUrl = await QRCode.toDataURL(scanUrl, {
        width: 380,
        margin: 2,
        color: { dark: qrColor, light: '#ffffff' },
      });
      setCreatedBizQr(qrDataUrl);
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

                  <div>
                    <label className="label text-xs">QR Code Brand Color</label>
                    <div className="flex items-center gap-3">
                      {[
                        { name: 'Royal Blue', color: '#1d4ed8' },
                        { name: 'Emerald Green', color: '#059669' },
                        { name: 'Classic Dark', color: '#111827' },
                        { name: 'Warm Red', color: '#dc2626' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          onClick={() => setQrColor(c.color)}
                          style={{ backgroundColor: c.color }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${
                            qrColor === c.color ? 'scale-110 ring-2 ring-offset-2 ring-primary-500' : ''
                          }`}
                          title={c.name}
                        >
                          {qrColor === c.color && <Check className="w-4 h-4 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs text-gray-600">
                    <div className="font-bold text-gray-900">Print Instructions:</div>
                    <div>• Recommended size for Table Tent: <b>4" × 6" inches</b></div>
                    <div>• Recommended size for Bill Book sticker: <b>2" × 2" inches</b></div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <a
                      href={generatedQrUrl}
                      download={`bizboost-qr-${selectedBusinessId}.png`}
                      className="btn btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download High-Res PNG
                    </a>
                    <Link
                      href={`/scan/${selectedBusinessId}`}
                      target="_blank"
                      className="btn btn-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Test
                    </Link>
                  </div>
                </div>

                <div className="text-center bg-gray-50/70 p-6 rounded-2xl border border-gray-200">
                  <div className="p-4 bg-white rounded-2xl shadow-md inline-block mb-3">
                    <img src={generatedQrUrl} alt="QR Code" className="w-60 h-60 mx-auto" />
                  </div>
                  <div className="font-bold text-sm text-gray-900">
                    {businesses.find(b => b.id === selectedBusinessId)?.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Ready for Print & Digital Display</div>
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
            <div className="card border border-gray-100 bg-warning-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning-100 text-warning-700 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Protected Private Complaints Inbox</h3>
                  <p className="text-xs text-gray-600">These customers had issues. Contact them directly to resolve their complaint before they write publicly.</p>
                </div>
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
                    Train the AI with your target local keywords (e.g. <em>"Best Sarees Shop in Pune"</em>, <em>"Best Biryani in Karachi"</em>). When customer scans the QR, the AI naturally weaves these keywords into their Google reviews to boost your Google 3-Pack Maps ranking!
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
                      placeholder="Type keyword & press Enter (e.g. Best Sarees Shop in Pune)"
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
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>
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
                      placeholder="e.g. Hari Om Wholesale, Kababjees, or Karachi Biryani..."
                      className="input pl-10 pr-10 text-sm bg-white text-gray-900"
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

                {/* Manager Contact Number / WhatsApp for Negative Review Shield Alerts */}
                <div>
                  <label className="label text-xs">Manager Phone / WhatsApp (For Review Alerts)</label>
                  <input
                    type="text"
                    value={newBusinessForm.phone}
                    onChange={(e) => setNewBusinessForm({ ...newBusinessForm, phone: e.target.value })}
                    placeholder="e.g. 7744900878 or +92 300 1234567"
                    className="input text-sm bg-white text-gray-900"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    When a customer gives 1-3 stars, an instant alert will be sent here so you can resolve it privately.
                  </p>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newBusinessForm.name && !placesQuery) {
                        setPlacesQuery('Hari Om Wholesale');
                        setNewBusinessForm(prev => ({
                          ...prev,
                          name: 'Hari Om Wholesale - Kalewadi Branch',
                          selectedGoogleBranch: 'Hari Om Wholesale - Kalewadi Branch',
                          city: 'Pune',
                          state: 'Maharashtra',
                          country: 'India',
                          category: 'Retail Store & Saree Wholesale',
                        }));
                      }
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
                      <option value="Retail Store & Saree Wholesale">Retail Store & Saree Wholesale</option>
                      <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                      <option value="Salon & Beauty">Salon, Spa & Beauty</option>
                      <option value="Clinic & Healthcare">Clinic & Healthcare</option>
                      <option value="Auto Workshop & Detailing">Auto Workshop & Services</option>
                      <option value="Fashion & Boutique">Fashion & Clothing</option>
                    </select>
                  </div>
                  <div>
                    <label className="label text-xs">City / Area</label>
                    <input
                      type="text"
                      value={newBusinessForm.city || 'Pune'}
                      onChange={(e) => setNewBusinessForm({ ...newBusinessForm, city: e.target.value })}
                      className="input text-xs bg-white text-gray-900"
                      placeholder="e.g. Pune or Karachi"
                    />
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
                      placeholder="e.g. Best Sarees Shop in Pune"
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

                {/* Standee Preview Card */}
                <div className="max-w-[260px] mx-auto p-4 rounded-2xl bg-gradient-to-b from-primary-600 to-primary-800 text-white shadow-xl">
                  <div className="text-[10px] font-bold tracking-wider uppercase opacity-90 mb-1">Scan To Review Us</div>
                  <div className="font-bold text-sm truncate mb-3">{newBusinessForm.selectedGoogleBranch || newBusinessForm.name}</div>
                  
                  <div className="bg-white p-3 rounded-xl shadow-inner inline-block">
                    {createdBizQr ? (
                      <img src={createdBizQr} alt="Standee QR" className="w-40 h-40 object-contain mx-auto" />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center text-gray-400 text-xs">Generating QR...</div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-warning-400 text-warning-400" />
                    ))}
                  </div>
                  <div className="text-[10px] opacity-80 mt-1">AI-Powered Review Assistant</div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  {createdBizQr && (
                    <a
                      href={createdBizQr}
                      download={`BizBoost-Standee-${(newBusinessForm.name || 'business').toLowerCase().replace(/\s+/g, '-')}.png`}
                      className="btn btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Standee PNG
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-secondary flex-1 text-xs py-2.5 flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Standee
                  </button>
                  <a
                    href={`/scan/${selectedBusinessId}`}
                    target="_blank"
                    className="btn btn-outline flex-1 text-xs py-2.5 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Test Customer Scan
                  </a>
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
