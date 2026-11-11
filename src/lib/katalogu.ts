import { DEMO_MENU_ITEMS, DEMO_RESTAURANTS } from "@/data/demo";
import type { MenuItem, Restaurant } from "@/types";

// Fotot rezervë: përdoren kur rreshti në Supabase s'ka image_url
// (p.sh. para se të ekzekutohet seed-i i katalogut).
const foto = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;

const FOTO_KATEGORI: { fjalet: string[]; url: string }[] = [
  { fjalet: ["pizza", "pica", "calzone", "focaccia"], url: foto("1513104890138-7c749659a591") },
  { fjalet: ["burger", "hamburger", "cheeseburger"], url: foto("1568901346375-23c9450c58cd") },
  {
    fjalet: ["pasta", "spaghetti", "penne", "fettuccine", "lasagna", "rizoto", "risotto"],
    url: foto("1621996346565-e3dbc646d9a9"),
  },
  { fjalet: ["sushi", "nigiri", "sashimi", "roll"], url: foto("1579871494447-9811cf80d66c") },
  { fjalet: ["sallat", "salad", "caprese", "caesar"], url: foto("1512621776951-a57141f2eefd") },
  { fjalet: ["kafe", "coffee", "espresso", "cappuccino", "latte", "brew"], url: foto("1509042239860-f550ce710b93") },
  { fjalet: ["lëng", "leng", "limonad", "juice", "portokall"], url: foto("1600271886742-f049cd451bba") },
  { fjalet: ["çaj", "caj", "tea"], url: foto("1544787219-7f47ccb76574") },
  {
    fjalet: ["ëmbëlsir", "embelsir", "dessert", "bakllava", "cheesecake", "tiramisu", "panna", "brownie", "pancake"],
    url: foto("1578985545062-69928b1d9587"),
  },
  { fjalet: ["sandwich", "wrap", "hot dog", "bagel", "bruschetta"], url: foto("1528735602780-2552fd46c7af") },
  {
    fjalet: ["grill", "qebap", "pleskavic", "biftek", "qengj", "mish", "shish"],
    url: foto("1544025162-d76694265947"),
  },
  { fjalet: ["supë", "supe", "soup", "miso"], url: foto("1547592166-23ac45744acd") },
  { fjalet: ["mëngjes", "mengjes", "breakfast", "omlet", "vezë", "veze", "flija"], url: foto("1533089860892-a7c6f0a88666") },
  { fjalet: ["pulë", "pule", "chicken", "wings", "nugget", "zinger"], url: foto("1562967914-608f82629710") },
  { fjalet: ["peshk", "salmon", "trout", "seafood", "karkalec", "ton"], url: foto("1559737558-2f5a35f4523b") },
  { fjalet: ["ujë", "uje", "water", "ayran"], url: foto("1523362628745-0c100150b504") },
  { fjalet: ["cola", "pepsi", "fanta", "soda", "birrë", "birre"], url: foto("1554866585-cd94860890b7") },
  { fjalet: ["bowl", "granola", "doner", "gyros", "falafel"], url: foto("1511690743698-d9d85f2fbf38") },
];

const FOTO_RESTORANT = foto("1517248135467-4c7edcad34c4");

function fotoSipasKategorise(kategoria: string | null, emri: string | null): string {
  const teksti = `${kategoria ?? ""} ${emri ?? ""}`.toLowerCase();
  for (const grup of FOTO_KATEGORI) {
    if (grup.fjalet.some((fjale) => teksti.includes(fjale))) return grup.url;
  }
  return foto("1504674900247-0877df9cc836");
}

// Plotëson fushat që mungojnë në rreshtin e Supabase me të dhënat demo,
// që fotot të shfaqen edhe pa seed-in e ri.
export function plotesoRestorantin(r: Restaurant): Restaurant {
  const emri = (r.name_sq || r.name || "").toLowerCase();
  const demo =
    DEMO_RESTAURANTS.find((d) => d.id === r.id) ??
    DEMO_RESTAURANTS.find((d) => (d.name_sq || d.name || "").toLowerCase() === emri);

  return {
    ...r,
    image_url: r.image_url || demo?.image_url || FOTO_RESTORANT,
    city: r.city || demo?.city || "Mitrovicë",
    address: r.address || demo?.address || null,
    category: r.category || demo?.category || null,
    delivery_time: r.delivery_time || demo?.delivery_time || null,
    rating: r.rating && r.rating > 0 ? r.rating : demo?.rating ?? null,
    description_sq: r.description_sq || demo?.description_sq || null,
  };
}

export function plotesoArtikullin(item: MenuItem): MenuItem {
  const emri = (item.name_sq || item.name || "").toLowerCase();
  const demo =
    DEMO_MENU_ITEMS.find((d) => d.id === item.id) ??
    DEMO_MENU_ITEMS.find(
      (d) =>
        d.restaurant_id === item.restaurant_id &&
        (d.name_sq || d.name || "").toLowerCase() === emri
    );

  return {
    ...item,
    image_url:
      item.image_url ||
      demo?.image_url ||
      fotoSipasKategorise(item.category, item.name_sq || item.name),
    description_sq: item.description_sq || demo?.description_sq || null,
    category: item.category || demo?.category || null,
  };
}

// Bashkon katalogun e Supabase me atë demo: rreshtat e DB kanë përparësi,
// ndërsa restorantet që mungojnë shtohen që app-i të mos mbetet bosh.
export function bashkoKatalogun(teDhenat: Restaurant[]): Restaurant[] {
  const tePlotesuara = teDhenat.map(plotesoRestorantin);
  const idEkzistuese = new Set(tePlotesuara.map((r) => r.id));
  const shtesa = DEMO_RESTAURANTS.filter((d) => !idEkzistuese.has(d.id)).map(plotesoRestorantin);

  return [...tePlotesuara, ...shtesa].sort((a, b) =>
    (a.name_sq || a.name || "").localeCompare(b.name_sq || b.name || "", "sq")
  );
}

// Menuja: artikujt e DB plotësohen me foto dhe shtohen artikujt demo që mungojnë.
export function bashkoMenune(teDhenat: MenuItem[], restaurantId: string): MenuItem[] {
  const tePlotesuara = teDhenat.map(plotesoArtikullin);
  const idEkzistuese = new Set(tePlotesuara.map((m) => m.id));
  const shtesa = DEMO_MENU_ITEMS.filter(
    (m) => m.restaurant_id === restaurantId && !idEkzistuese.has(m.id)
  );

  return [...tePlotesuara, ...shtesa];
}
