/**
 * Interview Schema & Type Definitions
 */

export type InterviewType = 'AI' | 'HUMAN';

export type InterviewDomain = 
  | 'DSA'
  | 'Frontend'
  | 'Backend'
  | 'Full Stack'
  | 'AI/ML'
  | 'HR'
  | 'Custom';

export type InterviewStatus = 
  | 'SETUP'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface InterviewRole {
  role: string;
  company?: string;
  requireSkills?: string[];
}

export interface InterviewFeedback {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  topicsToRevise: string[];
  detailedFeedback?: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: InterviewType;
  domain: InterviewDomain;
  duration: number;
  status: InterviewStatus;
  
  // Session data
  streamRoomId?: string;
  streamCallId?: string;
  vapiCallId?: string;
  
  // Resume & JD
  resumeData?: Record<string, unknown>;
  jobDescription?: string;
  
  // Recording & Transcript
  transcript?: Record<string, unknown>;
  recordingUrl?: string;
  
  // Scores & Feedback
  overallScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  confidenceScore?: number;
  
  strengths?: string[];
  weaknesses?: string[];
  improvements?: string[];
  topicsToRevise?: string[];
  detailedFeedback?: string;
  
  // Timestamps
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInterviewRequest {
  type: InterviewType;
  domain: InterviewDomain;
  duration: number;
  resumeData?: Record<string, unknown>;
  jobDescription?: string;
}

export interface UpdateInterviewRequest {
  status?: InterviewStatus;
  streamRoomId?: string;
  streamCallId?: string;
  vapiCallId?: string;
  transcript?: Record<string, unknown>;
  recordingUrl?: string;
  feedback?: Partial<InterviewFeedback>;
}
