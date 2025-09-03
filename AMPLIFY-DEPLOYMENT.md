# AWS Amplify Deployment Guide for GreenCred

## 🚀 Deploy GreenCred Frontend to AWS Amplify

### Option 1: GitHub Integration (Recommended)

#### Step 1: Push to GitHub
1. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Repository name: `greencred-esg-platform`
   - Make it public or private
   - Don't initialize with README (we already have files)

2. **Push your local repository**:
   ```bash
   git remote add origin https://github.com/[YOUR-USERNAME]/greencred-esg-platform.git
   git branch -M main
   git push -u origin main
   ```

#### Step 2: Connect to Amplify
1. **Go to AWS Amplify Console**: https://console.aws.amazon.com/amplify/
2. **Get Started** → **Host web app**
3. **Connect GitHub** → Authorize AWS Amplify
4. **Select Repository**: `greencred-esg-platform`
5. **Branch**: `main`
6. **Click Next**

#### Step 3: Configure Build Settings
- **App name**: `greencred-production`
- **Environment**: `prod`
- **Build settings**: Use the auto-detected settings or paste:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

#### Step 4: Environment Variables
Add these environment variables in Amplify:
- `NEXT_PUBLIC_USE_AWS_BACKEND` = `true`
- `NEXT_PUBLIC_AWS_API_BASE_URL` = `https://6xzu4v9rs4.execute-api.us-east-1.amazonaws.com/prod`

#### Step 5: Deploy
- **Review settings** → **Save and Deploy**
- Wait 3-5 minutes for deployment
- Get your live URL: `https://main.d[random-id].amplifyapp.com`

### Option 2: Manual Deployment

#### Step 1: Build Production
```bash
npm run build
npm run export  # If using static export
```

#### Step 2: Upload to Amplify
1. **Amplify Console** → **Host web app**
2. **Deploy without Git provider**
3. **Drag and drop** your `.next` folder
4. **App name**: `greencred-manual`
5. **Deploy**

## 🔧 Post-Deployment Steps

### 1. Test Your Live App
- Visit your Amplify URL
- Test ESG calculation with live backend
- Verify loan application submission
- Check all functionality works

### 2. Custom Domain (Optional)
1. **Domain management** in Amplify Console
2. **Add domain** → Enter your domain
3. **Configure DNS** with your domain provider
4. **SSL certificate** auto-provisioned

### 3. Performance Optimization
- **Enable compression**
- **Set cache headers**
- **CDN distribution** (automatically enabled)

## 📊 Expected Results

### ✅ What You'll Get:
- **Live URL**: `https://main.d[id].amplifyapp.com`
- **Global CDN**: Fast loading worldwide
- **HTTPS**: SSL certificate included
- **Auto-deployment**: Updates on git push
- **Monitoring**: Built-in analytics

### 🎯 Performance Targets:
- **Load time**: < 2 seconds
- **Performance score**: 90+ (Lighthouse)
- **SEO optimized**: Meta tags included
- **Mobile responsive**: Works on all devices

## 🛠️ Troubleshooting

### Common Issues:
1. **Build failures**: Check Node.js version (18.x required)
2. **API errors**: Verify environment variables
3. **CORS issues**: Backend already configured for CORS
4. **Route issues**: Next.js SSG export may be needed

### Quick Fixes:
```bash
# If build fails locally
npm ci
npm run build

# Check environment variables
echo $NEXT_PUBLIC_USE_AWS_BACKEND

# Test API connectivity
curl https://6xzu4v9rs4.execute-api.us-east-1.amazonaws.com/prod/api/calculate-score
```

## 🎉 Success Checklist
- [ ] GitHub repository created and pushed
- [ ] Amplify app connected to GitHub
- [ ] Build successful (green checkmark)
- [ ] Live URL accessible
- [ ] ESG calculation works with AWS backend
- [ ] Loan application submits to DynamoDB
- [ ] All pages load correctly
- [ ] Mobile responsive design works
- [ ] Console shows no critical errors

## 🔗 Useful Links
- **Amplify Console**: https://console.aws.amazon.com/amplify/
- **GitHub Repository**: https://github.com/[YOUR-USERNAME]/greencred-esg-platform
- **Live AWS Backend**: https://6xzu4v9rs4.execute-api.us-east-1.amazonaws.com/prod
- **DynamoDB Tables**: AWS Console → DynamoDB → Tables