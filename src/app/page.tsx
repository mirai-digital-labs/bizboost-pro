'use client';

import { useState, useEffect } from 'react';
import { 
  Star, QrCode, MessageSquare, BarChart3, Globe, Shield, 
  Sparkles, Users, CheckCircle, ArrowRight, Play,
  TrendingUp, Phone, X, ChevronDown, Check, Copy, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [region, setRegion] = useState<'PK' | 'ASIA' | 'GLOBAL'>('PK');
  const [demoOpen, setDemoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'refund' | null>(null);
  const [heroQrUrl, setHeroQrUrl] = useState<string>('');

  // Generate real demo QR on mount
  useEffect(() => {
    const demoUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/scan/demo`
      : 'https://bizboost-pro.vercel.app/scan/demo';

    QRCode.toDataURL(demoUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#1d4ed8', light: '#ffffff' },
    })
      .then(url => setHeroQrUrl(url))
      .catch(err => console.warn('QR gen error:', err));
  }, []);

  const features = [
    {
      icon: QrCode,
      title: { en: 'Smart QR Code System', ur: 'اسمارٹ QR کوڈ سسٹم' },
      description: { 
        en: 'One QR code at your counter. Happy customers post reviews, unhappy ones give private feedback.',
        ur: 'اپنی کاؤنٹر پر ایک QR کوڈ۔ خوش کسٹمرز گوگل پر ریویو لکھیں، ناراض کسٹمرز پرائیوٹ فیڈبیک دیں۔'
      },
    },
    {
      icon: Sparkles,
      title: { en: 'AI Review Generator', ur: 'AI ریویو جنریٹر' },
      description: { 
        en: 'Customers get instant authentic AI review drafts in English or Urdu. They copy and post on Google.',
        ur: 'کسٹمرز کو ان کی زبان میں AI کے لکھے ہوئے بہترین ریویوز ملتے ہیں۔ وہ ایک کلک پر کاپی کر کے گوگل پر پوسٹ کر سکتے ہیں۔'
      },
    },
    {
      icon: Shield,
      title: { en: 'Negative Review Shield', ur: 'منفی ریویو شیلڈ' },
      description: { 
        en: '1-3 star ratings go straight to your private inbox first. Fix the issue before it damages your rating.',
        ur: '1 سے 3 ستارے کسٹمرز کا نجی فیڈبیک بن کر آپ کے ڈیش بورڈ میں آئیں گے تاکہ پبلک ریٹنگ محفوظ رہے۔'
      },
    },
    {
      icon: BarChart3,
      title: { en: 'Live Analytics & Tracking', ur: 'لائیو اینالیٹکس اور ٹریکنگ' },
      description: { 
        en: 'Track QR scans, reviews converted, profile views, and monthly trends directly in real-time.',
        ur: 'QR اسکینز، حاصل کردہ ریویوز، پروفائل ویوز، اور ماہانہ کارکردگی براہ راست ڈیش بورڈ پر دیکھیں۔'
      },
    },
    {
      icon: Globe,
      title: { en: 'Bilingual (Urdu + English)', ur: 'اردو اور انگلش سپورٹ' },
      description: { 
        en: 'Designed specifically for local Pakistani & international customers with authentic Urdu Nastaliq typography.',
        ur: 'پاکستانی اور عالمی مارکیٹ کے لیے خوبصورت نستعلیق اور آسان انگریزی میں تیار کردہ۔'
      },
    },
    {
      icon: CheckCircle,
      title: { en: '100% Google Compliant', ur: 'گوگل پالیسی کے 100% مطابق' },
      description: { 
        en: 'Fully compliant with Google Business Profile policies. No bot spam, real verified customers.',
        ur: 'گوگل کے تمام اصول و ضوابط کے عین مطابق۔ کوئی جعلی بوٹس نہیں، صرف حقیقی کسٹمرز۔'
      },
    },
  ];

  const pricingData = {
    PK: {
      currencyLabel: 'Pakistan (PKR)',
      plans: [
        { name: 'Starter', price: 'Free', period: 'Lifetime', pkr: 'PKR 0', features: ['1 Location', 'Basic QR Code', '5 AI Reviews / mo', 'Private Feedback Filter'], popular: false },
        { name: 'Pro', price: 'PKR 1,000', period: '/ month', pkr: '$3.50 / mo', features: ['3 Locations', 'Custom Branded QR', '100 AI Reviews / mo', 'Full Analytics Dashboard', 'Priority WhatsApp Support'], popular: true },
        { name: 'Business', price: 'PKR 2,500', period: '/ month', pkr: '$9 / mo', features: ['10 Locations', 'White-Label QR Stands', 'Unlimited AI Reviews', 'Weekly Growth Audit', 'Dedicated Account Manager'], popular: false },
        { name: 'Agency', price: 'PKR 6,000', period: '/ month', pkr: '$22 / mo', features: ['Unlimited Locations', 'Reseller Dashboard', 'Custom Subdomain', 'Staff QR Badges', '24/7 Phone Support'], popular: false },
      ]
    },
    ASIA: {
      currencyLabel: 'Asia & Middle East (USD)',
      plans: [
        { name: 'Starter', price: 'Free', period: 'Lifetime', pkr: '$0', features: ['1 Location', 'Basic QR Code', '5 AI Reviews / mo', 'Private Feedback Filter'], popular: false },
        { name: 'Pro', price: '$5', period: '/ month', pkr: 'AED 18 / mo', features: ['3 Locations', 'Custom Branded QR', '100 AI Reviews / mo', 'Full Analytics Dashboard', 'Priority Support'], popular: true },
        { name: 'Business', price: '$12', period: '/ month', pkr: 'AED 44 / mo', features: ['10 Locations', 'White-Label QR Stands', 'Unlimited AI Reviews', 'Weekly Growth Audit', 'Dedicated Manager'], popular: false },
        { name: 'Agency', price: '$29', period: '/ month', pkr: 'AED 105 / mo', features: ['Unlimited Locations', 'Reseller Dashboard', 'Custom Branding', 'Staff QR Badges', '24/7 Phone Support'], popular: false },
      ]
    },
    GLOBAL: {
      currencyLabel: 'US & Europe (USD)',
      plans: [
        { name: 'Starter', price: 'Free', period: 'Lifetime', pkr: '$0', features: ['1 Location', 'Basic QR Code', '5 AI Reviews / mo', 'Private Feedback Filter'], popular: false },
        { name: 'Pro', price: '$9', period: '/ month', pkr: '€8.50 / mo', features: ['3 Locations', 'Custom Branded QR', '100 AI Reviews / mo', 'Full Analytics Dashboard', 'Priority Support'], popular: true },
        { name: 'Business', price: '$24', period: '/ month', pkr: '€22 / mo', features: ['10 Locations', 'White-Label QR Stands', 'Unlimited AI Reviews', 'Weekly Growth Audit', 'Dedicated Manager'], popular: false },
        { name: 'Agency', price: '$59', period: '/ month', pkr: '€55 / mo', features: ['Unlimited Locations', 'Reseller Dashboard', 'Custom Branding', 'Staff QR Badges', '24/7 Phone Support'], popular: false },
      ]
    }
  };

  const stats = [
    { value: '50,000+', label: { en: 'QR Scans Handled', ur: 'اسکینز مکمل' } },
    { value: '25,000+', label: { en: '5-Star Reviews Generated', ur: '5-اسٹار ریویوز حاصل' } },
    { value: '4.9 ★', label: { en: 'Client Average Rating', ur: 'اوسط ریٹنگ اضافہ' } },
    { value: '98%', label: { en: 'Negative Reviews Shielded', ur: 'منفی ریویوز فلٹر' } },
  ];

  return (
    <div className={`min-h-screen bg-white ${language === 'ur' ? 'font-urdu' : ''}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container-app py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              BizBoost <span className="text-primary-600">Pro</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <a href="#features" className="hover:text-primary-600 transition">
              {language === 'en' ? 'Features' : 'خصوصیات'}
            </a>
            <a href="#how-it-works" className="hover:text-primary-600 transition">
              {language === 'en' ? 'How it Works' : 'یہ کیسے کام کرتا ہے'}
            </a>
            <a href="#pricing" className="hover:text-primary-600 transition">
              {language === 'en' ? 'Pricing' : 'قیمتیں'}
            </a>
            <a href="#faq" className="hover:text-primary-600 transition">
              {language === 'en' ? 'FAQ' : 'عمومی سوالات'}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'en' ? 'اردو' : 'EN'}
            </button>
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-primary-600 px-3 py-1.5 transition">
              {language === 'en' ? 'Login' : 'لاگ ان'}
            </Link>
            <Link href="/signup" className="btn btn-primary text-sm px-4 py-2 shadow-sm shadow-primary-500/30">
              {language === 'en' ? 'Start Free' : 'مفت شروع کریں'}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary-50/70 via-white to-white">
        <div className="container-app">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-700 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'en' ? 'Smart AI Google Review Manager' : 'گوگل ریویوز بڑھانے کا سمارٹ AI سسٹم'}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                {language === 'en' ? (
                  <>Turn Every Customer Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">5-Star Review</span></>
                ) : (
                  <>ہر کسٹمر کو بنائیں <span className="text-primary-600">5-اسٹار گوگل ریویو</span></>
                )}
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                {language === 'en'
                  ? 'Happy customers scan your smart QR code and post authentic AI-written Google reviews in seconds. Unhappy customers give private feedback directly to you.'
                  : 'خوش کسٹمرز آپ کا اسمارٹ QR کوڈ اسکین کر کے AI کے لکھے ہوئے بہترین ریویوز سیکنڈوں میں گوگل پر پوسٹ کرتے ہیں۔ ناراض کسٹمرز کا فیڈبیک پرائیوٹ رہتا ہے۔'}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/signup" className="btn btn-primary text-base px-8 py-3.5 shadow-lg shadow-primary-600/25 w-full sm:w-auto">
                  {language === 'en' ? 'Create Free QR Code' : 'مفت QR کوڈ بنائیں'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <button 
                  onClick={() => setDemoOpen(true)}
                  className="btn btn-secondary text-base px-6 py-3.5 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-primary-600 fill-primary-600" />
                  {language === 'en' ? 'Watch Interactive Demo' : 'ڈیمو آزمائیں'}
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  {language === 'en' ? 'No credit card needed' : 'کریڈٹ کارڈ کی ضرورت نہیں'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  {language === 'en' ? 'Takes 2 minutes' : 'صرف 2 منٹ کا سیٹ اپ'}
                </span>
              </div>
            </div>

            {/* Live Scannable Demo QR Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full text-center">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-success-600 to-success-500 text-white text-xs font-bold rounded-full shadow-md">
                  {language === 'en' ? '★ SCAN WITH YOUR PHONE' : '★ اپنے موبائل سے اسکین کریں'}
                </div>

                <div className="mb-4 mt-2">
                  <h3 className="font-bold text-gray-900 text-lg">Royal Spice Restaurant</h3>
                  <p className="text-xs text-gray-500">Live Demo QR Stand</p>
                </div>

                <div className="p-3 bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-100/70 inline-block mb-4 shadow-inner">
                  {heroQrUrl ? (
                    <img src={heroQrUrl} alt="Demo QR Code" className="w-52 h-52 mx-auto rounded-xl shadow-sm" />
                  ) : (
                    <div className="w-52 h-52 bg-white rounded-xl flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-primary-500 animate-pulse" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  {language === 'en'
                    ? 'Scan with your camera to experience the customer review flow.'
                    : 'اپنے کیمرے سے اسکین کر کے دیکھیں کہ کسٹمر کو کیسا تجربہ ملے گا۔'}
                </p>

                <Link
                  href="/scan/demo"
                  className="btn btn-outline text-xs w-full py-2.5 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Open Customer View in Browser' : 'براؤزر میں ٹیسٹ کریں'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50/70">
                <div className="text-2xl sm:text-3xl font-black text-primary-600 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label[language]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50/60">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {language === 'en' ? 'How BizBoost Pro Works' : 'یہ کیسے کام کرتا ہے'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              {language === 'en' ? '3 simple steps to grow your 5-star Google reputation' : 'گوگل ریٹنگ بڑھانے کے تین آسان اقدامات'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center relative overflow-hidden group hover:border-primary-300 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-2xl group-hover:scale-110 transition">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === 'en' ? 'Place Smart QR' : 'اسمارٹ QR رکھیں'}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'en'
                  ? 'Print your custom QR code on table tents, receipts, or checkout counter in seconds.'
                  : 'اپنا کسٹم QR کوڈ ٹیبلز، کاؤنٹر یا بل پر چسپاں کریں۔'}
              </p>
            </div>

            <div className="card text-center relative overflow-hidden group hover:border-warning-300 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-warning-100 flex items-center justify-center text-warning-600 font-black text-2xl group-hover:scale-110 transition">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === 'en' ? 'Customers Rate 1-5' : 'کسٹمر ریٹنگ دیں'}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'en'
                  ? 'No app needed. Customers scan with camera, tap star rating, and give honest feedback.'
                  : 'بغیر کسی ایپ کے، کسٹمر کیمرے سے اسکین کر کے فوراً ستارے منتخب کرتا ہے۔'}
              </p>
            </div>

            <div className="card text-center relative overflow-hidden group hover:border-success-300 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-success-100 flex items-center justify-center text-success-600 font-black text-2xl group-hover:scale-110 transition">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === 'en' ? 'Smart Review Routing' : 'سمارٹ فلٹر'}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'en'
                  ? '4-5 stars get Gemini AI drafts and post on Google. 1-3 stars send private feedback to you.'
                  : '4-5 ستارے AI ریویو کے ساتھ گوگل پر جاتے ہیں، جبکہ 1-3 ستارے پرائیوٹ فیڈبیک رہتے ہیں۔'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {language === 'en' ? 'Everything Your Business Needs' : 'طاقتور خصوصیات'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              {language === 'en' ? 'Automate review collection without breaking Google rules' : 'گوگل قوانین کے مطابق حقیقی ریویوز حاصل کریں'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, index) => (
              <div key={index} className="card hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5 text-white shadow-sm">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title[language]}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feat.description[language]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50/70 border-t border-gray-100">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {language === 'en' ? 'Simple, Transparent Pricing' : 'آسان اور شفاف قیمتیں'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              {language === 'en' ? 'Start for free today and upgrade as you scale' : 'آج مفت شروع کریں اور جب ضرورت ہو اپگریڈ کریں'}
            </p>

            {/* Region Selector Tabs */}
            <div className="inline-flex p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
              <button
                onClick={() => setRegion('PK')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  region === 'PK' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇵🇰 Pakistan (PKR)
              </button>
              <button
                onClick={() => setRegion('ASIA')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  region === 'ASIA' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇦🇪 Asia & Gulf
              </button>
              <button
                onClick={() => setRegion('GLOBAL')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  region === 'GLOBAL' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇺🇸 US & Europe
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingData[region].plans.map((plan, i) => (
              <div 
                key={i} 
                className={`card flex flex-col justify-between relative ${
                  plan.popular ? 'border-2 border-primary-500 shadow-xl bg-white' : 'border border-gray-100 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
                    {language === 'en' ? 'MOST POPULAR' : 'سب سے مقبول'}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-xs text-gray-500 font-medium">{plan.period}</span>
                  </div>
                  <div className="text-xs text-primary-600 font-semibold mb-6">{plan.pkr}</div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <Check className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/signup"
                  className={`btn w-full text-xs py-2.5 font-bold ${
                    plan.popular ? 'btn-primary shadow-sm shadow-primary-500/30' : 'btn-secondary'
                  }`}
                >
                  {language === 'en' ? 'Choose Plan' : 'پلان منتخب کریں'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container-app max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {language === 'en' ? 'Frequently Asked Questions' : 'عمومی سوالات'}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {language === 'en' ? 'Everything you need to know about BizBoost Pro' : 'بزنس ریویوز سے متعلق اہم معلومات'}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: { en: 'Is this compliant with Google Review Guidelines?', ur: 'کیا یہ گوگل پالیسیوں کے 100% مطابق ہے؟' },
                a: { en: 'Yes, 100%. We do not post fake reviews or auto-generate submissions. The customer writes, verifies, and posts the review from their own Google account.', ur: 'جی ہاں، بالکل! ہم کوئی بوٹس یا خودکار ریویوز پوسٹ نہیں کرتے۔ کسٹمر خود اپنے گوگل اکاؤنٹ سے ریویو کی توثیق کر کے پوسٹ کرتا ہے۔' }
              },
              {
                q: { en: 'How does the negative review shield work?', ur: 'منفی ریویو فلٹر کیسے کام کرتا ہے؟' },
                a: { en: 'When a customer gives 1-3 stars, instead of sending them to Google Maps, BizBoost opens a private feedback form. The owner receives an instant alert to solve the issue privately.', ur: 'جب کسٹمر 1 سے 3 ستارے دیتا ہے تو سسٹم اسے گوگل میپس پر لے جانے کے بجائے پرائیوٹ فیڈبیک فارم دکھاتا ہے تاکہ آپ مسئلہ فوراً حل کر سکیں۔' }
              },
              {
                q: { en: 'Do customers need to download any mobile app?', ur: 'کیا کسٹمرز کو کوئی ایپ ڈاؤنلوڈ کرنی پڑے گی؟' },
                a: { en: 'No app is required! Any mobile phone camera scans the QR code and opens instantly in their browser.', ur: 'بالکل نہیں! کسٹمر صرف اپنے فون کے عام کیمرے سے اسکین کرتا ہے اور براؤزر میں صفحہ کھل جاتا ہے۔' }
              },
              {
                q: { en: 'Can I print QR codes on my own banners and tables?', ur: 'کیا میں اپنے بینرز اور کارڈز پر QR پرنٹ کر سکتا ہوں؟' },
                a: { en: 'Yes, the dashboard provides high-resolution PNG and print-ready formats that you can print on stickers, bill folders, and table stands.', ur: 'جی ہاں، ڈیش بورڈ سے ہائی ریزولوشن QR کوڈ ملتا ہے جسے آپ ٹیبل اسٹینڈز، بل بک اور اسٹیکرز پر لگا سکتے ہیں۔' }
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-gray-900 bg-white hover:bg-gray-50 transition"
                >
                  <span className="text-sm sm:text-base">{item.q[language]}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180 text-primary-600' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-1 text-sm text-gray-600 bg-gray-50/50 border-t border-gray-100 leading-relaxed">
                    {item.a[language]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 gradient-primary text-white text-center">
        <div className="container-app max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {language === 'en' ? 'Start Getting 5-Star Reviews Today' : 'آج ہی اپنے 5-اسٹار ریویوز بڑھائیں'}
          </h2>
          <p className="text-base sm:text-lg opacity-90 mb-8 max-w-xl mx-auto">
            {language === 'en'
              ? 'Join restaurants, cafes, and retail stores boosting their local Google ranking with BizBoost Pro.'
              : 'سینکڑوں لوکل بزنسز کے ساتھ شامل ہوں اور اپنی سیلز اور ریٹنگ میں اضافہ کریں۔'}
          </p>
          <Link href="/signup" className="btn bg-white text-primary-700 hover:bg-gray-100 font-bold px-8 py-3.5 shadow-lg">
            {language === 'en' ? 'Create Your Account' : 'اپنا اکاؤنٹ بنائیں'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white text-xs">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold">
                  B
                </div>
                <span className="font-extrabold text-sm text-white">BizBoost Pro</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Google Business Profile AI Review Booster for local businesses.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How it Works</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/scan/demo" className="hover:text-white">Customer Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Legal & Terms</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setLegalModal('privacy')} className="hover:text-white">Privacy Policy</button></li>
                <li><button onClick={() => setLegalModal('terms')} className="hover:text-white">Terms of Service</button></li>
                <li><button onClick={() => setLegalModal('refund')} className="hover:text-white">Refund Policy</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@bizboost.pro</li>
                <li>WhatsApp: +92 300 1234567</li>
                <li>Lahore, Pakistan</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-gray-500 gap-4">
            <p>© 2026 BizBoost Pro. All rights reserved.</p>
            <p>100% Compliant with Google Business Policies.</p>
          </div>
        </div>
      </footer>

      {/* Interactive Demo Walkthrough Modal */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setDemoOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3 text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Experience Live Customer Demo</h3>
              <p className="text-xs text-gray-500 mt-1">See exactly what your restaurant or store customer sees</p>
            </div>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center">1</span>
                <span>Customer taps 5 stars after their meal.</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center">2</span>
                <span>Gemini AI generates 3 customized review drafts in English/Urdu.</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center">3</span>
                <span>Customer taps 'Copy' and posts straight to Google in 5 seconds.</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/scan/demo"
                className="btn btn-primary flex-1 text-center py-2.5 text-sm"
              >
                Launch Demo in Browser
              </Link>
              <button
                onClick={() => setDemoOpen(false)}
                className="btn btn-secondary px-4 py-2.5 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Information Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setLegalModal(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize">
              {legalModal === 'privacy' && 'Privacy Policy'}
              {legalModal === 'terms' && 'Terms of Service'}
              {legalModal === 'refund' && 'Refund Policy'}
            </h3>

            <div className="text-xs text-gray-600 space-y-2 mb-6 max-h-60 overflow-y-auto">
              <p>BizBoost Pro values your privacy. We store business profile links and customer rating metrics securely. We never sell personal data or automate fake reviews.</p>
              <p>Subscriptions can be cancelled at any time without fees. Refunds are granted within 7 days of purchase upon request.</p>
            </div>

            <button
              onClick={() => setLegalModal(null)}
              className="btn btn-primary w-full py-2 text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
