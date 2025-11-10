// Student Types

export type EducationLevel = 
  | 'lise'
  | 'önlisans'
  | 'lisans'
  | 'yükseklisans'
  | 'doktora';

export interface Student {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  tc_no: string | null;
  date_of_birth: string | null;
  gender: string | null;
  
  // Contact
  phone: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  
  // Education
  current_education_level: EducationLevel | null;
  university: string | null;
  department: string | null;
  year_of_study: number | null;
  gpa: number | null;
  
  // Financial
  monthly_income: number | null;
  family_monthly_income: number | null;
  
  // Special status
  has_disability: boolean;
  disability_type: string | null;
  disability_percentage: number | null;
  
  // Meta
  profile_completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface StudentProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  current_education_level?: EducationLevel;
  university?: string;
  department?: string;
  year_of_study?: number;
  gpa?: number;
  monthly_income?: number;
  family_monthly_income?: number;
  has_disability?: boolean;
  disability_type?: string;
  disability_percentage?: number;
}

