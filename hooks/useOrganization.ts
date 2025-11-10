'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Organization, OrganizationUpdate } from '@/types/organization';
import { useAuth } from './useAuth';

export function useOrganization() {
  const { user, profile } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile?.role === 'organization') {
      loadOrganization();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  async function loadOrganization() {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setOrganization(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrganization(updates: OrganizationUpdate) {
    if (!user || !organization) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organization.id)
        .select()
        .single();

      if (error) throw error;
      setOrganization(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function getScholarships() {
    if (!organization) return [];

    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }

  async function getApplications() {
    if (!organization) return [];

    try {
      // Get scholarships first
      const { data: scholarships, error: scholarshipError } = await supabase
        .from('scholarships')
        .select('id')
        .eq('organization_id', organization.id);

      if (scholarshipError) throw scholarshipError;

      const scholarshipIds = scholarships.map(s => s.id);

      // Get applications for these scholarships
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          scholarship:scholarships(*),
          student:students(*)
        `)
        .in('scholarship_id', scholarshipIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }

  return {
    organization,
    loading,
    error,
    updateOrganization,
    getScholarships,
    getApplications,
    refreshOrganization: loadOrganization,
  };
}

