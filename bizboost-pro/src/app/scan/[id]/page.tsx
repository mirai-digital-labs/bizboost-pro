'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, MessageSquare, Sparkles, CheckCircle, ArrowLeft,
  Globe, Edit3, Copy, Check
} from 'lucide-react';

export default function ScanPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = (params?.id as string) || '';

  const [step, setStep] = useState<'rate' | 'review' | 'done'>('rate');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [aiDrafts, setAiDrafts] = useState<string[]>([]);
  const [selectedDraft, setSelectedDraft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Multi-Aspect ratings from video transcript (Product, Staff, Pricing, Billing, Cleanliness)
  const [aspectRatings, setAspectRatings] = useState({
    products: 5,
    staff: 5,
    pricing: 5,
    billing: 5,
    cleanliness: 5,
  });

  // Quick-tap positive chips (What was great?)
  const [selectedChips, setSelectedChips] = useState<string[]>([
    'Helpful Staff',
    'Clean Store',
    'Genuine Products'
  ]);

  // Business state
  const [business, setBusiness] = useState<{
    name: string;
    type?: string;
    googleReviewUrl?: string;
  }>({
    name: 'Loading Business...',
    type: 'Restaurant & Cafe',
    googleReviewUrl: '',
  });

  // Fetch business data on mount
  useEffect(() => {
    if (!businessId) return;

    fetch(`/api/scan/${businessId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.business) {
          setBusiness(data.business);
        }
      })
      .catch((err) => {
        console.warn('Could not load business details:', err);
      });
  }, [businessId]);

  // Handle rating selection
  const handleRatingSelect = (value: number) => {
    setRating(value);
    setTimeout(() => {
      setStep('review');
    }, 400);
  };

  // Generate AI review drafts (passing multi-aspect details from video transcript)
  const generateAiDrafts = async () => {
    setLoading(true);

    const aspects = [
      ...selectedChips,
      aspectRatings.products === 5 ? 'Top Product Range' : '',
      aspectRatings.staff === 5 ? 'Helpful & Courteous Staff' : '',
      aspectRatings.pricing === 5 ? 'Great Pricing & Value' : '',
      aspectRatings.billing === 5 ? 'Fast Billing Speed' : '',
      aspectRatings.cleanliness >= 4 ? 'Clean & Neat Ambience' : '',
    ].filter(Boolean);

    try {
      const response = await fetch('/api/reviews/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          rating,
          language,
          aspects,
        }),
      });

      const data = await response.json();
      if (data.drafts && data.drafts.length > 0) {
        setAiDrafts(data.drafts);
      }
    } catch (err) {
      console.warn('Failed to fetch AI drafts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Copy review to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Submit private feedback (1-3 stars)
  const handleSubmitFeedback = async () => {
    try {
      await fetch(`/api/scan/${businessId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          customerName,
          text: reviewText,
        }),
      });
    } catch (err) {
      console.warn('Feedback submit error:', err);
    }
    setStep('done');
  };

  // Go to Google to post review (4-5 stars)
  const goToGoogle = async () => {
    const targetUrl =
      business.googleReviewUrl ||
      `https://search.google.com/local/writereview?placeid=${businessId}`;

    window.open(targetUrl, '_blank');

    try {
      await fetch(`/api/scan/${businessId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          customerName,
          text: aiDrafts[selectedDraft] || '',
          aiGeneratedText: aiDrafts[selectedDraft] || '',
          isPublic: true,
        }),
      });
    } catch (err) {
      console.warn('Could not record review submission:', err);
    }

    setStep('done');
  };

  // Render rating step
  const renderRateStep = () => (
    <div className="text-center animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {language === 'en' ? 'How was your experience?' : 'آپ کا تجربہ کیسا تھا؟'}
        </h1>
        <p className={`text-gray-600 ${language === 'ur' ? 'font-urdu' : ''}`}>
          {business.name}
        </p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingSelect(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform duration-200 hover:scale-110 focus:outline-none"
          >
            <Star
              className={`w-12 h-12 md:w-16 md:h-16 transition-colors duration-200 ${
                star <= (hoveredRating || rating)
                  ? 'text-warning-500 fill-warning-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Rating Labels */}
      <div className="flex justify-center gap-4 text-sm">
        {[
          { value: 1, en: 'Poor', ur: 'برا' },
          { value: 2, en: 'Fair', ur: 'ٹھیک' },
          { value: 3, en: 'Good', ur: 'اچھا' },
          { value: 4, en: 'Very Good', ur: 'بہت اچھا' },
          { value: 5, en: 'Excellent', ur: 'عمدہ' },
        ].map((label) => (
          <span
            key={label.value}
            className={`${rating === label.value ? 'font-bold text-warning-500' : 'text-gray-400'}`}
          >
            {language === 'en' ? label.en : label.ur}
          </span>
        ))}
      </div>
    </div>
  );

  // Render review step
  const renderReviewStep = () => {
    // Low rating (1-3 stars) - Private feedback
    if (rating <= 3) {
      return (
        <div className="text-center animate-fade-in max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-warning-100 flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-warning-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'en' ? "We're sorry to hear that" : 'ہمیں افسوس ہے'}
          </h1>
          
          <p className={`text-gray-600 mb-8 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {language === 'en'
              ? 'Your feedback will be sent directly to the business owner so they can make things right.'
              : 'آپ کا فیڈبیک براہ راست بزنس مالک کو بھیجا جائے گا تاکہ وہ بہتری لا سکیں۔'}
          </p>

          <div className="space-y-4 text-left">
            <div>
              <label className={`label ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'en' ? 'Your Name (Optional)' : 'آپ کا نام (اختیاری)'}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input bg-white text-gray-900 placeholder:text-gray-400"
                placeholder={language === 'en' ? 'Enter your name' : 'اپنا نام درج کریں'}
              />
            </div>

            <div>
              <label className={`label ${language === 'ur' ? 'font-urdu' : ''}`}>
                {language === 'en' ? 'What went wrong?' : 'کیا غلط ہوا؟'}
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="input min-h-[120px] bg-white text-gray-900 placeholder:text-gray-400"
                placeholder={language === 'en' ? 'Tell us about your experience...' : 'اپنے تجربے کے بارے میں بتائیں...'}
              />
            </div>

            <button
              onClick={handleSubmitFeedback}
              className="btn btn-primary w-full"
            >
              {language === 'en' ? 'Submit Feedback' : 'فیڈبیک جمع کرائیں'}
            </button>
          </div>
        </div>
      );
    }

    // High rating (4-5 stars) - Google review
    return (
      <div className="text-center animate-fade-in max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 ${star <= rating ? 'text-warning-500 fill-warning-500' : 'text-gray-300'}`}
            />
          ))}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'en' ? "Awesome! We're glad you enjoyed!" : 'شاندار! ہمیں خوشی ہے!'}
        </h1>
        
        <p className={`text-gray-600 mb-8 ${language === 'ur' ? 'font-urdu' : ''}`}>
          {language === 'en'
            ? `Share your experience on Google to help others discover ${business.name}`
            : `گوگل پر اپنا تجربہ شیئر کریں تاکہ دوسرے ${business.name} کو دریافت کر سکیں`}
        </p>

        {/* High rating (4-5 stars) - Google Review Funnel with Aspect Ratings (Transcript Flow) */}
        {aiDrafts.length === 0 ? (
          <div className="space-y-6 text-left max-w-lg mx-auto">
            {/* Aspect Ratings (from video 4:03 - 4:22) */}
            <div className="card bg-white shadow-sm border border-gray-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                {language === 'en' ? 'Rate specific aspects of your visit:' : 'اپنے دورے کے مختلف پہلوؤں کی درجہ بندی کریں:'}
              </h3>

              {[
                { key: 'products' as const, label: language === 'en' ? 'Product Range & Quality' : 'پروڈکٹ کوالٹی اور ورائٹی' },
                { key: 'staff' as const, label: language === 'en' ? 'Staff Behavior & Politeness' : 'عملے کا رویہ اور اخلاق' },
                { key: 'pricing' as const, label: language === 'en' ? 'Pricing & Value for Money' : 'قیمت اور مناسب ریٹ' },
                { key: 'billing' as const, label: language === 'en' ? 'Billing & Service Speed' : 'بلنگ اور سروس کی رفتار' },
                { key: 'cleanliness' as const, label: language === 'en' ? 'Store Cleanliness & Ambience' : 'صفائی ستھرائی اور ماحول' },
              ].map((aspect) => (
                <div key={aspect.key} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">{aspect.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setAspectRatings({ ...aspectRatings, [aspect.key]: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            star <= aspectRatings[aspect.key]
                              ? 'text-warning-500 fill-warning-500'
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick-Tap Tags ("What was great?" from video 4:22 - 4:36) */}
            <div className="card bg-white shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                {language === 'en' ? 'What was great? (Tap to select)' : 'سب سے زیادہ کیا اچھا لگا؟'}
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                {language === 'en'
                  ? 'Tap a few highlights so AI can craft your personalized review:'
                  : 'چند خصوصیات منتخب کریں تاکہ AI آپ کا ریویو خود تیار کرے:'}
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Helpful Staff',
                  'Clean Store',
                  'Genuine Products',
                  'Great Pricing',
                  'Fast Billing',
                  'Authentic Quality',
                  'Wonderful Ambience',
                  'Will Visit Again',
                ].map((tag) => {
                  const isSelected = selectedChips.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedChips(selectedChips.filter((c) => c !== tag));
                        } else {
                          setSelectedChips([...selectedChips, tag]);
                        }
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        isSelected
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate AI Review Button */}
            <button
              onClick={generateAiDrafts}
              disabled={loading}
              className="btn btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner mr-2" />
                  {language === 'en' ? 'AI is drafting 3 reviews...' : 'AI ریویو تیار کر رہا ہے...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-warning-300" />
                  {language === 'en' ? 'Generate 3 AI Reviews Based on My Experience ✨' : 'میرے تجربے کے مطابق AI ریویو بنائیں ✨'}
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-8 text-left max-w-lg mx-auto">
            <div className="text-center mb-4">
              <h3 className="font-bold text-base text-gray-900">
                {language === 'en' ? 'Pick the best review draft:' : 'بہترین ڈرافٹ منتخب کریں:'}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'en' ? 'Select one, copy and post on Google Maps in 5 seconds!' : 'ایک منتخب کریں، کاپی کریں اور 5 سیکنڈ میں گوگل پر پوسٹ کریں!'}
              </p>
            </div>
            
            {aiDrafts.map((draft, index) => (
              <div
                key={index}
                onClick={() => setSelectedDraft(index)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedDraft === index
                    ? 'border-primary-500 bg-primary-50/70 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-primary-600">Draft #{index + 1}</span>
                  {selectedDraft === index && (
                    <span className="text-[10px] font-bold bg-primary-600 text-white px-2 py-0.5 rounded-full">Selected</span>
                  )}
                </div>
                <p className={`text-xs text-gray-800 leading-relaxed ${language === 'ur' ? 'font-urdu text-right' : 'text-left'}`}>
                  {draft}
                </p>
              </div>
            ))}

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  copyToClipboard(aiDrafts[selectedDraft]);
                  goToGoogle();
                }}
                className="btn btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Copy className="w-4 h-4" />
                {copied
                  ? (language === 'en' ? 'Copied! Opening Google Maps...' : 'کاپی ہو گیا! گوگل میپس کھل رہا ہے...')
                  : (language === 'en' ? 'Copy Review & Open Google Maps 🚀' : 'ریویو کاپی کریں اور گوگل میپس کھولیں 🚀')}
              </button>

              <button
                type="button"
                onClick={() => setAiDrafts([])}
                className="text-xs text-gray-500 hover:text-gray-700 text-center py-1"
              >
                {language === 'en' ? '← Tweak Aspects & Regenerate' : '← دوبارہ منتخب کریں'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render done step
  const renderDoneStep = () => (
    <div className="text-center animate-fade-in">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success-100 flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-success-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {rating <= 3
          ? (language === 'en' ? 'Thank you for your feedback!' : 'آپ کے فیڈبیک کا شکریہ!')
          : (language === 'en' ? 'Thank you for your review!' : 'آپ کے ریویو کا شکریہ!')}
      </h1>

      <p className={`text-gray-600 mb-8 ${language === 'ur' ? 'font-urdu' : ''}`}>
        {rating <= 3
          ? (language === 'en'
              ? 'The business owner will receive your feedback and work to improve.'
              : 'بزنس مالک آپ کا فیڈبیک وصول کرے گا اور بہتری لائے گا۔')
          : (language === 'en'
              ? 'Your review helps others discover great businesses!'
              : 'آپ کا ریویو دوسروں کو بہترین بزنسز تلاش کرنے میں مدد کرتا ہے!')}
      </p>

      <button
        onClick={() => router.push('/')}
        className="btn btn-secondary"
      >
        {language === 'en' ? 'Home' : 'ہوم'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="container-app py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step !== 'rate' && (
              <button
                onClick={() => setStep(step === 'done' ? 'review' : 'rate')}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center font-bold text-primary-600">
              {business.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-gray-900">{business.name}</div>
              <div className="text-sm text-gray-500">{business.type}</div>
            </div>
          </div>

          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'اردو' : 'EN'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-app py-12">
        {step === 'rate' && renderRateStep()}
        {step === 'review' && renderReviewStep()}
        {step === 'done' && renderDoneStep()}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3">
        <div className="container-app flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Powered by</span>
          <span className="font-bold text-primary-600">BizBoost Pro</span>
        </div>
      </footer>
    </div>
  );
}
