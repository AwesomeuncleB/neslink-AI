"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type AppUser = {
  id: string;
  email: string;
  user_metadata?: any;
  created_at?: string;
  [key: string]: any;
};

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          user_metadata: session.user.user_metadata,
          created_at: session.user.created_at,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // 2. Listen for auth changes (sign in, sign out, token refresh, confirmation)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          user_metadata: session.user.user_metadata,
          created_at: session.user.created_at,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signOut };
}
