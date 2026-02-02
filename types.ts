
export interface DetectionResult {
  label: 'AI' | 'Human' | 'Uncertain';
  confidence: number;
  explanation: string;
  reasoningPoints: string[];
  detectedLanguage?: string;
}

export interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: number;
  result: DetectionResult;
}