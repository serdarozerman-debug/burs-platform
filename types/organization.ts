// Organization Types

export type OrganizationType = 
  | 'vakıf'
  | 'kamu'
  | 'belediye'
  | 'üniversite'
  | 'dernek'
  | 'uluslararası'
  | 'özel';

export interface Organization {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  
  // Contact
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  
  // Verification
  is_verified: boolean;
  verified_at: string | null;
  verification_document_url: string | null;
  
  // Stats
  total_scholarships: number;
  total_applications: number;
  
  // Meta
  created_at: string;
  updated_at: string;
}

export interface OrganizationUpdate {
  name?: string;
  description?: string;
  website?: string;
  logo_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
}

