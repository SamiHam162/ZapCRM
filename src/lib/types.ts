export type ClientStatus = 'ממתין' | 'סורק' | 'מוכן' | 'נשלח';

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export interface DigitalAsset {
  type: 'website' | 'dapei-zahav' | 'social';
  url: string;
  label: string;
  scanStatus: 'pending' | 'success' | 'failed' | 'demo';
}

export interface ClientCard {
  businessName: string;
  ownerName?: string;
  businessType: string;
  area: string;
  description?: string;
  contactInfo: ContactInfo;
  services: string[];
  digitalAssets: DigitalAsset[];
  usedDemoData: boolean;
  scannedAt: string;
}

export type ScanStepStatus = 'pending' | 'active' | 'done' | 'failed';

export interface ScanStepState {
  id: number;
  icon: string;
  label: string;
  status: ScanStepStatus;
}

export interface CallScriptSection {
  title: string;
  content: string;
}

export interface Client {
  id: string;
  businessName: string;
  websiteUrl?: string;
  dapeiZahavUrl?: string;
  status: ClientStatus;
  createdAt: string;
  sentAt?: string;
  notes?: string;
  area?: string;
  businessType?: string;
  clientCard?: ClientCard;
  callScript?: CallScriptSection[];
}
