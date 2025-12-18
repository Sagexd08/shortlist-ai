# AI Resume Screener & Skill Gap Analyzer 🚀

A production-ready, serverless ATS intelligence platform built with Next.js, Vercel, and AWS (Free Tier).
Designed for recruiters and hiring managers to instantly analyze skill gaps and shortlist probabilities.

![Dashboard Preview](/dashboard-preview.png)

## 🏗 Architecture

The system is built on a **Serverless Event-Driven Architecture** designed for high availability and low latency.

### High-Level Data Flow

1.  **Ingestion Layer**:
    *   The user uploads a resume (PDF/DOCX) via the frontend.
    *   This triggers a request to `/api/upload` which securely stores the raw file in **Amazon S3**.
    *   Simultaneously, the file is processed by the **Parser Engine** (using `mammoth` and `pdf2json`) to extract raw text.

2.  **Analysis Layer**:
    *   The extracted text and the provided Job Description are sent to the `/api/analyze` endpoint.
    *   **Skill Intelligence Engine**: This core logic calculates the match score using:
        *   **TF-IDF & Cosine Similarity**: For semantic relevance.
        *   **Regex Taxonomy Matching**: To identify specific hard skills.
        *   **Heuristic Scoring**: To determine a final "match percentage".

3.  **Persistence Layer**:
    *   The structured analysis results (scores, matched skills, missing skills) are saved to **Amazon DynamoDB** for fast retrieval.
    *   Recruiters can query these results instantly via the `/history` view.

```ascii
[ User Client ] <---> [ Vercel Edge Network ]
       |
       v
[ Next.js App Router ]
       |
       +--- /api/upload (POST)
       |       |
       |       +---> [ Amazon S3 ] (Resume Storage)
       |       |
       |       v
       |    [ Parser: PDF/DOCX -> Text ]
       |
       +--- /api/analyze (POST)
               |
               v
            [ Skill Intelligence Engine ]
               |  - TF-IDF / Cosine Similarity
               |  - Regex Taxonomy Matching
               |  - Scorer (Heuristic Model)
               |
               +---> [ Amazon DynamoDB ] (Persist Results)
```

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), Vanilla CSS (Custom Design System), Lucide Icons
- **Backend**: Next.js Serverless API Routes (Node.js runtime)
- **Infrastructure**: Vercel (Compute), AWS S3 (Storage), AWS DynamoDB (Database)
- **ML/NLP**: `natural` (Tokenization), `compute-cosine-similarity`, Regex-based Entity Extraction

## ✨ Features

- **Resume Parsing**: Robust extraction from PDF & DOCX.
- **Skill Gap Analysis**: Identifies missing, present, and extra skills based on JD.
- **Match Scoring**: Multi-factor scoring algorithm (Semantic + Keyword + Skill Match).
- **Recruiter Probability**: "Probability of Shortlisting" score modeled on heuristic hiring patterns.
- **Serverless & Fast**: No cold-start heavy ML models; extremely fast, deterministic execution.

## 🚀 Deployment Guide

### Prerequisites
1. **AWS Account** (Free Tier is sufficient).
2. **Vercel Account**.

### 1. AWS Setup
- **S3 Bucket**: Create a bucket (e.g., `my-resume-bucket`). Uncheck "Block all public access" if you want public URLs (optional, we use backend signing usually, but project uses server-side storage). *Actually keep it private, use IAM.*
- **DynamoDB**: Create table `ResumeAnalysisResults` with Partition Key `id` (String).
- **IAM User**: Create a user with `AmazonS3FullAccess` and `AmazonDynamoDBFullAccess` (or scoped policy). Get Access Key & Secret.

### 2. Environment Variables
Create a `.env.local` file in the root:
```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
DYNAMODB_TABLE_NAME=ResumeAnalysisResults
```

### 3. Run Locally
```bash
npm install
npm run dev
```

### 4. Deploy to Vercel
```bash
npx vercel deploy
```
*Ensure you add the Environment Variables in Vercel Project Settings.*

## 🔮 Future Improvements
- **LLM Integration**: Use Gemini/OpenAI for deeper qualitative analysis (summary generation).
- **Authentication**: Add Clerk/NextAuth for recruiter login.
- **Batch Processing**: SQS queue for analyzing bulk uploads.

---
*Built as a Flagship Portfolio Project.*
