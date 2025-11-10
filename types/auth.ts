// Authentication & User Types

export type UserRole = 'student' | 'organization' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface StudentRegistrationData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  tc_no?: string;
  date_of_birth?: string;
}

export interface OrganizationRegistrationData {
  email: string;
  password: string;
  organization_name: string;
  organization_type: OrganizationType;
  website?: string;
  phone?: string;
}

export type OrganizationType = 
  | 'vakıf'
  | 'kamu'
  | 'belediye'
  | 'üniversite'
  | 'dernek'
  | 'uluslararası'
  | 'özel';

