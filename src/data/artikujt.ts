export type Artikull = {
  id: string;
  titulli: string;
  pershkrimi: string;
};

export const artikujt: Artikull[] = [
  { id: "1", titulli: "Artikulli një", pershkrimi: "Përshkrimi i artikullit të parë." },
  { id: "2", titulli: "Artikulli dy", pershkrimi: "Përshkrimi i artikullit të dytë." },
  { id: "3", titulli: "Artikulli tre", pershkrimi: "Përshkrimi i artikullit të tretë." },
  { id: "4", titulli: "Artikulli katër", pershkrimi: "Përshkrimi i artikullit të katërt." },
  { id: "5", titulli: "Artikulli pesë", pershkrimi: "Përshkrimi i artikullit të pestë." },
];

export function gjeArtikullin(id: string): Artikull | undefined {
  return artikujt.find((a) => a.id === id);
}