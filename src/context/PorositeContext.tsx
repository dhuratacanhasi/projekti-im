import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import "expo-sqlite/localStorage/install";

// Historiku i porosive dhe ndjekja e statusit. Ruhet lokalisht në telefon,
// sepse app-i nuk ka tabelë porosish në Supabase.
export type StatusiPorosise = "konfirmuar" | "pergatitje" | "rruges" | "derguar";

export type ArtikullPorosie = {
  emri: string;
  sasia: number;
  cmimi: number;
};

export type Porosi = {
  id: string;
  kodi: string;
  restorantId: string;
  restoranti: string;
  artikuj: ArtikullPorosie[];
  totali: number;
  zbritja: number;
  totaliFundit: number;
  qyteti: string;
  adresa: string;
  telefoni: string;
  pagesa: string;
  shenime: string;
  krijuar: string;
};

export const HAPAT: {
  id: StatusiPorosise;
  etiketa: string;
  ikona: string;
  minuta: number;
}[] = [
  { id: "konfirmuar", etiketa: "Konfirmuar", ikona: "✅", minuta: 0 },
  { id: "pergatitje", etiketa: "Në përgatitje", ikona: "👨‍🍳", minuta: 1 },
  { id: "rruges", etiketa: "Në rrugë", ikona: "🛵", minuta: 3 },
  { id: "derguar", etiketa: "Dorëzuar", ikona: "📦", minuta: 6 },
];

const CELESI = "unibite_porosite_histori";

export function statusiPorosise(porosi: Porosi, tani = Date.now()): StatusiPorosise {
  const minuta = (tani - new Date(porosi.krijuar).getTime()) / 60000;
  let statusi: StatusiPorosise = "konfirmuar";
  for (const hap of HAPAT) {
    if (minuta >= hap.minuta) statusi = hap.id;
  }
  return statusi;
}

export function indeksiStatusit(statusi: StatusiPorosise): number {
  const indeksi = HAPAT.findIndex((h) => h.id === statusi);
  return indeksi < 0 ? 0 : indeksi;
}

function lexoPorosite(): Porosi[] {
  try {
    const vlera = JSON.parse(localStorage.getItem(CELESI) ?? "[]");
    return Array.isArray(vlera) ? (vlera as Porosi[]) : [];
  } catch {
    return [];
  }
}

function ruajPorosite(porosite: Porosi[]) {
  try {
    localStorage.setItem(CELESI, JSON.stringify(porosite));
  } catch {
    // Ruajtja lokale mund të dështojë në web; app-i vazhdon në kujtesë.
  }
}

type PorositeContextType = {
  porosite: Porosi[];
  porosiaAktive: Porosi | null;
  shtoPorosi: (porosi: Omit<Porosi, "id" | "kodi" | "krijuar">) => Porosi;
  pastroHistorikun: () => void;
};

const PorositeContext = createContext<PorositeContextType | undefined>(undefined);

export function PorositeProvider({ children }: { children: ReactNode }) {
  const [porosite, setPorosite] = useState<Porosi[]>([]);

  useEffect(() => {
    setPorosite(lexoPorosite());
  }, []);

  function shtoPorosi(porosi: Omit<Porosi, "id" | "kodi" | "krijuar">) {
    const eRe: Porosi = {
      ...porosi,
      id: `porosi-${Date.now()}`,
      kodi: `UB-${Math.floor(1000 + Math.random() * 9000)}`,
      krijuar: new Date().toISOString(),
    };
    const lista = [eRe, ...porosite];
    setPorosite(lista);
    ruajPorosite(lista);
    return eRe;
  }

  function pastroHistorikun() {
    setPorosite([]);
    ruajPorosite([]);
  }

  const porosiaAktive =
    porosite.find((p) => statusiPorosise(p) !== "derguar") ?? null;

  return (
    <PorositeContext.Provider
      value={{ porosite, porosiaAktive, shtoPorosi, pastroHistorikun }}
    >
      {children}
    </PorositeContext.Provider>
  );
}

export function usePorosite() {
  const context = useContext(PorositeContext);
  if (!context) {
    throw new Error("usePorosite must be used within PorositeProvider");
  }
  return context;
}
