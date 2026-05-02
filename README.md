# CreatorAI Studio – Premium Instagram Growth Platform

> A professional, AI-powered SaaS platform designed for Instagram creators to automate content creation, generate stunning visuals, and analyze growth with data-driven insights. Built for speed, aesthetic excellence, and high conversion.

![App Screenshot](./landing_preview.png)

## 🚀 Key Features

- **Pro AI Caption Generator** – Powered by **Llama 3.1 (NVIDIA NIM)** with emoji-rich, high-conversion captions and smart hashtag suggestions.
- **Advanced AI Visuals** – Generate high-quality 1024x1024 visuals instantly using **Stable Diffusion XL Turbo** and **FLUX-1 Schnell**.
- **AI Reel Script Generator** – Turn any topic into a professional 60-second script with scene descriptions and audio cues.
- **Smart Hashtag Research** – Discover trending and niche-specific hashtags to explode your reach.
- **Viral Score Predictor** – Real-time analysis of your content with AI-driven improvement suggestions.
- **Social Media Planner** – Plan your content calendar and save your best AI-generated creations.
- **Growth Analytics** – Professional-grade interactive charts tracking engagement, follower growth, and content performance.
- **Profile Optimizer** – Audit and optimize your Instagram bio for maximum follower conversion.
- **Premium Subscription Flow** – Integrated Stripe-ready payment flow with dynamic redirection and plan management.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vite + React 18 |
| **Styling** | Vanilla CSS (Premium Glassmorphism & Design Tokens) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB (Mongoose ODM) |
| **AI (Text)** | NVIDIA NIM (Meta Llama 3.1 8B / 70B Instruct) |
| **AI (Image)** | NVIDIA NIM (Stability AI SDXL Turbo / BFL Flux Schnell) |
| **Payments** | Stripe Integration (Ready for Production) |
| **Charts** | Chart.js |

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas)
- **NVIDIA NIM API Key** (Get yours at build.nvidia.com)
- **Stripe API Key** (Optional, for payment testing)

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/anjali-gupta16/CreatorAI-Studio.git
cd CreatorAI-Studio
```

### 2. Setup Backend
```bash
cd backend
npm install
# Create .env file (see template below)
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Access the App
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`

## 🔑 Environment Variables (`backend/.env`)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/creatorai-studio

# Security
JWT_SECRET=your_secure_random_string

# AI Configuration (NVIDIA NIM)
OPENAI_API_KEY=your_nvidia_api_key
AI_BASE_URL=https://integrate.api.nvidia.com/v1

# Optional: Dedicated Image Key (Google/NVIDIA)
IMAGE_API_KEY=your_dedicated_image_key

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
```

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new creator account |
| POST | `/api/generate-caption` | Generate emoji-rich captions |
| POST | `/api/generate-image` | High-speed AI visual generation |
| POST | `/api/generate-reel-script` | Professional video scripts |
| POST | `/api/research-hashtags` | Trending hashtag analysis |
| GET | `/api/analytics` | Real-time growth metrics |

## 💡 Production Philosophy

- **Resilience:** Built-in AI model failover system. If one model is down, the system automatically tries alternatives.
- **Performance:** Optimized for low-latency responses using NVIDIA's GPU-accelerated inference.
- **UX First:** Designed with a "Premium-First" mindset, featuring smooth animations, dark mode, and intuitive workflows.

---
*Built for the next generation of digital creators.*
