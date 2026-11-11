// Ngjyrat e aplikacionit: një paletë e vetme vjollcë për të gjithë.
// Vizitori e përdor të njëjtën paletë, vetëm banneri tregon statusin.
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

const vjollce: Tema = {
  kryesor: "#7C3AED",
  kryesorSfond: "#EDE9FE",
  sfond: "#F6F4FF",
  kart: "#FFFFFF",
  tekst: "#2E1065",
  tekstDytësor: "#6D28D9",
  kufi: "#DDD6FE",
  butonTekst: "#FFFFFF",
};

export function useTema(): Tema {
  return vjollce;
}
