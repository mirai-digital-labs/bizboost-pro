'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, QrCode, MessageSquare, BarChart3, Settings,
  Users, Star, TrendingUp, Bell, LogOut, Plus, Eye, Phone,
  MapPin, Calendar, ChevronRight, ExternalLink, Download,
  CheckCircle, Shield, Sparkles, X, Check, Copy, RefreshCw,
  Sliders, MessageCircle
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

  const [newBusinessForm, setNewBusinessForm] = useState({
    name: '',
    location: '',
    category: 'Restaurant',
    googlePlaceId: '',
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

  // Settings State
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

  // Handle Add Business
  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusinessForm.name) return;

    const newId = `biz-${Date.now()}`;
    const newBiz = {
      id: newId,
      name: newBusinessForm.name,
      location: newBusinessForm.location || 'Pakistan',
      category: newBusinessForm.category,
      reviews: 0,
      rating: 5.0,
      googlePlaceId: newBusinessForm.googlePlaceId,
    };

    setBusinesses([newBiz, ...businesses]);
    setSelectedBusinessId(newId);
    setNewBusinessForm({ name: '', location: '', category: 'Restaurant', googlePlaceId: '' });
    setAddBusinessModal(false);
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
              onClick={() => setAddBusinessModal(true)}
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
                    <button onClick={() => setAddBusinessModal(true)} className="text-xs text-primary-600 font-bold hover:underline">
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

      {/* Add Business Modal */}
      {addBusinessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setAddBusinessModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Add Business Location</h3>
            <p className="text-xs text-gray-500 mb-5">Create a dedicated QR code stand for your new branch.</p>

            <form onSubmit={handleAddBusiness} className="space-y-4">
              <div>
                <label className="label text-xs">Branch / Business Name</label>
                <input
                  type="text"
                  value={newBusinessForm.name}
                  onChange={(e) => setNewBusinessForm({ ...newBusinessForm, name: e.target.value })}
                  placeholder="e.g. Royal Spice - DHA Branch"
                  className="input text-sm"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">City / Area</label>
                <input
                  type="text"
                  value={newBusinessForm.location}
                  onChange={(e) => setNewBusinessForm({ ...newBusinessForm, location: e.target.value })}
                  placeholder="e.g. DHA Phase 5, Lahore"
                  className="input text-sm"
                />
              </div>

              <div>
                <label className="label text-xs">Category</label>
                <select
                  value={newBusinessForm.category}
                  onChange={(e) => setNewBusinessForm({ ...newBusinessForm, category: e.target.value })}
                  className="input text-sm"
                >
                  <option value="Restaurant">Restaurant & Cafe</option>
                  <option value="Retail Store">Retail Store & Boutique</option>
                  <option value="Salon & Spa">Salon, Spa & Beauty</option>
                  <option value="Medical Clinic">Clinic & Hospital</option>
                  <option value="Auto Service">Auto Workshop & Detailing</option>
                </select>
              </div>

              <div>
                <label className="label text-xs">Google Review Link / Place ID (Optional)</label>
                <input
                  type="text"
                  value={newBusinessForm.googlePlaceId}
                  onChange={(e) => setNewBusinessForm({ ...newBusinessForm, googlePlaceId: e.target.value })}
                  placeholder="Paste your Google Maps review URL"
                  className="input text-sm"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="btn btn-primary flex-1 text-xs py-2.5">
                  Generate Location QR
                </button>
                <button
                  type="button"
                  onClick={() => setAddBusinessModal(false)}
                  className="btn btn-secondary text-xs px-4"
                >
                  Cancel
                </button>
              </div>
            </form>
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
