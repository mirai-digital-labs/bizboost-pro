import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface ReviewGenerationOptions {
  rating: number;
  aspects?: string[];
  language?: string;
  businessName?: string;
  businessType?: string;
  tone?: 'professional' | 'casual' | 'enthusiastic';
}

export interface PostGenerationOptions {
  type: 'update' | 'offer' | 'event' | 'product';
  businessName: string;
  businessType: string;
  details?: string;
  language?: string;
}

/**
 * Fallback generator when Gemini API Key is not set or network issue occurs
 */
function getFallbackReviewDrafts(options: ReviewGenerationOptions): string[] {
  const { businessName = 'this business', language = 'en', rating = 5, aspects = [] } = options;
  const aspectsList = aspects.filter(Boolean);
  const aspectStr = aspectsList.length > 0 ? aspectsList.slice(0, 3).join(', ') : 'service & quality';

  if (language === 'ur') {
    if (rating >= 4) {
      return [
        `${businessName} میں بہترین تجربہ رہا! خاص طور پر ${aspectStr} لاجواب تھی۔ سب کو ضرور آزمانا چاہیے!`,
        `${businessName} جا کر بہت خوشی ہوئی۔ اسٹاف کا رویہ اور ${aspectStr} بہت زبردست تھا۔ میں دوبارہ ضرور آؤں گا!`,
        `${businessName} نے میری تمام توقعات پوری کر دیں۔ عمدہ کوالٹی، مناسب قیمت اور بہترین ماحول!`,
      ];
    }
    return [
      `${businessName} میں تجربہ ٹھیک رہا، البتہ سروس اور کوالٹی میں کچھ بہتری کی گنجائش ہے۔`,
      `مناسب تجربہ رہا، مگر توقعات سے تھوڑا کم تھا۔ امید ہے آئندہ بہتر ہوگا۔`,
      `${businessName} کا معیار اوسط درجے کا رہا، کچھ چیزوں پر توجہ کی ضرورت ہے۔`,
    ];
  }

  // English fallback
  if (rating >= 4) {
    return [
      `Amazing experience at ${businessName}! The ${aspectStr} was truly exceptional. Highly recommended to everyone!`,
      `Had a wonderful visit to ${businessName}. Great atmosphere, polite staff, and especially loved the ${aspectStr}. Will definitely be back!`,
      `${businessName} exceeded all my expectations! Authentic quality, great attention to detail, and top-notch value. A must-visit!`,
    ];
  }

  return [
    `Decent experience at ${businessName}. The service was satisfactory, but there is definitely room for improvement.`,
    `Average experience overall. Some aspects were good, but certain areas need more attention.`,
    `An okay visit to ${businessName}. Helpful staff, but the wait time could be improved.`,
  ];
}

/**
 * Generate AI review draft using Gemini
 */
export async function generateReviewDraft(options: ReviewGenerationOptions): Promise<string> {
  const { rating, aspects = [], language = 'en', businessName = 'this business', businessType = 'business', tone = 'enthusiastic' } = options;

  if (!genAI || !process.env.GEMINI_API_KEY) {
    const fallbacks = getFallbackReviewDrafts(options);
    return fallbacks[0];
  }

  const languagePrompts: Record<string, string> = {
    en: 'Write in English',
    ur: 'اردو میں لکھیں (Write in authentic, natural Urdu)',
    hi: 'हिंदी में लिखें (Write in Hindi)',
    ar: 'اكتب بالعربية (Write in Arabic)',
  };

  const toneInstructions = {
    professional: 'Keep it professional and concise.',
    casual: 'Keep it friendly and casual.',
    enthusiastic: 'Make it enthusiastic and detailed.',
  };

  const aspectText = aspects.length > 0 
    ? `Focus on these aspects: ${aspects.join(', ')}.` 
    : '';

  const prompt = `You are writing a genuine customer review. Generate a natural-sounding ${rating}-star review for a ${businessType} called "${businessName}".

${languagePrompts[language] || languagePrompts.en}

Requirements:
- ${toneInstructions[tone]}
- ${aspectText}
- Keep it between 40-80 words
- Make it sound authentic, like a real customer wrote it
- Do not mention prices or specific dates
- The customer visited recently and had a ${rating >= 4 ? 'great' : rating >= 3 ? 'decent' : 'poor'} experience

Generate only the review text, nothing else. No quotes, no explanations.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.warn('Gemini API call failed, using high-quality fallback template:', error);
    const fallbacks = getFallbackReviewDrafts(options);
    return fallbacks[0];
  }
}

/**
 * Generate multiple review variations for customer to choose from
 */
export async function generateReviewVariations(
  options: ReviewGenerationOptions,
  count: number = 3
): Promise<string[]> {
  if (!genAI || !process.env.GEMINI_API_KEY) {
    return getFallbackReviewDrafts(options).slice(0, count);
  }

  try {
    const promises = Array.from({ length: count }, (_, i) => 
      generateReviewDraft({ ...options, tone: i === 0 ? 'enthusiastic' : i === 1 ? 'casual' : 'professional' })
    );
    return await Promise.all(promises);
  } catch (err) {
    console.warn('Error generating review variations, falling back:', err);
    return getFallbackReviewDrafts(options).slice(0, count);
  }
}

/**
 * Generate Google Business post content
 */
export async function generatePostContent(options: PostGenerationOptions): Promise<{ title: string; content: string }> {
  const { type, businessName, businessType, details, language = 'en' } = options;

  if (!genAI || !process.env.GEMINI_API_KEY) {
    return {
      title: `Special Update from ${businessName}!`,
      content: `Welcome to ${businessName}! We are delighted to serve you with the finest quality and exceptional service. Visit us today or get in touch for more information!`,
    };
  }

  const languagePrompts: Record<string, string> = {
    en: 'Write in English',
    ur: 'اردو میں لکھیں',
    hi: 'हिंदी میں لکھیں',
  };

  const typeInstructions = {
    update: 'an update about new offerings, changes, or news',
    offer: 'a special offer, discount, or promotion announcement',
    event: 'an upcoming event announcement',
    product: 'a new product or service launch announcement',
  };

  const prompt = `Generate ${typeInstructions[type]} for "${businessName}", a ${businessType}.

${languagePrompts[language] || languagePrompts.en}

Additional details: ${details || 'No specific details provided'}

Requirements:
- Create an engaging title (max 58 characters)
- Write compelling content (max 1500 characters)
- Include a clear call-to-action
- Make it suitable for Google Business Profile post

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{"title": "Your title here", "content": "Your content here"}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let cleanText = response.text().trim();
    
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.slice(7);
    }
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const parsed = JSON.parse(cleanText);
    return {
      title: parsed.title || '',
      content: parsed.content || '',
    };
  } catch (error) {
    console.error('Error generating post with Gemini:', error);
    return {
      title: `Special Update from ${businessName}!`,
      content: `We look forward to welcoming you at ${businessName}. Discover our latest offerings today!`,
    };
  }
}

/**
 * Generate response to customer review
 */
export async function generateReviewResponse(
  reviewText: string,
  rating: number,
  businessName: string,
  language: string = 'en'
): Promise<string> {
  if (!genAI || !process.env.GEMINI_API_KEY) {
    return rating >= 4
      ? `Thank you so much for your wonderful review! We are delighted to know that you had a great time at ${businessName}. We look forward to welcoming you again soon!`
      : `Thank you for sharing your feedback. We apologize that your experience did not meet expectations. Please reach out to us directly so we can resolve this for you.`;
  }

  const languagePrompts: Record<string, string> = {
    en: 'Respond in English',
    ur: 'اردو میں جواب دیں',
    hi: 'हिंदी में जवाब दें',
  };

  const prompt = `You are the owner of "${businessName}". Generate a professional response to this ${rating}-star review.

Customer's Review: "${reviewText}"

${languagePrompts[language] || languagePrompts.en}

Requirements:
- Be professional and ${rating >= 4 ? 'grateful and appreciative' : rating >= 3 ? 'appreciative and understanding' : 'apologetic and solution-focused'}
- ${rating <= 3 ? 'Acknowledge their concerns and offer to make it right' : 'Thank them for specific points they mentioned'}
- Keep it between 50-100 words
- Do not offer monetary compensation
- Include the business name naturally
- Sound genuine and caring

Generate only the response text, nothing else.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating response with Gemini:', error);
    return `Thank you for taking the time to review ${businessName}. Your feedback is truly valued!`;
  }
}

export default genAI;
