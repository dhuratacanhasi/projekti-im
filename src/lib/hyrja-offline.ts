import type { Perdoruesi } from "./hyrja";

// K3 pa internet: të njëjtat funksione si hyrja.ts (Supabase Auth), por llogaritë jetojnë vetëm në
// kujtesën e aplikacionit dhe humbin kur ai riniset. Ndizet pa ndryshuar kod, me EXPO_PUBLIC_OFFLINE=1.
// Mjafton për ekranin e hyrjes, rojën dhe butonin “Dil”. Ndarjen e të dhënave sipas llogarisë
// e bën vetëm serveri (RLS), prandaj pa internet të gjitha llogaritë shohin të njëjtat të dhëna.

const llogarite = new Map<string, { id: string; fjalekalimi: string }>();
let aktuali: Perdoruesi | null = null;
const degjuesit = new Set<(p: Perdoruesi | null) => void>();

function njofto() {
  degjuesit.forEach((d) => d(aktuali));
}

// Mesazhet janë ato të Supabase Auth, që gabimet në ekran të duken njësoj.
export async function hyr(email: string, fjalekalimi: string): Promise<void> {
  const e = email.trim().toLowerCase();
  const ll = llogarite.get(e);
  if (!ll || ll.fjalekalimi !== fjalekalimi) throw new Error("Invalid login credentials");
  aktuali = { id: ll.id, email: e };
  njofto();
}

export async function krijoLlogari(email: string, fjalekalimi: string): Promise<"hyri" | "konfirmo"> {
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) throw new Error("Unable to validate email address: invalid format");
  if (fjalekalimi.length < 6) throw new Error("Password should be at least 6 characters.");
  if (llogarite.has(e)) throw new Error("User already registered");
  llogarite.set(e, { id: `offline-${llogarite.size + 1}`, fjalekalimi });
  await hyr(e, fjalekalimi);
  return "hyri";
}

export async function dil(): Promise<void> {
  aktuali = null;
  njofto();
}

export function degjoSesionin(ndryshoi: (p: Perdoruesi | null) => void): () => void {
  degjuesit.add(ndryshoi);
  ndryshoi(aktuali);
  return () => {
    degjuesit.delete(ndryshoi);
  };
}
