import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import "expo-sqlite/localStorage/install";

// Programi i besnikërisë: çdo 10 porosi të përfunduara fiton një kupon 10%.
// Të dhënat ruhen lokalisht në telefon (localStorage i expo-sqlite).
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

function lexoNumrin(): number {
  try {
    const vlera = Number(localStorage.getItem(CELESI_POROSI) ?? "0");
    return Number.isFinite(vlera) && vlera > 0 ? Math.floor(vlera) : 0;
  } catch {
    return 0;
  }
}

function lexoKuponat(): Kupon[] {
  try {
    const vlera = JSON.parse(localStorage.getItem(CELESI_KUPONA) ?? "[]");
    return Array.isArray(vlera) ? (vlera as Kupon[]) : [];
  } catch {
    return [];
  }
}

function ruajKuponat(kuponat: Kupon[]) {
  try {
    localStorage.setItem(CELESI_KUPONA, JSON.stringify(kuponat));
  } catch {
    // Ruajtja lokale mund të dështojë në web; app-i vazhdon në kujtesë.
  }
}

export function BesnikeriaProvider({ children }: { children: ReactNode }) {
  const [porosite, setPorosite] = useState(0);
  const [kuponat, setKuponat] = useState<Kupon[]>([]);

  useEffect(() => {
    setPorosite(lexoNumrin());
    setKuponat(lexoKuponat());
  }, []);

  function regjistroPorosi() {
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
      ruajKuponat(lista);
    }

    setPorosite(numriIRi);
    try {
      localStorage.setItem(CELESI_POROSI, String(numriIRi));
    } catch {
      // ignore
    }

    return { fitoiKupon: kuponIRi !== null, kupon: kuponIRi };
  }

  function perdorKupon(id: string) {
    const lista = kuponat.map((k) => (k.id === id ? { ...k, perdorur: true } : k));
    setKuponat(lista);
    ruajKuponat(lista);
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
