import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  };

  const signIn = async (loginField: string, password: string) => {
    // Check if loginField is email, custom_user_id, or NIK
    const isEmail = loginField.includes("@");
    const isNIK = /^\d{16}$/.test(loginField);

    if (isEmail) {
      // Direct email login
      const { error } = await supabase.auth.signInWithPassword({
        email: loginField,
        password,
      });
      if (error) throw error;
    } else {
      // Login with custom_user_id or NIK - need to find email first
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .or(`custom_user_id.eq.${loginField},nik.eq.${loginField}`)
        .single();

      if (userError || !userData) {
        throw new Error("User not found with provided credentials");
      }

      // Now login with the found email
      const { error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });
      if (error) throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
