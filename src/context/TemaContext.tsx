import { useVizitori } from "@/context/VizitoriContext";

// Ngjyrat e aplikacionit: portokalli për përdoruesin e kyçur,
// purple për vizitorin (që të dallohet qartë që s'ka llogari).
export type Tema = {
  kryesor: string;
  kryesorSfond: string;
  sfond: string;
  kart: string;
  tekst: string;
  tekstDytësor: string;
  kufi: string;
  butonTekst: string;
};

const portokalli: Tema = {
  kryesor: "#FF6B35",
  kryesorSfond: "#fff3ec",
  sfond: "#f9f9f9",
  kart: "#ffffff",
  tekst: "#333333",
  tekstDytësor: "#666666",
  kufi: "#dddddd",
  butonTekst: "#ffffff",
};

const purple: Tema = {
  kryesor: "#7C3AED",
  kryesorSfond: "#ede9fe",
  sfond: "#f5f3ff",
  kart: "#ffffff",
  tekst: "#2e1065",
  tekstDytësor: "#6d28d9",
  kufi: "#ddd6fe",
  butonTekst: "#ffffff",
};

export function useTema(): Tema {
  const { eshteVizitor } = useVizitori();
  return eshteVizitor ? purple : portokalli;
}
