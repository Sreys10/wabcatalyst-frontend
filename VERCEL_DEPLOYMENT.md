# Vercel Deployment Guide

This guide will help you deploy your Next.js application with authentication to Vercel.

## Required Environment Variables

You need to configure the following environment variables in Vercel:

### 1. **NEXTAUTH_SECRET** (Required)
- **Purpose**: Secret key for encrypting JWT tokens and sessions
- **How to generate**: Run `openssl rand -base64 32` in your terminal, or use an online generator
- **Example**: `a0143bedb8fd0e1da02900615d733a80`
- **Important**: Use a strong, random string (at least 32 characters)

### 2. **NEXTAUTH_URL** (Required)
- **Purpose**: The canonical URL of your site (used for OAuth callbacks)
- **Format**: `https://your-domain.vercel.app` (or your custom domain)
- **Example**: `https://bigspring-light-nextjs.vercel.app`
- **Note**: Vercel automatically provides this, but you should set it explicitly for production

### 3. **GOOGLE_CLIENT_ID** (Required for Google OAuth)
- **Purpose**: Your Google OAuth 2.0 Client ID
- **Format**: `YOUR_CLIENT_ID.apps.googleusercontent.com`
- **Example**: `1234567890-exampleid.apps.googleusercontent.com`
- **Important**: Do NOT include `http://` or `https://` prefix

### 4. **GOOGLE_CLIENT_SECRET** (Required for Google OAuth)
- **Purpose**: Your Google OAuth 2.0 Client Secret
- **Format**: `GOCSPX-...` (starts with GOCSPX)
- **Example**: `GOCSPX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure:
   - **Application type**: Web application
   - **Name**: Your app name (e.g., "Bigspring Production")
   - **Authorized JavaScript origins**: 
     - `https://your-domain.vercel.app`
     - `https://your-custom-domain.com` (if using custom domain)
   - **Authorized redirect URIs**:
     - `https://your-domain.vercel.app/api/auth/callback/google`
     - `https://your-custom-domain.com/api/auth/callback/google` (if using custom domain)
6. Copy the **Client ID** and **Client Secret**

### Step 2: Generate NEXTAUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### Step 3: Deploy to Vercel

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New Project**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   - In the Vercel project settings, go to **Settings** → **Environment Variables**
   - Add each variable for **Production**, **Preview**, and **Development** environments:

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXTAUTH_SECRET` | Your generated secret | All |
   | `NEXTAUTH_URL` | `https://your-project.vercel.app` | Production |
   | `NEXTAUTH_URL` | `https://your-branch.vercel.app` | Preview |
   | `GOOGLE_CLIENT_ID` | Your Google Client ID | All |
   | `GOOGLE_CLIENT_SECRET` | Your Google Client Secret | All |

4. **Deploy**:
   - Click **Deploy**
   - Wait for the build to complete

### Step 4: Update Google OAuth Settings (After First Deployment)

After your first deployment, Vercel will provide you with the actual URL. Update your Google OAuth settings:

1. Go back to Google Cloud Console
2. Edit your OAuth 2.0 Client ID
3. Add the actual Vercel URL to:
   - **Authorized JavaScript origins**: `https://your-actual-vercel-url.vercel.app`
   - **Authorized redirect URIs**: `https://your-actual-vercel-url.vercel.app/api/auth/callback/google`

### Step 5: Test Your Deployment

1. Visit your deployed site: `https://your-project.vercel.app`
2. Navigate to the login page
3. Test both:
   - Email/Password authentication
   - Google OAuth authentication

## Environment Variables Summary

Here's a quick reference of all required variables:

```env
NEXTAUTH_SECRET=your-generated-secret-key-here
NEXTAUTH_URL=https://your-project.vercel.app
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
```

## Troubleshooting

### Issue: "OAuth client was not found" error
- **Solution**: Verify your `GOOGLE_CLIENT_ID` doesn't have `http://` or `https://` prefix
- Check that the Client ID and Secret are correct in Vercel environment variables

### Issue: Redirect URI mismatch
- **Solution**: Ensure the redirect URI in Google Console exactly matches: `https://your-domain.vercel.app/api/auth/callback/google`

### Issue: Authentication not working after deployment
- **Solution**: 
  1. Verify all environment variables are set in Vercel
  2. Redeploy after adding environment variables (they require a new deployment)
  3. Check Vercel function logs for errors

### Issue: NEXTAUTH_URL issues
- **Solution**: Set `NEXTAUTH_URL` explicitly in Vercel, even though Vercel provides it automatically

## Additional Notes

- **Custom Domain**: If you're using a custom domain, update `NEXTAUTH_URL` and Google OAuth settings accordingly
- **Preview Deployments**: Each preview branch gets its own URL. You may want to use a wildcard in Google OAuth settings or create separate OAuth clients for staging
- **Security**: Never commit `.env.local` or `.env` files to Git (they're already in `.gitignore`)

## Quick Checklist

- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] NEXTAUTH_SECRET generated
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] All environment variables added in Vercel
- [ ] Google OAuth redirect URIs configured
- [ ] First deployment completed
- [ ] Authentication tested on production URL





