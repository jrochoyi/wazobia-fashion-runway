# Wazobia Fashion Runway Voting

A minimal mobile-first voting gallery for Cultural Sunday. Next.js + Supabase + Vercel.

## Features
- QR-friendly public gallery, mobile responsive.
- Filter contestants by tribe.
- Vote with a single tap; browser/device token limits repeat voting.
- Admin password login, contestant photo upload, name, tribe and story.
- Admin compilation and vote totals; refresh totals; deactivate contestants.
- Photo uploads stored in Supabase Storage.

## Setup

### 1. Create a Supabase project
Create a project at https://supabase.com. In SQL Editor, run the contents of `supabase.sql`.

### 2. Configure environment variables
Copy `.env.example` to `.env.local`, then fill in:
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: service role key (server-side only, never expose in browser)
- `ADMIN_PASSWORD`: a strong password for the admin dashboard

### 3. Install and run locally
```bash
npm install
npm run dev
```
Visit http://localhost:3000. Admin at http://localhost:3000/admin.

### 4. Push to GitHub
```bash
git init
git add .
git commit -m "Build Wazobia runway voting"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/wazobia-runway-voting.git
git push -u origin main
```
Do not commit `.env.local` or service-role secrets.

### 5. Deploy on Vercel
Import the GitHub repository into Vercel. Add the four environment variables above in Project Settings → Environment Variables, then deploy.

### 6. Create and share the QR code
Once deployed, use the public Vercel URL (the root page, not `/admin`) to create the QR code. The QR code can be printed, shown on the LED screen, or shared on WhatsApp.

## Voting behavior and limitations
The voting interface is designed to allow one vote per browser/device by storing a random token locally and enforcing uniqueness in the database. It is not a high-security voting identity system: a determined person can use a different device/browser or clear local data. For a church showcase, it balances frictionless voting with basic duplicate resistance. If strict identity-based voting is required, use phone OTP or another identity verification method.
