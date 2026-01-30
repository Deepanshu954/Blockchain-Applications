# Deployment Guide

This guide provides step-by-step instructions for deploying the **Blockchain Applications** platform to Vercel.

## 🚀 Deploying to Vercel

Vercel is the recommended platform for deploying Next.js applications.

### 1. Prerequisites
- A [Vercel account](https://vercel.com/signup).
- The project pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connection
1.  Log in to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the `Blockchain-Applications` repository from your Git provider.

### 3. Configuration
Vercel should automatically detect that this is a **Next.js** project and configure the build settings for you:
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

> **Note on Dependencies:**
> This project uses `legacy-peer-deps=true` (configured in `.npmrc`) to resolve dependency conflicts between React 19 and some map libraries. Vercel will automatically pick this up, so standard `npm install` will work fine.

### 4. Environment Variables
If your project uses environment variables (e.g., API keys), add them in the **"Environment Variables"** section during import.
*(Currently, this project does not strictly require external API keys for the base visualization features.)*

### 5. Deploy
Click **"Deploy"**. Vercel will pull the code, install dependencies, build the project, and deploy it to a collection of edges.

### Troubleshooting

#### Peer Dependency Errors (React 19 vs libraries)
If you encounter an error like `Conflicting peer dependency: react@18.3.1`, it means the `.npmrc` file might be missing or ignored.
**Solution:**
1.  Go to your Project Settings on Vercel.
2.  Go to **General** -> **Build & Development Settings**.
3.  Switch "Install Command" to **Override**.
4.  Enter: `npm install --legacy-peer-deps`
5.  Redeploy.

#### 404 on Routes
Ensure your file structure follows the Next.js App Router conventions (`app/page.tsx`, `app/[slug]/page.tsx`, etc.).

## 🌍 Other Hosting Options

### Docker
You can containerize this application for deployment on any provider (AWS, Azure, DigitalOcean).
1.  Create a `Dockerfile`.
2.  Build the image: `docker build -t blockchain-app .`
3.  Run the container: `docker run -p 3000:3000 blockchain-app`
