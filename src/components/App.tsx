import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BrutalistApp } from "./BrutalistApp";
import { BentoApp } from "./bento/BentoApp";
import { useTheme } from "./ThemeProvider";

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { uiStyle } = useTheme();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !session && typeof window !== "undefined") {
      window.location.href = '/login';
    }
  }, [loading, session]);

  if (loading) return null;

  if (uiStyle === 'classic') {
    return <BentoApp session={session} loading={loading} />;
  }

  return <BrutalistApp session={session} loading={loading} />;
}
