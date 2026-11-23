'use client';

import { useState } from 'react';
import { 
  Star, QrCode, MessageSquare, BarChart3, Globe, Shield, 
  Sparkles, Users, Clock, CheckCircle, ArrowRight, Play,
  Zap, Target, TrendingUp, Phone
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const features = [
    {
      icon: QrCode,
      title: { en: 'Smart QR Code System', ur: 'اسمارٹ QR کوڈ سسٹم' },
      description: { 
        en: 'One QR code at your counter. Happy customers post reviews, unhappy ones give private feedback.',
        ur: 'اپنی کاؤنٹر پر ایک QR کوڈ۔ خوش客户 گوگل پر ریویو لکھیں، ناراض客户 پرائیوٹ فیڈبیک دیں۔'
      },
    },
    {
      icon: Sparkles,
      title: { en: 'AI Review Generator', ur: 'AI ریویو جنریٹر' },
      description: { 
        en: 'Customers get AI-written review drafts in their language. They edit and post on Google themselves.',
        ur: 'کسٹمرز کو ان کی زبان میں AI لکھے ہوئے ریویو ملتے ہیں۔ وہ خود ایڈیٹ کرکے گوگل پر پوسٹ کریں۔'
      },
    },
    {
      icon: Shield,
      title: { en: 'Negative Review Filter', ur: 'منفی ریویو فلٹر' },
      description: { 
        en: '1-3 star ratings go to your private inbox first. Fix the issue before it becomes public.',
        ur: '1-3 ستارے آپ کے پرائیوٹ انباکس میں جائیں گے۔ پبلک ہونے سے پہلے مسئلہ حل کریں۔'
      },
    },
    {
      icon: BarChart3,
      title: { en: 'Profile Analytics', ur: 'پروفائل اینالیٹکس' },
      description: { 
        en: 'Track views, calls, direction requests, and review trends. Know what works.',
        ur: 'ویوز، کالز، ڈائریکشن ریلیو köny اور ریویو ٹرینڈز ٹریک کریں۔'
      },
    },
    {
      icon: Globe,
      title: { en: 'Multi-Language Support', ur: 'کثیر اللغوی سپورٹ' },
      description: { 
        en: 'Urdu, English, Hindi, and more. Serve customers in their preferred language.',
        ur: 'اردو، انگریزی، ہندی اور مزید۔ کسٹمرز کی پسندیدہ زبان میں خدمات دیں۔'
      },
    },
    {
      icon: Target,
      title: { en: 'Google Policy Compliant', ur: 'گوگل پالیسی کے مطابق' },
      description: { 
        en: '100% compliant with Google Business Profile policies. No fake reviews, no auto-posting.',
        ur: 'گوگل بزنس پروفائل پالیسیوں کے 100% مطابق۔ کوئی جعلی ریویو نہیں، کوئی آٹو پوسٹنگ نہیں۔'
      },
    },
  ];

  const pricingPlans = [
    {
      name: { en: 'Starter', ur: 'سٹارٹر' },
      price: { en: 'Free', ur: 'مفت' },
      description: { 
        en: 'Perfect for trying out',
        ur: 'آزمانے کے لیے بہترین'
      },
      features: [
        { en: '1 Business Location', ur: '1 بزنس لوکیشن' },
        { en: 'Basic QR Code', ur: 'بیسک QR کوڈ' },
        { en: '5 AI Reviews/month', ur: 'مہینے میں 5 AI ریویوز' },
        { en: 'Private Feedback', ur: 'پرائیوٹ فیڈبیک' },
      ],
      pricePKR: null,
      priceLow: null,
      priceHigh: null,
      popular: false,
    },
    {
      name: { en: 'Pro', ur: 'پرو' },
      price: { en: 'From $5/mo', ur: '$5/ماہ سے' },
      description: { 
        en: 'For growing businesses',
        ur: 'پروان چڑھتی ہوئی بزنس کے لیے'
      },
      features: [
        { en: '3 Business Locations', ur: '3 بزنس لوکیشنز' },
        { en: 'Custom QR Branding', ur: 'کسٹم QR برانڈنگ' },
        { en: '100 AI Reviews/month', ur: 'مہینے میں 100 AI ریویوز' },
        { en: 'Full Analytics', ur: 'مکمل اینالیٹکس' },
        { en: 'Priority Support', ur: 'پراورٹی سپورٹ' },
      ],
      pricePKR: 'PKR 1,000/mo',
      priceLow: '$5/mo',
      priceHigh: '$10/mo',
      popular: true,
    },
    {
      name: { en: 'Business', ur: 'بزنس' },
      price: { en: 'From $10/mo', ur: '$10/ماہ سے' },
      description: { 
        en: 'For established businesses',
        ur: 'مستحکم بزنس کے لیے'
      },
      features: [
        { en: '10 Locations', ur: '10 لوکیشنز' },
        { en: 'White Label QR', ur: 'وائٹ لیبل QR' },
        { en: 'Unlimited AI Reviews', ur: 'بے حد AI ریویوز' },
        { en: 'API Access', ur: 'API رسائی' },
        { en: 'Dedicated Manager', ur: 'مخصوص مینیجر' },
      ],
      pricePKR: 'PKR 2,000/mo',
      priceLow: '$10/mo',
      priceHigh: '$20/mo',
      popular: false,
    },
    {
      name: { en: 'Agency', ur: 'ایجنسی' },
      price: { en: 'From $25/mo', ur: '$25/ماہ سے' },
      description: { 
        en: 'For marketing agencies',
        ur: 'مارکیٹنگ ایجنسیوں کے لیے'
      },
      features: [
        { en: 'Unlimited Locations', ur: 'بے حد لوکیشنز' },
        { en: 'Reseller Rights', ur: 'ریسیلر حقوق' },
        { en: 'Custom Branding', ur: 'کسٹم برانڈنگ' },
        { en: 'Team Management', ur: 'ٹیم مینجمنٹ' },
        { en: '24/7 Support', ur: '24/7 سپورٹ' },
      ],
      pricePKR: 'PKR 5,000/mo',
      priceLow: '$25/mo',
      priceHigh: '$50/mo',
      popular: false,
    },
  ];

  const stats = [
    { value: '50,000+', label: { en: 'Businesses', ur: 'بزنسز' } },
    { value: '2M+', label: { en: 'Reviews Generated', ur: 'تخلیق کردہ ریویوز' } },
    { value: '4.8★', label: { en: 'Average Rating', ur: 'اوسط ریٹنگ' } },
    { value: '15+', label: { en: 'Countries', ur: 'ممالک' } },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container-app py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BizBoost Pro</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition">
              {language === 'en' ? 'Features' : 'خصوصیات'}
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition">
              {language === 'en' ? 'Pricing' : 'قیمتیں'}
            </a>
            <a href="#faq" className="text-gray-600 hover:text-primary-600 transition">
              {language === 'en' ? 'FAQ' : 'عمومی سوالات'}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              {language === 'en' ? 'اردو' : 'EN'}
            </button>
            <Link href="/login" className="text-gray-600 hover:text-primary-600 transition">
              {language === 'en' ? 'Login' : 'لاگ ان'}
            </Link>
            <Link href="/signup" className="btn btn-primary">
              {language === 'en' ? 'Start Free' : 'مفت شروع کریں'}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-app">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {language === 'en' ? 'AI-Powered Review System' : 'AI سے چلنے والا ریویو سسٹم'}
            </div>

            <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en' 
                ? 'Turn Every Customer Into a 5-Star Review' 
                : 'ہر کسٹمر کو 5 ستارے کا ریویو بنائیں'}
            </h1>

            <p className={`text-xl text-gray-600 mb-8 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en'
                ? 'Smart QR codes guide happy customers to Google reviews. Unhappy ones give private feedback. No fake reviews, 100% Google policy compliant.'
                : 'سمارٹ QR کوڈز خوش کسٹمرز کو گوگل ریویوز تک لے جاتے ہیں۔ ناراض客户 پرائیوٹ فیڈبیک دیں۔ کوئی جعلی ریویو نہیں، گوگل پالیسی کے مطابق۔'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/signup" className="btn btn-primary text-lg px-8 py-4">
                {language === 'en' ? 'Start Free Today' : 'آج مفت شروع کریں'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#demo" className="btn btn-secondary text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Watch Demo' : 'ڈیمو دیکھیں'}
              </a>
            </div>

            {/* Demo QR */}
            <div className="relative inline-block">
              <div className="qr-container">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <div className="qr-logo">
                  <Star className="w-8 h-8 text-warning-500" />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-success-500 text-white rounded-full text-sm whitespace-nowrap">
                {language === 'en' ? 'Scan to try!' : 'آزمانے کے لیے اسکین کریں!'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className={`text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {stat.label[language]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en' ? 'How It Works' : 'یہ کیسے کام کرتا ہے'}
            </h2>
            <p className={`text-xl text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en' ? 'Three simple steps to better reviews' : 'بہتر ریویوز کے تین آسان اقدامات'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card card-hover text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-600">1</span>
              </div>
              <h3 className={`text-xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'en' ? 'Print Your QR' : 'اپنا QR پرنٹ کریں'}
              </h3>
              <p className={`text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'en' 
                  ? 'Create your free account, add your Google Business link, and download your QR code.'
                  : 'اپنا مفت اکاؤنٹ بنائیں، گوگل بزنس لنک شامل کریں، اور QR کوڈ ڈاؤنلوڈ کریں۔'}
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-success-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-success-600">2</span>
              </div>
              <h3 className={`text-xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'en' ? 'Customers Scan' : 'کسٹمرز اسکین کریں'}
              </h3>
              <p className={`text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'en' 
                  ? 'Place QR at your counter. Customers scan, rate 1-5 stars, and get AI help if happy.'
                  : 'QR کاؤنٹر پر رکھیں۔ کسٹمرز اسکین کریں، 1-5 ستارے دیں، اور خوش ہوں تو AI مدد لیں۔'}
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-warning-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-warning-600">3</span>
              </div>
              <h3 className={`text-xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'en' ? 'Get Better Reviews' : 'بہتر ریویوز حاصل کریں'}
              </h3>
              <p className={`text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'en' 
                  ? '4-5 stars go to Google. 1-3 stars stay private so you can fix issues first.'
                  : '4-5 ستارے گوگل پر جائیں۔ 1-3 ستارے پرائیوٹ رہیں تاکہ آپ پہلے مسائل حل کر سکیں۔'}
              </p>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="mt-16 p-8 bg-white rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                <div className={`text-sm ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {language === 'en' ? 'Customer Scans QR' : 'کسٹمر QR اسکین کرتا ہے'}
                </div>
              </div>
              
              <ArrowRight className="w-8 h-8 text-gray-400 rotate-90 md:rotate-0" />
              
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-2 text-warning-500" />
                <div className={`text-sm ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {language === 'en' ? 'Rates 1-5 Stars' : '1-5 ستارے دیتا ہے'}
                </div>
              </div>
              
              <ArrowRight className="w-8 h-8 text-gray-400 rotate-90 md:rotate-0" />
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center px-6 py-4 bg-danger-50 rounded-xl">
                  <div className="text-2xl mb-2">1-3 ★</div>
                  <div className={`text-sm text-danger-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {language === 'en' ? 'Private Inbox' : 'پرائیوٹ انباکس'}
                  </div>
                </div>
                <div className="text-center px-6 py-4 bg-success-50 rounded-xl">
                  <div className="text-2xl mb-2">4-5 ★</div>
                  <div className={`text-sm text-success-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {language === 'en' ? 'Google Review' : 'گوگل ریویو'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en' ? 'Powerful Features' : 'طاقتور خصوصیات'}
            </h2>
            <p className={`text-xl text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en' ? 'Everything you need to grow your business' : 'بزنس بڑھانے کے لیے سب کچھ'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card card-hover">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {feature.title[language]}
                </h3>
                <p className={`text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {feature.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en' ? 'Simple Pricing' : 'آسان قیمتیں'}
            </h2>
            <p className={`text-xl text-gray-600 mb-8 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en' ? 'Start free, upgrade when you need more' : 'مفت شروع کریں، ضرورت ہونے پر اپگریڈ کریں'}
            </p>

            {/* Region Pricing Tabs */}
            <div className="inline-flex p-1 bg-gray-100 rounded-lg mb-8">
              <button className="px-4 py-2 rounded-lg bg-white shadow text-sm font-medium">
                {language === 'en' ? 'Pakistan' : 'پاکستان'}
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/50 transition">
                {language === 'en' ? 'Asia/Africa' : 'ایشیا/افریقہ'}
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/50 transition">
                {language === 'en' ? 'USA/Europe' : 'امریکہ/یورپ'}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative card ${plan.popular ? 'border-2 border-primary-500 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                    {language === 'en' ? 'Most Popular' : 'سب سے مقبول'}
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {plan.name[language]}
                  </h3>
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {plan.price[language]}
                  </div>
                  {plan.pricePKR && (
                    <div className="text-sm text-gray-500">
                      {plan.pricePKR} • {plan.priceLow} • {plan.priceHigh}
                    </div>
                  )}
                  <p className={`text-gray-600 text-sm mt-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                    {plan.description[language]}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${language === 'ur' ? 'font-urdu' : ''}`}>
                        {feature[language]}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/signup" 
                  className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                >
                  {language === 'en' ? 'Get Started' : 'شروع کریں'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {language === 'en' ? 'Frequently Asked Questions' : 'عمومی سوالات'}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: { en: 'Is this compliant with Google policies?', ur: 'کیا یہ گوگل پالیسیوں کے مطابق ہے؟' },
                a: { en: 'Yes! We never auto-post reviews or create fake content. Customers scan, write, and post themselves. AI only helps them draft what they want to say.', ur: 'جی ہاں! ہم کبھی بھی ریویوز آٹو پوسٹ نہیں کرتے یا جعلی مواد نہیں بناتے۔ کسٹمرز خود اسکین کرتے ہیں، لکھتے ہیں، اور پوسٹ کرتے ہیں۔ AI صرف انہیں ڈرافٹ کرنے میں مدد کرتا ہے۔' }
              },
              {
                q: { en: 'How does the negative review filter work?', ur: 'منفی ریویو فلٹر کیسے کام کرتا ہے؟' },
                a: { en: 'When customers give 1-3 stars, their feedback goes to your private inbox instead of Google. You can contact them and fix the issue before it becomes public.', ur: 'جب کسٹمر 1-3 ستارے دیتے ہیں، تو ان کا فیڈبیک گوگل کی بجائے آپ کے پرائیوٹ انباکس میں جاتا ہے۔ آپ ان سے رابطہ کر سکتے ہیں اور پبلک ہونے سے پہلے مسئلہ حل کر سکتے ہیں۔' }
              },
              {
                q: { en: 'Do customers need to download an app?', ur: 'کیا کسٹمرز کو ایپ ڈاؤنلوڈ کرنی ہوگی؟' },
                a: { en: 'No app needed! They just scan the QR code with their phone camera and everything works in their browser.', ur: 'کوئی ایپ کی ضرورت نہیں! وہ صرف اپنے فون کیمرے سے QR کوڈ اسکین کریں اور سب کچھ ان کے براؤزر میں کام کرے گا۔' }
              },
              {
                q: { en: 'Can I cancel anytime?', ur: 'کیا میں کسی بھی وقت منسوخ کر سکتا ہوں؟' },
                a: { en: 'Yes, you can cancel your subscription anytime. No questions asked, no penalties.', ur: 'جی ہاں، آپ کسی بھی وقت اپنی سبسکرپشن منسوخ کر سکتے ہیں۔ کوئی سوال نہیں، کوئی جرمانہ نہیں۔' }
              },
            ].map((faq, index) => (
              <div key={index} className="card">
                <h3 className={`text-lg font-bold mb-3 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {faq.q[language]}
                </h3>
                <p className={`text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {faq.a[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container-app text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {language === 'en' ? 'Ready to Boost Your Business?' : 'اپنا بزنس بڑھانے کے لیے تیار ہیں؟'}
          </h2>
          <p className={`text-xl mb-8 opacity-90 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {language === 'en' 
              ? 'Join thousands of businesses already using BizBoost Pro'
              : 'ہزاروں بزنسز میں شامل ہوں جو پہلے سے BizBoost Pro استعمال کر رہے ہیں'}
          </p>
          <Link href="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
            {language === 'en' ? 'Start Free Today' : 'آج مفت شروع کریں'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container-app">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">BizBoost Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                {language === 'en' 
                  ? 'AI-powered Google Business Profile optimization'
                  : 'AI سے چلنے والا گوگل بزنس پروفائل آپٹیمائیزیشن'}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{language === 'en' ? 'Product' : 'پروڈکٹ'}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features">{language === 'en' ? 'Features' : 'خصوصیات'}</a></li>
                <li><a href="#pricing">{language === 'en' ? 'Pricing' : 'قیمتیں'}</a></li>
                <li><a href="#faq">{language === 'en' ? 'FAQ' : 'عمومی سوالات'}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{language === 'en' ? 'Legal' : 'قانونی'}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/privacy">{language === 'en' ? 'Privacy Policy' : 'پرائیویسی پالیسی'}</a></li>
                <li><a href="/terms">{language === 'en' ? 'Terms of Service' : 'سروس کی شرائط'}</a></li>
                <li><a href="/refund">{language === 'en' ? 'Refund Policy' : 'رقم واپسی کی پالیسی'}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{language === 'en' ? 'Contact' : 'رابطہ'}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +92 300 1234567
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  support@bizboost.pro
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 BizBoost Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
