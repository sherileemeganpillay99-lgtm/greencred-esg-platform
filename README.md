# GreenCred - ESG-Based Credit Scoring System

## 🏆 Hackathon Project for Standard Bank

**GreenCred** is an innovative ESG-based credit scoring platform that evaluates Small and Medium Enterprises (SMEs) based on their Environmental, Social, and Governance performance, providing sustainable financing with interest rate discounts.

## 🌟 Key Features

### 🤖 AI-Powered ESG Analysis
- **Web Scraping**: Automatically fetches ESG data from public sources
- **AI Insights**: Advanced machine learning algorithms provide actionable recommendations
- **Real-time Monitoring**: Live ESG metric tracking and alerts
- **Document Processing**: AWS Textract integration for intelligent ESG data extraction

### 📊 Comprehensive Scoring System
- **Equal Weighting**: Environmental (25%), Social (25%), Governance (25%), Risk Management (25%)
- **Dynamic Ratings**: A+ to D grading system with corresponding interest rate discounts
- **Transparent Calculations**: Clear breakdown of all scoring components

### 💰 Financial Benefits
- **Interest Rate Discounts**: Up to 3% discount based on ESG performance
- **Savings Calculator**: Real-time calculation of monthly and total savings
- **Loan Optimization**: 5-year term analysis with payment projections

### 📱 Advanced Analytics Dashboard
- **Interactive Charts**: Powered by Recharts with multiple visualization types
- **Performance Tracking**: Historical trends and improvement recommendations
- **Benchmark Comparisons**: Industry-standard ESG rating distributions

### 🔄 Workflow Management
- **Application Processing**: Automated loan application workflow
- **Agent Review System**: Human review integration for compliance
- **Status Tracking**: Real-time application status updates
- **Reference Number System**: Easy application tracking

### 💬 AI Assistant & Support
- **ESG Chatbot**: AWS Bedrock-powered Q&A for sustainability questions
- **Personalized Advice**: Tailored recommendations based on ESG scores
- **24/7 Support**: Always-available assistance for ESG and finance queries

### ☁️ AWS Cloud Integration
- **S3 Storage**: Secure document storage and management
- **Textract Processing**: Intelligent document analysis and data extraction
- **Bedrock AI**: Advanced natural language processing for chatbot
- **Scalable Architecture**: Enterprise-ready cloud infrastructure

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14, React 18
- **Styling**: Tailwind CSS with Standard Bank branding
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Package Manager**: Yarn

### Backend & APIs
- **Web Scraping**: JSDOM, Axios
- **File Processing**: Multer for file uploads
- **Unique IDs**: UUID for reference numbers

### AWS Services
- **AWS SDK**: @aws-sdk/client-textract, @aws-sdk/client-s3, @aws-sdk/client-bedrock-runtime
- **Textract**: Document text and data extraction
- **S3**: Secure file storage and document management
- **Bedrock**: AI-powered chatbot and natural language processing

## 🏢 Standard Bank Integration

### Brand Colors
- **Primary Blue**: #003A70
- **Light Blue**: #0066CC
- **Green**: #00A651
- **Yellow**: #FFB81C
- **Red**: #E31837

### Design Philosophy
- Professional banking interface
- Mobile-first responsive design
- Accessibility compliant
- Intuitive user experience

## 🚀 Getting Started

### Prerequisites
- Node.js 20.16.0+
- Yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd GreenCred
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure AWS services**
```bash
# Copy the environment template
cp .env.local.example .env.local

# Edit .env.local with your AWS credentials:
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key  
# AWS_S3_BUCKET=your-s3-bucket-name
```

4. **Run development server**
```bash
yarn dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

### AWS Services Setup

To fully utilize all features, configure these AWS services:

1. **Amazon S3**: Create a bucket for document storage
2. **Amazon Textract**: Enable document processing (no setup required, pay-per-use)
3. **Amazon Bedrock**: Enable Claude models in your AWS region

### Build for Production
```bash
yarn build
yarn start
```

## 📱 Application Structure

### Pages
- **Homepage**: Main application with tabbed interface
- **Analytics Dashboard**: Advanced data visualization
- **API Endpoints**: RESTful services for ESG data processing

### Components
- **AIInsights**: Machine learning-powered recommendations
- **RealTimeESG**: Live monitoring dashboard
- **Dashboard Charts**: Comprehensive visualization components

### Utilities
- **ESG Calculator**: Core scoring algorithms
- **ESG Scraper**: Web scraping and data extraction
- **Data Validation**: Input sanitization and verification

## 🎯 Key Differentiators for Hackathon

### 1. **Innovation**
- AI-powered ESG data extraction
- Real-time monitoring capabilities
- Predictive score improvement analytics

### 2. **Business Impact**
- Direct ROI through interest rate savings
- Encourages sustainable business practices
- Aligns with Standard Bank's ESG commitments

### 3. **Technical Excellence**
- Modern Next.js architecture
- Responsive design for all devices
- Professional Standard Bank branding
- Comprehensive error handling

### 4. **User Experience**
- Intuitive tabbed interface
- Progressive disclosure of information
- Mobile-optimized interactions
- Clear financial benefit visualization

### 5. **Scalability**
- Modular component architecture
- API-driven data processing
- Extensible scoring algorithms
- Multi-tenant ready

## 🌱 ESG Scoring Methodology

### Environmental (25%)
- Carbon footprint and emissions
- Renewable energy usage
- Waste management practices
- Resource efficiency

### Social (25%)
- Employee welfare and diversity
- Community engagement
- Supply chain ethics
- Customer satisfaction

### Governance (25%)
- Board structure and independence
- Transparency and reporting
- Anti-corruption measures
- Shareholder rights

### Risk Management (25%)
- Cybersecurity measures
- Supply chain resilience
- Regulatory compliance
- Business continuity planning

## 📊 Rating System

| Grade | Score Range | Interest Discount | Description |
|-------|------------|------------------|-------------|
| A+    | 90-100     | 3.0%            | Exceptional ESG leadership |
| A     | 80-89      | 2.5%            | Strong ESG performance |
| B+    | 70-79      | 2.0%            | Good ESG practices |
| B     | 60-69      | 1.5%            | Adequate ESG standards |
| C     | 50-59      | 1.0%            | Basic ESG compliance |
| D     | 40-49      | 0.5%            | Limited ESG practices |

## 🔮 Future Enhancements

### Phase 2 Features
- **Blockchain Integration**: Immutable ESG data storage
- **Open Banking APIs**: Direct financial data integration
- **Machine Learning Models**: Advanced predictive analytics
- **Mobile App**: Native iOS and Android applications

### Enterprise Features
- **Multi-tenant Architecture**: Support multiple banks
- **Advanced Reporting**: Regulatory compliance reports
- **Third-party Integrations**: ESG data providers
- **White-label Solution**: Customizable branding

## 🏆 Hackathon Winning Strategy

### 1. **Problem-Solution Fit**
Addresses Standard Bank's need for sustainable finance innovation while providing tangible business value to SMEs.

### 2. **Technical Innovation**
Combines AI, real-time monitoring, and financial modeling in a cohesive, production-ready application.

### 3. **Business Viability**
Clear revenue model through loan origination and ESG advisory services.

### 4. **Market Opportunity**
Taps into the growing $30+ trillion sustainable finance market.

### 5. **Demo Ready**
Fully functional prototype with realistic data and compelling user stories.

## 📞 Contact

**Team GreenCred**
- Project Lead: [Your Name]
- Email: [Your Email]
- GitHub: [Repository URL]

---

*Built with ❤️ for Standard Bank Hackathon 2025*

**"Financing the Future, Sustainably"**

# Start yarn dev 
# End ctrl c 
# Put in business benefits in preso
# Say we're going to link to api to pull data