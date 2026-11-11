import { createContext, useContext, useState, type ReactNode } from "react";

// Vizitori shfleton pa llogari, por çdo veprim shkrimi (porosi, shtim restoranti)
// kërkon hyrje. Flamuri jeton vetëm në kujtesë dhe fiket kur hapet hyrja.
type VizitoriContextType = {
  eshteVizitor: boolean;
  hyjSiVizitor: () => void;
  dilSiVizitor: () => void;
};

const VizitoriContext = createContext<VizitoriContextType | undefined>(undefined);

export function VizitoriProvider({ children }: { children: ReactNode }) {
  const [eshteVizitor, setEshteVizitor] = useState(false);

  return (
    <VizitoriContext.Provider
      value={{
        eshteVizitor,
        hyjSiVizitor: () => setEshteVizitor(true),
        dilSiVizitor: () => setEshteVizitor(false),
      }}
    >
      {children}
    </VizitoriContext.Provider>
  );
}

export function useVizitori() {
  const context = useContext(VizitoriContext);
  if (!context) {
    throw new Error("useVizitori must be used within VizitoriProvider");
  }
  return context;
}
