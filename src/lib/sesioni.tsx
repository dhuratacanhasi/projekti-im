import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// #region burimi
// Me EXPO_PUBLIC_OFFLINE=1 (K3 pa internet) hyrja punon me llogari në memorie; pa të, me Supabase Auth.
// Ndërrimi nuk kërkon ndryshim kodi, si te src/data/burimi.ts i javës 5.
import type * as Supabase from "./hyrja";
import * as offline from "./hyrja-offline";

const burimi: typeof Supabase =
  process.env.EXPO_PUBLIC_OFFLINE === "1"
    ? (offline satisfies typeof Supabase) // tsc kontrollon që offline ka të njëjtat funksione
    : require("./hyrja"); // ngarkohet vetëm kur duhet: offline, klienti i Supabase s'krijohet fare

export type { Perdoruesi } from "./hyrja";
export const { hyr, krijoLlogari, dil } = burimi;
// #endregion

// #region sesioni
// Sesioni i ndarë për gjithë aplikacionin: kush ka hyrë (ose null), dhe a po lexohet ende nga telefoni.
type Sesioni = { perdoruesi: Supabase.Perdoruesi | null; dukeLexuar: boolean };

const SesioniContext = createContext<Sesioni>({ perdoruesi: null, dukeLexuar: true });

export function SesioniProvider({ children }: { children: ReactNode }) {
  const [sesioni, setSesioni] = useState<Sesioni>({ perdoruesi: null, dukeLexuar: true });

  useEffect(() => burimi.degjoSesionin((perdoruesi) => setSesioni({ perdoruesi, dukeLexuar: false })), []);

  return <SesioniContext.Provider value={sesioni}>{children}</SesioniContext.Provider>;
}

export function useSesioni(): Sesioni {
  return useContext(SesioniContext);
}
// #endregion
