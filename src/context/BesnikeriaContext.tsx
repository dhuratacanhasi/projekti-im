import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import "expo-sqlite/localStorage/install";

import { useSesioni } from "@/lib/sesioni";

// Programi i besnikërisë: çdo 10 porosi të përfunduara fiton një kupon 10%.
// Të dhënat ruhen lokalisht në telefon, të ndara për çdo llogari.
export type Kupon = {
  id: string;
  kodi: string;
  /** përqindja e zbritjes, p.sh. 10 */
  zbritje: number;
  krijuar: string;
  perdorur: boolean;
};

const CELESI_POROSI = "unibite_porosite";
const CELESI_KUPONA = "unibite_kuponat";
export const PRAGU_KUPONIT = 10;

type BesnikeriaContextType = {
  porosite: number;
  kuponat: Kupon[];
  progresi: number;
  kuponAktiv: Kupon | null;
  regjistroPorosi: () => { fitoiKupon: boolean; kupon: Kupon | null };
  perdorKupon: (id: string) => void;
};

const BesnikeriaContext = createContext<BesnikeriaContextType | undefined>(undefined);

function celesi(baza: string, perdoruesId: string): string {
  return `${baza}:${perdoruesId}`;
}

// Të dhënat e vjetra ishin të përbashkëta për gjithë telefonin. Herën e parë
// që hyn një llogari, ato kalojnë te ajo llogari dhe çelësi i vjetër fshihet.
function migroTeLlogaria(baza: string, perdoruesId: string) {
  try {
    const iRi = celesi(baza, perdoruesId);
    if (localStorage.getItem(iRi) !== null) return;
    const iVjeter = localStorage.getItem(baza);
    if (iVjeter !== null) {
      localStorage.setItem(iRi, iVjeter);
      localStorage.removeItem(baza);
    }
  } catch {
    // Ruajtja lokale mund të dështojë në web.
  }
}

function lexoNumrin(perdoruesId: string): number {
  try {
    const vlera = Number(localStorage.getItem(celesi(CELESI_POROSI, perdoruesId)) ?? "0");
    return Number.isFinite(vlera) && vlera > 0 ? Math.floor(vlera) : 0;
  } catch {
    return 0;
  }
}

function lexoKuponat(perdoruesId: string): Kupon[] {
  try {
    const vlera = JSON.parse(localStorage.getItem(celesi(CELESI_KUPONA, perdoruesId)) ?? "[]");
    return Array.isArray(vlera) ? (vlera as Kupon[]) : [];
  } catch {
    return [];
  }
}

function ruajNumrin(perdoruesId: string, numri: number) {
  try {
    localStorage.setItem(celesi(CELESI_POROSI, perdoruesId), String(numri));
  } catch {
    // ignore
  }
}

function ruajKuponat(perdoruesId: string, kuponat: Kupon[]) {
  try {
    localStorage.setItem(celesi(CELESI_KUPONA, perdoruesId), JSON.stringify(kuponat));
  } catch {
    // ignore
  }
}

export function BesnikeriaProvider({ children }: { children: ReactNode }) {
  const { perdoruesi } = useSesioni();
  const perdoruesId = perdoruesi?.id ?? null;
  const [porosite, setPorosite] = useState(0);
  const [kuponat, setKuponat] = useState<Kupon[]>([]);

  useEffect(() => {
    // Vizitori nuk ka porosi as kuponë; vetëm llogaria i sheh të vetat.
    if (!perdoruesId) {
      setPorosite(0);
      setKuponat([]);
      return;
    }
    migroTeLlogaria(CELESI_POROSI, perdoruesId);
    migroTeLlogaria(CELESI_KUPONA, perdoruesId);
    setPorosite(lexoNumrin(perdoruesId));
    setKuponat(lexoKuponat(perdoruesId));
  }, [perdoruesId]);

  function regjistroPorosi() {
    if (!perdoruesId) return { fitoiKupon: false, kupon: null };

    const numriIRi = porosite + 1;
    let kuponIRi: Kupon | null = null;

    if (numriIRi % PRAGU_KUPONIT === 0) {
      kuponIRi = {
        id: `kupon-${Date.now()}`,
        kodi: `UNIBITE${Math.floor(1000 + Math.random() * 9000)}`,
        zbritje: 10,
        krijuar: new Date().toISOString(),
        perdorur: false,
      };
      const lista = [...kuponat, kuponIRi];
      setKuponat(lista);
      ruajKuponat(perdoruesId, lista);
    }

    setPorosite(numriIRi);
    ruajNumrin(perdoruesId, numriIRi);

    return { fitoiKupon: kuponIRi !== null, kupon: kuponIRi };
  }

  function perdorKupon(id: string) {
    if (!perdoruesId) return;
    const lista = kuponat.map((k) => (k.id === id ? { ...k, perdorur: true } : k));
    setKuponat(lista);
    ruajKuponat(perdoruesId, lista);
  }

  const kuponAktiv = kuponat.find((k) => !k.perdorur) ?? null;

  return (
    <BesnikeriaContext.Provider
      value={{
        porosite,
        kuponat,
        progresi: porosite % PRAGU_KUPONIT,
        kuponAktiv,
        regjistroPorosi,
        perdorKupon,
      }}
    >
      {children}
    </BesnikeriaContext.Provider>
  );
}

export function useBesnikeria() {
  const context = useContext(BesnikeriaContext);
  if (!context) {
    throw new Error("useBesnikeria must be used within BesnikeriaProvider");
  }
  return context;
}
