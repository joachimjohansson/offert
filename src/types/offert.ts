export interface LineItem {
  id: string;
  title: string;
  category: 'arbete' | 'material';
  volume: number;
  unit: string;
  unitPrice: number;
  isRotEligible: boolean;
  description?: string;
  specificationDetails?: string;
}

export interface SitePhoto {
  id: string;
  title: string;
  description: string;
  url: string;
  fallbackUrl?: string;
  timestamp: string;
  tag: string;
  icon: string;
  selectedForPdf: boolean;
  annotation?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
}

export interface CheckItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  verifiedBadge: string;
}

export interface VoiceMemo {
  id: string;
  duration: string;
  recordedAt: string;
  transcription: string;
  audioUrl?: string;
}

export interface TradeProject {
  id: string;
  title: string;
  category: string;
  address: string;
  propertyDesignation: string;
  distanceKm: number;
  clientName: string;
  clientSsn: string;
  clientEmail: string;
  clientPhone: string;
  isPropertyOwner: boolean;
  quoteNumber: string;
  quoteDate: string;
  validDays: number;
  status: 'utkast' | 'besök_pågår' | 'kalkyl_klar' | 'skickad' | 'signerad';
  visitSeconds: number;
  isTimerRunning: boolean;
  rotEnabled: boolean;
  rotPercent: number;
  rotDistribution: string; // e.g. "50 / 50"
  momsPercent: number;
  photos: SitePhoto[];
  notes: NoteItem[];
  voiceMemos: VoiceMemo[];
  checkList: CheckItem[];
  lineItems: LineItem[];
  jobCategories: string[];
  signatureData?: {
    method: 'direct_qr' | 'remote_email_sms';
    signedAt?: string;
    signerName?: string;
    signerSsn?: string;
    ipAddress?: string;
    orderReference?: string;
    fortnoxStatus?: 'synkad' | 'väntar';
    vismaStatus?: 'synkad' | 'väntar';
  };
}

export type ViewTab = 'booking' | 'protocol' | 'calculator' | 'review' | 'archive' | 'settings';
export type DeviceMode = 'mobile' | 'tablet' | 'desktop';
