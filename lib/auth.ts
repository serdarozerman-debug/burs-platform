// Authentication utilities

import { supabase } from './supabase';
import { UserRole, LoginCredentials, StudentRegistrationData, OrganizationRegistrationData } from '@/types/auth';

// Sign in user
export async function signIn(credentials: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Register student
export async function registerStudent(data: StudentRegistrationData) {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('User creation failed');

  // 2. Create user profile
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: authData.user.id,
      role: 'student' as UserRole,
      email: data.email,
      full_name: `${data.first_name} ${data.last_name}`,
    });

  if (profileError) throw profileError;

  // 3. Create student record
  const { error: studentError } = await supabase
    .from('students')
    .insert({
      user_id: authData.user.id,
      first_name: data.first_name,
      last_name: data.last_name,
      tc_no: data.tc_no,
      date_of_birth: data.date_of_birth,
    });

  if (studentError) throw studentError;

  return authData;
}

// Register organization
export async function registerOrganization(data: OrganizationRegistrationData) {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('User creation failed');

  // 2. Create user profile
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: authData.user.id,
      role: 'organization' as UserRole,
      email: data.email,
      full_name: data.organization_name,
      phone: data.phone,
    });

  if (profileError) throw profileError;

  // 3. Create organization record
  const slug = data.organization_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const { error: orgError } = await supabase
    .from('organizations')
    .insert({
      user_id: authData.user.id,
      name: data.organization_name,
      slug: slug,
      type: data.organization_type,
      website: data.website,
      phone: data.phone,
      is_verified: false,
    });

  if (orgError) throw orgError;

  return authData;
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Get user profile with role
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Check if user has role
export async function hasRole(userId: string, role: UserRole): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile.role === role;
}

