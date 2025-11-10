// Permission & authorization utilities

import { UserRole } from '@/types/auth';

export const permissions = {
  // Student permissions
  student: {
    canApplyToScholarship: true,
    canViewApplications: true,
    canManageWallet: true,
    canUseChatbot: true,
    canFavoriteScholarships: true,
  },

  // Organization permissions
  organization: {
    canCreateScholarship: true,
    canEditScholarship: true,
    canDeleteScholarship: true,
    canViewApplications: true,
    canReviewApplications: true,
    canViewAnalytics: true,
  },

  // Admin permissions
  admin: {
    canVerifyOrganizations: true,
    canVerifyDocuments: true,
    canManageUsers: true,
    canViewAllData: true,
    canDeleteAnything: true,
  },

  // Check if user has permission
  can: (role: UserRole, permission: string): boolean => {
    const rolePermissions = permissions[role];
    if (!rolePermissions) return false;
    return (rolePermissions as any)[permission] === true;
  },

  // Check if user is organization owner
  isOrganizationOwner: (userId: string, organizationUserId: string): boolean => {
    return userId === organizationUserId;
  },

  // Check if user is student owner
  isStudentOwner: (userId: string, studentUserId: string): boolean => {
    return userId === studentUserId;
  },

  // Check if scholarship belongs to organization
  canManageScholarship: (userId: string, scholarshipOrganizationUserId: string): boolean => {
    return userId === scholarshipOrganizationUserId;
  },

  // Check if application belongs to student
  canViewApplication: (userId: string, applicationStudentUserId: string, role: UserRole): boolean => {
    if (role === 'admin') return true;
    return userId === applicationStudentUserId;
  }
};

