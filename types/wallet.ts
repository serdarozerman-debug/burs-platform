// Wallet & Document Types

export type DocumentType =
  | 'kimlik'
  | 'nufus_cuzdani'
  | 'ogrenci_belgesi'
  | 'transkript'
  | 'diploma'
  | 'gelir_belgesi'
  | 'ikamet_belgesi'
  | 'saglik_raporu'
  | 'engelli_raporu'
  | 'foto'
  | 'cv'
  | 'referans_mektubu'
  | 'motivasyon_mektubu'
  | 'banka_hesap_bilgileri'
  | 'veli_onay_formu'
  | 'diger';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface WalletDocument {
  id: string;
  student_id: string;
  document_type: DocumentType;
  document_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  verification_status: VerificationStatus;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentUpload {
  document_type: DocumentType;
  file: File;
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  kimlik: 'Kimlik Belgesi',
  nufus_cuzdani: 'Nüfus Cüzdanı',
  ogrenci_belgesi: 'Öğrenci Belgesi',
  transkript: 'Transkript',
  diploma: 'Diploma',
  gelir_belgesi: 'Gelir Belgesi',
  ikamet_belgesi: 'İkametgah Belgesi',
  saglik_raporu: 'Sağlık Raporu',
  engelli_raporu: 'Engelli Raporu',
  foto: 'Fotoğraf',
  cv: 'Özgeçmiş',
  referans_mektubu: 'Referans Mektubu',
  motivasyon_mektubu: 'Motivasyon Mektubu',
  banka_hesap_bilgileri: 'Banka Hesap Bilgileri',
  veli_onay_formu: 'Veli Onay Formu',
  diger: 'Diğer'
};

