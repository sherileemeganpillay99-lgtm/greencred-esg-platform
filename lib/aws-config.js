import { TextractClient } from '@aws-sdk/client-textract';
import { S3Client } from '@aws-sdk/client-s3';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
};

export const textractClient = new TextractClient(awsConfig);
export const s3Client = new S3Client(awsConfig);
export const bedrockClient = new BedrockRuntimeClient(awsConfig);

export const AWS_CONFIG = {
  BUCKET_NAME: process.env.AWS_S3_BUCKET || 'greencred-documents',
  BEDROCK_MODEL_ID: process.env.AWS_BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
  REGION: awsConfig.region
};