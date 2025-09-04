#!/bin/bash

# GreenCred Amplify Deployment Script
# This script automates the deployment of GreenCred to AWS Amplify

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO_URL="https://github.com/sherileemeganpillay99-lgtm/greencred-esg-platform"
APP_NAME="greencred-esg-platform"
REGION="us-east-1"

echo -e "${BLUE}🚀 Starting GreenCred Amplify Deployment${NC}"

# Check if jq is installed (for JSON parsing)
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq is not installed. Installing via brew...${NC}"
    brew install jq || echo -e "${RED}❌ Failed to install jq. Please install it manually.${NC}"
fi

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI is configured${NC}"

# Get or prompt for GitHub access token
if [ -z "$GITHUB_ACCESS_TOKEN" ]; then
    echo -e "${YELLOW}🔑 GitHub access token required for Amplify deployment${NC}"
    echo "Please create a personal access token at: https://github.com/settings/tokens"
    echo "Required scopes: repo, admin:repo_hook"
    read -s -p "Enter your GitHub access token: " GITHUB_ACCESS_TOKEN
    echo
fi

# Check if Amplify app already exists
echo -e "${BLUE}🔍 Checking if Amplify app exists${NC}"
APP_ID=$(aws amplify list-apps --region ${REGION} --query "apps[?name=='${APP_NAME}'].appId" --output text 2>/dev/null || echo "")

if [ -z "$APP_ID" ]; then
    echo -e "${BLUE}📱 Creating new Amplify app${NC}"
    
    # Create Amplify app
    CREATE_RESULT=$(aws amplify create-app \
        --name ${APP_NAME} \
        --description "GreenCred ESG-based lending platform with AWS integration" \
        --repository ${GITHUB_REPO_URL} \
        --platform WEB \
        --oauth-token ${GITHUB_ACCESS_TOKEN} \
        --enable-branch-auto-build \
        --region ${REGION} \
        --output json)
    
    APP_ID=$(echo $CREATE_RESULT | jq -r '.app.appId')
    echo -e "${GREEN}✅ Created Amplify app with ID: ${APP_ID}${NC}"
else
    echo -e "${GREEN}✅ Found existing Amplify app with ID: ${APP_ID}${NC}"
fi

# Set environment variables
echo -e "${BLUE}🔧 Setting environment variables${NC}"
aws amplify put-backend-environment \
    --app-id ${APP_ID} \
    --environment-name staging \
    --region ${REGION} || true

# Update app settings
echo -e "${BLUE}⚙️  Updating app settings${NC}"
aws amplify update-app \
    --app-id ${APP_ID} \
    --name ${APP_NAME} \
    --description "GreenCred ESG-based lending platform with AWS integration" \
    --enable-branch-auto-build \
    --enable-branch-auto-deletion \
    --enable-basic-auth false \
    --region ${REGION} \
    --build-spec '{
        "version": 1,
        "frontend": {
            "phases": {
                "preBuild": {
                    "commands": [
                        "echo \"🚀 Starting GreenCred build process\"",
                        "echo \"Node version:\" && node --version",
                        "echo \"Yarn version:\" && yarn --version",
                        "yarn install --frozen-lockfile --production=false",
                        "echo \"✅ Dependencies installed successfully\""
                    ]
                },
                "build": {
                    "commands": [
                        "echo \"🔨 Building GreenCred application\"",
                        "yarn build",
                        "echo \"✅ Build completed successfully\""
                    ]
                }
            },
            "artifacts": {
                "baseDirectory": ".next",
                "files": ["**/*"]
            },
            "cache": {
                "paths": ["node_modules/**/*", ".next/cache/**/*"]
            }
        }
    }' > /dev/null

# Create or update main branch
echo -e "${BLUE}🌿 Setting up main branch${NC}"
BRANCH_EXISTS=$(aws amplify list-branches --app-id ${APP_ID} --region ${REGION} --query "branches[?branchName=='main'].branchName" --output text || echo "")

if [ -z "$BRANCH_EXISTS" ]; then
    aws amplify create-branch \
        --app-id ${APP_ID} \
        --branch-name main \
        --description "Main production branch" \
        --enable-auto-build \
        --region ${REGION} \
        --framework "Next.js - SSR" > /dev/null
    echo -e "${GREEN}✅ Created main branch${NC}"
else
    echo -e "${GREEN}✅ Main branch already exists${NC}"
fi

# Set environment variables for the branch
echo -e "${BLUE}🌍 Setting environment variables${NC}"

# Get S3 bucket name from infrastructure setup or use default
S3_BUCKET_NAME=$(aws s3api list-buckets --query "Buckets[?contains(Name, 'greencred-documents')].Name" --output text | head -n1)
if [ -z "$S3_BUCKET_NAME" ]; then
    S3_BUCKET_NAME="greencred-documents"
    echo -e "${YELLOW}⚠️  No GreenCred S3 bucket found. Using default: ${S3_BUCKET_NAME}${NC}"
fi

# Set environment variables
aws amplify put-backend-environment \
    --app-id ${APP_ID} \
    --environment-name production \
    --region ${REGION} || true

# Update branch environment variables
aws amplify update-branch \
    --app-id ${APP_ID} \
    --branch-name main \
    --description "Main production branch with AWS services" \
    --enable-auto-build \
    --environment-variables '{
        "AWS_REGION": "'${REGION}'",
        "AWS_S3_BUCKET": "'${S3_BUCKET_NAME}'",
        "AWS_BEDROCK_MODEL_ID": "anthropic.claude-3-haiku-20240307-v1:0",
        "NEXT_PUBLIC_APP_NAME": "GreenCred",
        "NEXT_PUBLIC_COMPANY_NAME": "Standard Bank",
        "NODE_ENV": "production"
    }' \
    --region ${REGION} > /dev/null

# Start deployment
echo -e "${BLUE}🚀 Starting deployment${NC}"
JOB_ID=$(aws amplify start-job \
    --app-id ${APP_ID} \
    --branch-name main \
    --job-type RELEASE \
    --region ${REGION} \
    --query 'jobSummary.jobId' \
    --output text)

echo -e "${GREEN}✅ Deployment started with Job ID: ${JOB_ID}${NC}"

# Get app URL
APP_URL="https://main.${APP_ID}.amplifyapp.com"
CONSOLE_URL="https://${REGION}.console.aws.amazon.com/amplify/home?region=${REGION}#/${APP_ID}"

echo -e "${GREEN}🎉 Deployment initiated successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Deployment Information:${NC}"
echo "App ID: ${APP_ID}"
echo "Job ID: ${JOB_ID}"
echo "App URL: ${APP_URL}"
echo "Console URL: ${CONSOLE_URL}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "1. Monitor deployment progress in AWS Amplify Console"
echo "2. Once deployed, test all features:"
echo "   - Document upload and Textract processing"
echo "   - ESG chatbot functionality"
echo "   - Application workflow and status tracking"
echo "3. Set up custom domain if needed"
echo "4. Configure monitoring and alerts"
echo ""
echo -e "${YELLOW}⏳ Deployment typically takes 5-10 minutes...${NC}"
echo -e "${BLUE}Monitor progress at: ${CONSOLE_URL}${NC}"