#!/bin/bash

# GreenCred AWS Infrastructure Setup Script
# This script sets up the required AWS infrastructure for the GreenCred platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="greencred-documents-$(date +%s)"
REGION="us-east-1"
POLICY_NAME="GreenCredAmplifyPolicy"
ROLE_NAME="GreenCredAmplifyRole"

echo -e "${BLUE}🚀 Starting GreenCred AWS Infrastructure Setup${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI is configured${NC}"

# Create S3 Bucket
echo -e "${BLUE}📦 Creating S3 bucket: ${BUCKET_NAME}${NC}"
aws s3 mb s3://${BUCKET_NAME} --region ${REGION}

# Configure CORS for S3 bucket
echo -e "${BLUE}🔧 Configuring CORS for S3 bucket${NC}"
cat > cors-config.json << EOF
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
}
EOF

aws s3api put-bucket-cors --bucket ${BUCKET_NAME} --cors-configuration file://cors-config.json
rm cors-config.json

# Create IAM Policy
echo -e "${BLUE}🔐 Creating IAM policy${NC}"
cat > policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "textract:DetectDocumentText",
                "textract:AnalyzeDocument"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::${BUCKET_NAME}",
                "arn:aws:s3:::${BUCKET_NAME}/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": [
                "arn:aws:bedrock:*:*:model/anthropic.claude-3-haiku-20240307-v1:0"
            ]
        }
    ]
}
EOF

aws iam create-policy --policy-name ${POLICY_NAME} --policy-document file://policy.json --description "Policy for GreenCred Amplify application"
POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='${POLICY_NAME}'].Arn" --output text)
rm policy.json

# Create IAM Role for Amplify
echo -e "${BLUE}👤 Creating IAM role for Amplify${NC}"
cat > trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "amplify.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

aws iam create-role --role-name ${ROLE_NAME} --assume-role-policy-document file://trust-policy.json --description "Role for GreenCred Amplify application"
aws iam attach-role-policy --role-name ${ROLE_NAME} --policy-arn ${POLICY_ARN}
ROLE_ARN=$(aws iam get-role --role-name ${ROLE_NAME} --query 'Role.Arn' --output text)
rm trust-policy.json

# Create CloudWatch Log Groups
echo -e "${BLUE}📊 Creating CloudWatch log groups${NC}"
aws logs create-log-group --log-group-name /aws/amplify/greencred --region ${REGION} || true
aws logs create-log-group --log-group-name /aws/bedrock/greencred --region ${REGION} || true

# Check if Bedrock models are available
echo -e "${BLUE}🤖 Checking Bedrock model availability${NC}"
if aws bedrock list-foundation-models --region ${REGION} --query "modelSummaries[?modelId=='anthropic.claude-3-haiku-20240307-v1:0']" --output text | grep -q "anthropic.claude-3-haiku"; then
    echo -e "${GREEN}✅ Claude 3 Haiku model is available${NC}"
else
    echo -e "${YELLOW}⚠️  Claude 3 Haiku model not found. You may need to request access in the Bedrock console.${NC}"
fi

# Output deployment information
echo -e "${GREEN}🎉 Infrastructure setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Deployment Information:${NC}"
echo "S3 Bucket: ${BUCKET_NAME}"
echo "Region: ${REGION}"
echo "IAM Policy ARN: ${POLICY_ARN}"
echo "IAM Role ARN: ${ROLE_ARN}"
echo ""
echo -e "${BLUE}🔧 Environment Variables for Amplify:${NC}"
echo "AWS_REGION=${REGION}"
echo "AWS_S3_BUCKET=${BUCKET_NAME}"
echo "AWS_BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0"
echo "NEXT_PUBLIC_APP_NAME=GreenCred"
echo "NEXT_PUBLIC_COMPANY_NAME=Standard Bank"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "1. Go to AWS Amplify Console"
echo "2. Create a new app and connect your GitHub repository"
echo "3. Set the IAM service role to: ${ROLE_ARN}"
echo "4. Add the environment variables shown above"
echo "5. Deploy your application!"
echo ""
echo -e "${GREEN}✨ Happy deploying!${NC}"