import { 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  ListObjectsV2Command 
} from '@aws-sdk/client-s3';
import { s3Client, AWS_CONFIG } from '../lib/aws-config.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadDocument = async (file, companyName, documentType = 'esg-document') => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${companyName}/${documentType}-${uuidv4()}.${fileExtension}`;
    
    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: fileName,
      Body: file.buffer || file,
      ContentType: file.mimetype || 'application/octet-stream',
      Metadata: {
        'company-name': companyName,
        'document-type': documentType,
        'upload-timestamp': new Date().toISOString()
      }
    });
    
    await s3Client.send(command);
    
    return {
      fileName,
      s3Key: fileName,
      bucket: AWS_CONFIG.BUCKET_NAME,
      url: `https://${AWS_CONFIG.BUCKET_NAME}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${fileName}`
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload document to S3');
  }
};

export const getDocument = async (s3Key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: s3Key
    });
    
    const response = await s3Client.send(command);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('S3 get error:', error);
    throw new Error('Failed to retrieve document from S3');
  }
};

export const deleteDocument = async (s3Key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: s3Key
    });
    
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete document from S3');
  }
};

export const listCompanyDocuments = async (companyName) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Prefix: `${companyName}/`,
      MaxKeys: 100
    });
    
    const response = await s3Client.send(command);
    
    return (response.Contents || []).map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      url: `https://${AWS_CONFIG.BUCKET_NAME}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${item.Key}`
    }));
  } catch (error) {
    console.error('S3 list error:', error);
    throw new Error('Failed to list company documents');
  }
};

export const storeApplicationData = async (applicationData) => {
  try {
    const applicationId = uuidv4();
    const fileName = `applications/${applicationData.companyName}/application-${applicationId}.json`;
    
    const dataToStore = {
      ...applicationData,
      applicationId,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: fileName,
      Body: JSON.stringify(dataToStore, null, 2),
      ContentType: 'application/json',
      Metadata: {
        'application-id': applicationId,
        'company-name': applicationData.companyName,
        'application-type': 'loan-application',
        'created-at': dataToStore.createdAt
      }
    });
    
    await s3Client.send(command);
    
    return {
      applicationId,
      s3Key: fileName,
      referenceNumber: `GCLOAN-${applicationId.split('-')[0].toUpperCase()}`
    };
  } catch (error) {
    console.error('S3 application storage error:', error);
    throw new Error('Failed to store application data');
  }
};