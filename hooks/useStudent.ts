'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Student, StudentProfileUpdate } from '@/types/student';
import { useAuth } from './useAuth';

export function useStudent() {
  const { user, profile } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile?.role === 'student') {
      loadStudent();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  async function loadStudent() {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setStudent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStudent(updates: StudentProfileUpdate) {
    if (!user || !student) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', student.id)
        .select()
        .single();

      if (error) throw error;
      setStudent(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function calculateProfileCompletion(): Promise<number> {
    if (!student) return 0;

    const fields = [
      student.first_name,
      student.last_name,
      student.phone,
      student.address,
      student.city,
      student.district,
      student.current_education_level,
      student.university,
      student.department,
      student.year_of_study,
      student.gpa,
      student.monthly_income,
      student.family_monthly_income,
    ];

    const filledFields = fields.filter(f => f !== null && f !== undefined).length;
    return Math.round((filledFields / fields.length) * 100);
  }

  return {
    student,
    loading,
    error,
    updateStudent,
    calculateProfileCompletion,
    refreshStudent: loadStudent,
  };
}

