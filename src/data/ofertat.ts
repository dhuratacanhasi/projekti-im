// Ofertat javore të UniBite. Janë të dhëna lokale: shfaqen për të gjithë
// dhe tregojnë ditët/orarin kur zbritja është aktive.
export type Oferta = {
  id: string;
  titulli: string;
  pershkrimi: string;
  /** 0 = e diel, 1 = e hënë … 6 = e shtunë */
  ditet: number[];
  nga: string;
  deri: string;
  zbritje: string;
  foto: string;
  restorantId?: string;
};

const foto = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;

const DITET_SHQIP = ["E diel", "E hënë", "E martë", "E mërkurë", "E enjte", "E premte", "E shtunë"];

export const OFERTAT: Oferta[] = [
  {
    id: "mengjes-combo",
    titulli: "Mëngjes Combo",
    pershkrimi: "Kafe + croissant ose omletë me çmim të zbritur.",
    ditet: [1, 2, 3],
    nga: "08:00",
    deri: "10:00",
    zbritje: "-20%",
    foto: foto("1533089860892-a7c6f0a88666"),
    restorantId: "18220db1-3de3-43fc-b1cb-6b2184cd4004",
  },
  {
    id: "student-lunch",
    titulli: "Student Lunch",
    pershkrimi: "Pasta, rizoto ose sallatë me çmim studenti.",
    ditet: [1, 2, 3, 4, 5],
    nga: "12:00",
    deri: "15:00",
    zbritje: "-15%",
    foto: foto("1511690743698-d9d85f2fbf38"),
    restorantId: "943d4b08-22ec-42c6-8949-16739b773c51",
  },
  {
    id: "pizza-tuesday",
    titulli: "Pizza Tuesday",
    pershkrimi: "Bli një picë të madhe dhe merr të dytën falas.",
    ditet: [2],
    nga: "17:00",
    deri: "22:00",
    zbritje: "1+1",
    foto: foto("1513104890138-7c749659a591"),
    restorantId: "a4cd5c90-cc7a-4455-b57e-1c489a8fd175",
  },
  {
    id: "sushi-night",
    titulli: "Sushi Night",
    pershkrimi: "Zbritje në të gjitha rolls dhe setet e mbrëmjes.",
    ditet: [4, 5],
    nga: "18:00",
    deri: "22:00",
    zbritje: "-25%",
    foto: foto("1579871494447-9811cf80d66c"),
    restorantId: "4bb4a436-eefa-4200-a9c2-7834dccb0bfd",
  },
  {
    id: "weekend-family",
    titulli: "Fundjavë Familjare",
    pershkrimi: "Grill dhe pjata familjare me zbritje fundjave.",
    ditet: [0, 6],
    nga: "11:00",
    deri: "16:00",
    zbritje: "-10%",
    foto: foto("1544025162-d76694265947"),
    restorantId: "85fb636f-382e-4ee1-b57b-fae7c1715068",
  },
  {
    id: "kafe-bagel",
    titulli: "Kafe & Bagel",
    pershkrimi: "Dy kafe speciale për çmimin e njërës.",
    ditet: [1, 2, 3, 4, 5],
    nga: "07:00",
    deri: "11:00",
    zbritje: "2 për 1",
    foto: foto("1509042239860-f550ce710b93"),
    restorantId: "b3e96801-bdcd-4105-91d1-ba67c1ab7f4e",
  },
];

export function diteShqip(ditet: number[]): string {
  if (ditet.length === 7) return "Çdo ditë";
  if (ditet.length === 2 && ditet.includes(0) && ditet.includes(6)) return "Fundjavë";

  const rresht = [...ditet].sort((a, b) => a - b);
  if (rresht.length === 1) return DITET_SHQIP[rresht[0]];

  return `${DITET_SHQIP[rresht[0]]} – ${DITET_SHQIP[rresht[rresht.length - 1]].toLowerCase()}`;
}

export function ofertaAktive(oferta: Oferta, tani = new Date()): boolean {
  if (!oferta.ditet.includes(tani.getDay())) return false;

  const [oreNga, minutaNga] = oferta.nga.split(":").map(Number);
  const [oreDeri, minutaDeri] = oferta.deri.split(":").map(Number);
  const minutaTani = tani.getHours() * 60 + tani.getMinutes();

  return minutaTani >= oreNga * 60 + minutaNga && minutaTani <= oreDeri * 60 + minutaDeri;
}
