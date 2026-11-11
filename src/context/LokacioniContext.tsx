import { createContext, useContext, useState, type ReactNode } from "react";

// Qyteti i zgjedhur në krye të app-it. Filtron restorantet dhe
// përdoret si qytet dorëzimi në checkout. Jeton në kujtesë.
export const QYTETET = ["Mitrovicë", "Prishtinë", "Pejë", "Prizren", "Gjakovë", "Ferizaj", "Gjilan"] as const;

export type Qyteti = (typeof QYTETET)[number];

type LokacioniContextType = {
  qyteti: Qyteti;
  ndryshoQytetin: (q: Qyteti) => void;
};

const LokacioniContext = createContext<LokacioniContextType | undefined>(undefined);

export function LokacioniProvider({ children }: { children: ReactNode }) {
  const [qyteti, setQyteti] = useState<Qyteti>("Mitrovicë");

  return (
    <LokacioniContext.Provider value={{ qyteti, ndryshoQytetin: setQyteti }}>
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
