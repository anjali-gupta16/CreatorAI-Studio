# CreatorAI Studio – Instagram Growth Platform

> A premium AI-powered SaaS platform designed for Instagram creators to generate viral content, create stunning visuals, and analyze growth with data-driven insights.

## 🚀 Features

- **Real AI Caption Generator** – Powered by **Llama 3.1 (NVIDIA NIM)** for high-conversion captions and optimized hashtags.
- **AI Text-to-Image** – Generate high-quality 1024x1024 visuals instantly using **Stable Diffusion XL Turbo**.
- **Content Ideas Engine** – Get niche-specific viral post and reel ideas tailored to your audience.
- **Viral Score Predictor** – Real-time analysis of your captions with AI-driven improvement suggestions.
- **Growth Analytics** – Professional-grade charts tracking engagement, follower growth, and content performance.
- **Profile Optimizer** – Optimize your Instagram bio and username for maximum conversion.
- **Production-Ready Auth** – Secure JWT authentication with a full user management system.
- **Freemium Model** – Built-in rate limiting (5 free generations/day) with a Premium upgrade path.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vite + React 18 |
| **Styling** | Vanilla CSS (Premium Design Tokens) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB (Production-grade persistence) |
| **AI (Text)** | NVIDIA NIM (Meta Llama 3.1 8B Instruct) |
| **AI (Image)** | NVIDIA NIM (Stability AI SDXL Turbo) |
| **Auth** | JWT (JSON Web Tokens) |
| **Charts** | Chart.js |

## 📋 Prerequisites

- **Node.js** (v18+)
- **MongoDB** (Local instance running on `27017`)
- **NVIDIA NIM API Key** (Required for all AI features)

## ⚡ Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
# Create .env based on the variables below
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open in Browser

- **Frontend:** `http://localhost:3000`
- **API Health:** `http://localhost:5000/api/health`

## 🔑 Environment Variables

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/creatorai-studio
JWT_SECRET=your-production-secret-key
OPENAI_API_KEY=your-nvidia-nim-key
AI_BASE_URL=https://integrate.api.nvidia.com/v1
PORT=5000
```

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new production account |
| POST | `/api/auth/login` | Secure login |
| POST | `/api/generate-caption` | Real AI caption generation |
| POST | `/api/generate-image` | AI visual generation (SDXL Turbo) |
| POST | `/api/viral-score` | Predict engagement potential |
| GET | `/api/analytics` | Fetch growth metrics & charts |
| GET | `/api/saved` | Manage your AI-generated library |

## 💡 Production Notes

- **Real Data Only:** The "Demo Mode" has been decommissioned. A running MongoDB instance is mandatory.
- **AI Performance:** By using NVIDIA NIM endpoints, text and image generation are optimized for low latency.
- **Responsive Design:** The dashboard is optimized for Desktop, Tablet, and Mobile creators.

---
*Developed with a focus on visual excellence and creator growth.*

## 🚀 Deployment

For a full production deployment, follow the **[Deployment Guide](./deployment_guide.md)** which covers:
1. Setting up **MongoDB Atlas** for cloud data storage.
2. Deploying the **Node.js API** to Railway or Render.
3. Hosting the **React Frontend** on Vercel.
