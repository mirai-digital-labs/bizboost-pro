# BizBoost Pro - Google Business Profile SaaS

AI-powered Google Business Profile Review Booster & QR Management System for restaurants and local businesses.

---

## 🚀 Quick Setup & Local Run

### 1. Requirements
- Node.js (v18 or v20 recommended)

### 2. Install Dependencies
```bash
cd bizboost-pro
npm install
```

### 3. Setup Database (SQLite Local)
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ 100% Free Production Deployment (Vercel + Supabase)

### 1. Database Setup (Supabase - 100% Free)
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. In Project Settings -> Database, copy the **Connection string (URI)** (Transaction Pooler or Direct).
3. In `prisma/schema.prisma`, change datasource provider to:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Deploy to Vercel (100% Free)
1. Push your code to your GitHub repository.
2. Open [https://vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Add these Environment Variables in Vercel settings:
   - `DATABASE_URL` = Your Supabase PostgreSQL Connection String
   - `NEXTAUTH_SECRET` = A random secret string (e.g. run `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = Your production domain (e.g. `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` = Your production domain
   - `GEMINI_API_KEY` = Free API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)
5. Click **Deploy**. Vercel will build and launch your full-stack SaaS in 2 minutes!

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Urdu Nastaliq support
- **Auth**: NextAuth.js
- **Database ORM**: Prisma (SQLite for local dev, PostgreSQL for production)
- **AI**: Google Gemini 1.5 Flash (for auto-generating 5-star customer reviews)
- **QR Code**: qrcode library with custom colors
