# 🚀 AWS Deployment Guide for GreenCred

This guide will walk you through deploying your GreenCred ESG platform to AWS using Amplify with full integration of Textract, S3, and Bedrock services.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- GitHub repository access
- Domain name (optional, but recommended)

## 🏗️ Infrastructure Setup

### 1. IAM Roles and Policies

Create an IAM policy for your Amplify application to access required AWS services:

```json
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
                "arn:aws:s3:::greencred-documents",
                "arn:aws:s3:::greencred-documents/*"
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
```

### 2. S3 Bucket Setup

Create an S3 bucket for document storage:

```bash
# Create S3 bucket (replace with your preferred name and region)
aws s3 mb s3://greencred-documents-prod --region us-east-1

# Set up CORS configuration
aws s3api put-bucket-cors --bucket greencred-documents-prod --cors-configuration '{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
            "AllowedOrigins": ["https://your-domain.amplifyapp.com", "http://localhost:3000"],
            "ExposeHeaders": []
        }
    ]
}'
```

### 3. Bedrock Model Access

Enable Claude model access in your AWS region:

```bash
# Enable Bedrock model access (us-east-1 recommended)
aws bedrock put-model-invocation-logging-configuration \
    --region us-east-1 \
    --logging-config '{
        "cloudWatchConfig": {
            "logGroupName": "/aws/bedrock/greencred"
        }
    }'
```

## 🚀 Amplify Deployment

### Step 1: Connect Repository

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Choose "GitHub" and connect your repository
4. Select the `greencred-esg-platform` repository

### Step 2: Configure Build Settings

The build will automatically detect your `amplify.yml` file. Verify these settings:

- **Framework**: Next.js - SSR
- **Node version**: 18
- **Package manager**: Yarn
- **Build command**: `yarn build`
- **Output directory**: `.next`

### Step 3: Environment Variables

Set these environment variables in Amplify:

| Variable | Value | Description |
|----------|-------|-------------|
| `AWS_REGION` | `us-east-1` | AWS region for services |
| `AWS_S3_BUCKET` | `greencred-documents-prod` | S3 bucket name |
| `AWS_BEDROCK_MODEL_ID` | `anthropic.claude-3-haiku-20240307-v1:0` | Bedrock model ID |
| `NEXT_PUBLIC_APP_NAME` | `GreenCred` | Application name |
| `NEXT_PUBLIC_COMPANY_NAME` | `Standard Bank` | Company branding |

**Note**: AWS credentials are automatically provided by Amplify's IAM role.

### Step 4: Service Role Configuration

1. In Amplify settings, go to "General" → "App settings"
2. Edit "Service role"
3. Create a new role or select existing role with the IAM policy created above

## 🔧 Advanced Configuration

### Custom Domain Setup

1. In Amplify Console, go to "Domain management"
2. Add your custom domain
3. Configure DNS with the provided CNAME records
4. SSL certificate is automatically provisioned

### Performance Optimization

The current `amplify.yml` includes:
- **Caching**: Next.js build cache and node_modules
- **Security Headers**: HSTS, X-Frame-Options, Content-Type protection
- **Frozen Lockfile**: Ensures consistent dependencies

### Monitoring and Logging

Enable CloudWatch logging:

```bash
# Create log group for application logs
aws logs create-log-group --log-group-name /aws/amplify/greencred

# Create log group for Bedrock
aws logs create-log-group --log-group-name /aws/bedrock/greencred
```

## 🔐 Security Considerations

### 1. Environment Variables
- Never commit actual AWS credentials to repository
- Use Amplify's built-in environment variable encryption
- Rotate access keys regularly

### 2. S3 Bucket Security
- Enable versioning for document recovery
- Set up lifecycle policies for cost optimization
- Use bucket policies to restrict access

### 3. API Rate Limiting
- Implement rate limiting for chat API endpoints
- Monitor Textract usage to avoid unexpected costs
- Set up CloudWatch alarms for cost monitoring

## 📊 Post-Deployment Checklist

### ✅ Functionality Tests
- [ ] Document upload and Textract processing works
- [ ] ESG chatbot responds correctly
- [ ] Application workflow functions properly  
- [ ] Status tracking displays correctly
- [ ] All API endpoints return expected responses

### ✅ Performance Tests
- [ ] Page load times under 3 seconds
- [ ] Document processing completes within 10 seconds
- [ ] Chatbot responses under 5 seconds
- [ ] Mobile responsiveness verified

### ✅ Security Tests
- [ ] HTTPS certificate active
- [ ] Security headers present
- [ ] File upload size limits enforced
- [ ] No sensitive data in client-side code

## 🚨 Troubleshooting

### Common Issues

1. **Textract Permission Errors**
   - Verify IAM role has Textract permissions
   - Check AWS service availability in your region

2. **S3 Upload Failures**
   - Confirm CORS configuration
   - Verify bucket name in environment variables

3. **Bedrock Model Access**
   - Ensure model access is enabled in your region
   - Check if you have requested quota increases

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies install correctly
   - Review build logs for specific errors

### Cost Optimization Tips

- **Textract**: Only process documents when necessary
- **Bedrock**: Implement response caching for common queries
- **S3**: Set up lifecycle policies to archive old documents
- **Amplify**: Use appropriate pricing tier based on usage

## 📈 Scaling Considerations

As your platform grows, consider:

1. **CDN**: CloudFront for global distribution
2. **Database**: RDS or DynamoDB for structured data
3. **Caching**: ElastiCache for session management
4. **Load Balancing**: ALB for high availability
5. **Monitoring**: X-Ray for distributed tracing

## 🎯 Next Steps After Deployment

1. Set up monitoring and alerting
2. Configure backup strategies
3. Implement CI/CD pipelines
4. Plan for disaster recovery
5. Set up staging environment

---

**Need Help?** Check the [AWS Amplify Documentation](https://docs.amplify.aws/) or raise an issue in the repository.