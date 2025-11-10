'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types/auth';
import { signIn, signOut, getCurrentUser, getUserProfile } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount
  useEffect(() => {
    loadUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function loadUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        await loadProfile(currentUser.id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(userId: string) {
    try {
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await signIn({ email, password });
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function hasRole(role: UserRole): boolean {
    return profile?.role === role;
  }

  function isStudent(): boolean {
    return profile?.role === 'student';
  }

  function isOrganization(): boolean {
    return profile?.role === 'organization';
  }

  function isAdmin(): boolean {
    return profile?.role === 'admin';
  }

  return {
    user,
    profile,
    loading,
    error,
    login,
    logout,
    hasRole,
    isStudent,
    isOrganization,
    isAdmin,
    isAuthenticated: !!user,
  };
}

