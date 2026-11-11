import type { Session } from "@supabase/supabase-js";

import { supabase } from "./supabase";

// Hyrja në llogari me Supabase Auth (email + fjalëkalim). Plotësoni TODO 1–4 (karta e studentit, hapi B).
// hyrja-offline.ts ka të njëjtat funksione pa internet; sesioni.tsx zgjedh njërin prej tyre.

export type Perdoruesi = { id: string; email: string };

function ngaSesioni(sesioni: Session | null): Perdoruesi | null {
  return sesioni ? { id: sesioni.user.id, email: sesioni.user.email ?? "" } : null;
}

// TODO 1: supabase.auth.signInWithPassword. Kur kthehet error: throw new Error(error.message).
export async function hyr(email: string, fjalekalimi: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password: fjalekalimi });
  if (error) throw new Error(error.message);
}

// TODO 2: supabase.auth.signUp. Ktheni "hyri" kur data.session ekziston; "konfirmo" kur është null
// (projekti kërkon konfirmimin e email-it).
export async function krijoLlogari(email: string, fjalekalimi: string): Promise<"hyri" | "konfirmo"> {
  const { data, error } = await supabase.auth.signUp({ email, password: fjalekalimi });
  if (error) throw new Error(error.message);
  return data.session ? "hyri" : "konfirmo";
}

// TODO 3: supabase.auth.signOut.
export async function dil(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// TODO 4: supabase.auth.onAuthStateChange. Për çdo ngjarje thirreni ndryshoi(ngaSesioni(sesioni));
// ktheni funksionin që e ndal dëgjimin. Deri atëherë askush s'ka hyrë.
export function degjoSesionin(ndryshoi: (p: Perdoruesi | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_ngjarja, sesioni) => {
    ndryshoi(ngaSesioni(sesioni));
  });
  return () => data.subscription.unsubscribe();
}
