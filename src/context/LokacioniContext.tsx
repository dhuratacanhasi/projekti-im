import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import "expo-sqlite/localStorage/install";

import { useSesioni } from "@/lib/sesioni";

// Dy lokacione të ndryshme:
//  - qyteti: zgjidhet në krye të app-it / në checkout dhe filtron restorantet
//    (qyteti ku dëshiron të porosisësh tani).
//  - qytetiLlogarise: ruhet me llogarinë dhe nuk ndryshon kur porosit në një
//    qytet tjetër. Shfaqet në profil.
export const QYTETET = ["Mitrovicë", "Prishtinë", "Pejë", "Prizren", "Gjakovë", "Ferizaj", "Gjilan"] as const;

export type Qyteti = (typeof QYTETET)[number];

const CELESI_LLOGARISE = "unibite_qyteti_llogarise";

function celesi(perdoruesId: string): string {
  return `${CELESI_LLOGARISE}:${perdoruesId}`;
}

function eshteQytet(vlera: string | null): vlera is Qyteti {
  return vlera !== null && (QYTETET as readonly string[]).includes(vlera);
}

function lexoQytetinELlogarise(perdoruesId: string | null): Qyteti | null {
  if (!perdoruesId) return null;
  try {
    const vlera = localStorage.getItem(celesi(perdoruesId));
    return eshteQytet(vlera) ? vlera : null;
  } catch {
    return null;
  }
}

function ruajQytetinELlogarise(perdoruesId: string, qyteti: Qyteti) {
  try {
    localStorage.setItem(celesi(perdoruesId), qyteti);
  } catch {
    // Ruajtja lokale mund të dështojë në web.
  }
}

type LokacioniContextType = {
  qyteti: Qyteti;
  ndryshoQytetin: (q: Qyteti) => void;
  qytetiLlogarise: Qyteti;
  ndryshoQytetinLlogarise: (q: Qyteti) => void;
};

const LokacioniContext = createContext<LokacioniContextType | undefined>(undefined);

export function LokacioniProvider({ children }: { children: ReactNode }) {
  const { perdoruesi } = useSesioni();
  const [qyteti, setQyteti] = useState<Qyteti>("Mitrovicë");
  const [qytetiLlogarise, setQytetiLlogarise] = useState<Qyteti>("Mitrovicë");

  const perdoruesId = perdoruesi?.id ?? null;

  // Kur hyn një llogari, lexo qytetin e saj. Herën e parë qyteti i llogarisë
  // merr vlerën e qytetit aktual të shfletimit dhe ruhet për atë llogari.
  useEffect(() => {
    if (!perdoruesId) {
      setQytetiLlogarise("Mitrovicë");
      return;
    }

    const ruajtur = lexoQytetinELlogarise(perdoruesId);
    if (ruajtur) {
      setQytetiLlogarise(ruajtur);
      return;
    }

    setQytetiLlogarise(qyteti);
    ruajQytetinELlogarise(perdoruesId, qyteti);
    // Vetëm ndryshimi i llogarisë duhet ta rilexojë qytetin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perdoruesId]);

  function ndryshoQytetinLlogarise(q: Qyteti) {
    setQytetiLlogarise(q);
    if (perdoruesId) ruajQytetinELlogarise(perdoruesId, q);
  }

  return (
    <LokacioniContext.Provider
      value={{
        qyteti,
        ndryshoQytetin: setQyteti,
        qytetiLlogarise,
        ndryshoQytetinLlogarise,
      }}
    >
      {children}
    </LokacioniContext.Provider>
  );
}

export function useLokacioni() {
  const context = useContext(LokacioniContext);
  if (!context) {
    throw new Error("useLokacioni must be used within LokacioniProvider");
  }
  return context;
}
