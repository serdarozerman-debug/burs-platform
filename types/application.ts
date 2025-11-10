// Application Types

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export interface Application {
  id: string;
  student_id: string;
  scholarship_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  reviewer_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string | null;
  decision_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationWithDetails extends Application {
  scholarship: {
    id: string;
    title: string;
    organization: string;
    amount: number;
    deadline: string;
  };
  documents: {
    id: string;
    document_type: string;
    document_name: string;
    file_url: string;
  }[];
}

export interface ApplicationCreate {
  scholarship_id: string;
  cover_letter?: string;
  document_ids: string[];
}

export interface ApplicationReview {
  status: ApplicationStatus;
  reviewer_notes?: string;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Taslak',
  submitted: 'Gönderildi',
  under_review: 'İnceleniyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  withdrawn: 'Geri Çekildi'
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: 'gray',
  submitted: 'blue',
  under_review: 'yellow',
  approved: 'green',
  rejected: 'red',
  withdrawn: 'gray'
};

