import Bull from 'bull';

export interface PdfJobData {
  reportData: {
    companyInfo: {
      name: string;
      phone: string;
      email: string;
    };
    reportInfo: {
      date: string;
      projectId?: string;
      clientName?: string;
      propertyAddress?: string;
    };
    options: Array<{
      question: string;
      answer: string;
    }>;
    totalPrice: string;
    currency: string;
  };
  userId: string;
  calculatorId: string;
  telegramUserId: string;
  options?: PdfOptions;
}

export interface PdfOptions {
  format?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

export interface PdfJobResult {
  success: boolean;
  sent?: boolean;
  pdfBuffer?: Buffer;
  error?: string;
}

export type PdfJob = Bull.Job<PdfJobData>;

export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'stuck' | 'paused';

export interface JobStatusResponse {
  status: JobStatus;
  progress?: number;
  result?: PdfJobResult;
  error?: string;
}

export interface TelegramPdfOptions {
  filename: string;
  caption?: string;
}