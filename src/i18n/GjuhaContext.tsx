import { createContext, useContext, useEffect, type ReactNode, useState } from "react";
import "expo-sqlite/localStorage/install";

// Gjuha e aplikacionit: shqip (parazgjedhur) ose anglisht.
// Përkthimi bëhet me tekstin shqip si çelës, që kodet të mbeten të lexueshme.
export type Gjuha = "sq" | "en";

const CELESI = "unibite_gjuha";

const ANGLISHT: Record<string, string> = {
  // #region te perbashketa
  Anulo: "Cancel",
  Hyr: "Sign in",
  Dil: "Sign out",
  Fshi: "Delete",
  Gabim: "Error",
  Sukses: "Success",
  "Prisni…": "Please wait…",
  "Po dilni…": "Signing out…",
  "Hyr / Krijo llogari": "Sign in / Create account",
  "Kërkohet llogari": "Account required",
  "Për të porositur duhet të hyni ose të krijoni llogari.":
    "To order, sign in or create an account.",
  "Për të shtuar restorant duhet të hyni ose të krijoni llogari.":
    "To add a restaurant, sign in or create an account.",
  "Ndrysho gjuhën": "Change language",
  // #endregion

  // #region menuja dhe titujt
  "UniBite · Vizitor": "UniBite · Visitor",
  "Profili im": "My profile",
  "Shto Restorant": "Add restaurant",
  Menuja: "Menu",
  Shporta: "Cart",
  Porosia: "Order",
  "Shpërblimet": "Rewards",
  "Porositë e mia": "My orders",
  Hyrja: "Sign in",
  Restorantet: "Restaurants",
  "Porositë": "Orders",
  // #endregion

  // #region faqja kryesore
  "Përshëndetje 👋": "Hello 👋",
  "Çka po hajmë sot?": "What are we eating today?",
  "{n} restorante · po shfletoni si vizitor": "{n} restaurants · browsing as visitor",
  "{n} restorante · gati për porosi": "{n} restaurants · ready to order",
  "🛒 Shporta · {n}": "🛒 Cart · {n}",
  "+ Shto": "+ Add",
  "Vizitor · Hyni për të porositur ose për të shtuar restorant":
    "Visitor · Sign in to order or add a restaurant",
  "Nuk ka restorante në {qyteti}": "No restaurants in {qyteti}",
  "Provo një qytet tjetër ose shiko të gjitha restorantet.":
    "Try another city or view all restaurants.",
  "Ndrysho qytetin": "Change city",
  "Ndrysho qytetin, aktualisht {qyteti}": "Change city, currently {qyteti}",
  "Zgjidh qytetin": "Choose city",
  "Restorantet do të filtrohen sipas qytetit.": "Restaurants will be filtered by city.",
  "Po ngarkohen restorantet...": "Loading restaurants...",
  "Provo përsëri": "Try again",
  // #endregion

  // #region checkout
  "Mungon adresa": "Address missing",
  "Shkruani adresën / lokacionin e dorëzimit.": "Enter the delivery address / location.",
  "Mungon telefoni": "Phone missing",
  "Shkruani një numër telefoni të saktë.": "Enter a valid phone number.",
  "Shporta është bosh": "Your cart is empty",
  "Shtoni produkte para se të porosisni.": "Add items before ordering.",
  "Cash në dorëzim": "Cash on delivery",
  "Kartë në dorëzim": "Card on delivery",
  "Porosia u dërgua": "Order placed",
  "Qyteti: {qyteti}\nAdresa: {adresa}\nTelefoni: {telefoni}\nPagesa: {pagesa}\n{shenime}{kupon}\n{rreshtat}\n\nTotali: €{totali}":
    "City: {qyteti}\nAddress: {adresa}\nPhone: {telefoni}\nPayment: {pagesa}\n{shenime}{kupon}\n{rreshtat}\n\nTotal: €{totali}",
  "Shënime: {shenime}\n": "Notes: {shenime}\n",
  "Kupon: {kodi} (−{zbritje}%)\nZbritja: −€{zbritjaEuro}\n":
    "Coupon: {kodi} (−{zbritje}%)\nDiscount: −€{zbritjaEuro}\n",
  "Urime! 🎉": "Congratulations! 🎉",
  "Fitove një kupon {zbritje}% për porosinë e radhës.\nKodi: {kodi}\n\nDo të aplikohet automatikisht në checkout.":
    "You earned a {zbritje}% coupon for your next order.\nCode: {kodi}\n\nIt will be applied automatically at checkout.",
  "Kthehu te restorantet": "Back to restaurants",
  "Të dhënat e porosisë": "Order details",
  "Plotësoni adresën dhe telefonin që dorëzuesi t'ju gjejë.":
    "Fill in your address and phone so the courier can find you.",
  "Qyteti i dorëzimit": "Delivery city",
  "Adresa / lokacioni i dorëzimit *": "Delivery address / location *",
  "Rruga, numri, kati, apartamenti": "Street, number, floor, apartment",
  "Numri i telefonit *": "Phone number *",
  "Mënyra e pagesës": "Payment method",
  "Shënime (opsionale)": "Notes (optional)",
  "p.sh. pa qepë, zile 3, kati 2": "e.g. no onions, bell 3, floor 2",
  "Kupon −{zbritje}%": "Coupon −{zbritje}%",
  "Kodi: {kodi} · trokit për ta {veprim}": "Code: {kodi} · tap to {veprim}",
  hequr: "remove",
  "përdorur": "apply",
  "🎟️ Besnikëria UniBite": "🎟️ UniBite Loyalty",
  "{progresi}/{pragu} porosi drejt kuponit të radhës −10%":
    "{progresi}/{pragu} orders towards your next −10% coupon",
  "Përmbledhja e porosisë": "Order summary",
  "Zbritja e kuponit": "Coupon discount",
  Totali: "Total",
  "Porosit dhe konfirmo": "Place order",
  // #endregion

  // #region porosite
  "Fshi historikun?": "Clear history?",
  "Të gjitha porositë do të hiqen nga ky telefon. Ky veprim nuk kthehet.":
    "All orders will be removed from this phone. This cannot be undone.",
  "Fshi historikun": "Clear history",
  "Nuk ke porosi": "No orders yet",
  "Pasi të porosisësh, këtu mund ta ndjekësh porosinë hap pas hapi.":
    "Once you order, you can track it here step by step.",
  "Shiko restorantet": "Browse restaurants",
  "Porosi UniBite": "UniBite order",
  "🔁 Porosit përsëri": "🔁 Order again",
  Konfirmuar: "Confirmed",
  "Në përgatitje": "Preparing",
  "Në rrugë": "On the way",
  "Dorëzuar": "Delivered",
  "Menjëherë": "Now",
  "pas {n} min": "after {n} min",
  // #endregion

  // #region shperblimet
  "Shpërblimet UniBite": "UniBite Rewards",
  "Çdo {n} porosi = kupon −10% që aplikohet automatikisht":
    "Every {n} orders = a −10% coupon applied automatically",
  "{porosite} porosi gjithsej · edhe {mbetura} për kuponin e radhës":
    "{porosite} orders total · {mbetura} more until your next coupon",
  "Kuponët e mi": "My coupons",
  "Nuk ke kupon aktiv": "No active coupons",
  "Porosit edhe {n} herë dhe fiton një kupon −10% për porosinë tjetër.":
    "Order {n} more times to earn a −10% coupon for your next order.",
  "Porosit tani": "Order now",
  "Kodi: {kodi}": "Code: {kodi}",
  AKTIV: "ACTIVE",
  "Aplikohet automatikisht kur të porosisësh.": "Applied automatically when you order.",
  "Përdore tani": "Use now",
  "Si funksionon?": "How it works",
  "Porosit ushqim nga UniBite.": "Order food from UniBite.",
  "Çdo {n} porosi fiton një kupon −10%.": "Every {n} orders earns a −10% coupon.",
  "Kuponi aplikohet vetë në porosinë tjetër.": "The coupon applies itself to your next order.",
  "Kuponë të përdorur": "Used coupons",
  Përdorur: "Used",
  // #endregion

  // #region shporta
  "Po shfletoni si vizitor. Për të porositur, hyni ose krijoni llogari.":
    "You are browsing as a visitor. To order, sign in or create an account.",
  "Totali:": "Total:",
  "Për të porositur duhet të hyni ose të krijoni llogari. Shporta juaj do të ruhet.":
    "To order, sign in or create an account. Your cart will be kept.",
  // #endregion

  // #region profili
  "Dil nga llogaria": "Sign out",
  "A jeni i sigurt që dëshironi të dilni?": "Are you sure you want to sign out?",
  "Dalja nuk u krye": "Sign out failed",
  "Fshi restorantin": "Delete restaurant",
  'A jeni i sigurt që dëshironi të fshini "{emri}"? Ky veprim nuk kthehet.':
    'Are you sure you want to delete "{emri}"? This cannot be undone.',
  "Nuk u fshi": "Could not delete",
  "\n\nPër të lejuar fshirjen, ekzekuto skedarin supabase/j6-fshirja.sql në Supabase → SQL Editor.":
    "\n\nTo allow deletion, run supabase/j6-fshirja.sql in Supabase → SQL Editor.",
  "Nuk jeni i kyçur": "You are not signed in",
  "Hyni ose krijoni llogari për të parë profilin dhe restorantet tuaja.":
    "Sign in or create an account to see your profile and restaurants.",
  "Anëtar i UniBite": "UniBite member",
  "Po shfletoni si vizitor": "Browsing as visitor",
  "në shportë": "in cart",
  restorante: "restaurants",
  qyteti: "city",
  "qyteti i llogarisë": "account city",
  "Lokacioni i llogarisë": "Account location",
  "Ky qytet ruhet me llogarinë tuaj dhe nuk ndryshon kur zgjidhni një qytet tjetër për porosi.":
    "This city is saved with your account and does not change when you choose another city for an order.",
  "Zgjidh qytetin e llogarisë: {qyteti}": "Choose account city: {qyteti}",
  "Besnikëria UniBite": "UniBite Loyalty",
  "porosi të përfunduara": "completed orders",
  "{n} kuponë aktivë −10%": "{n} active −10% coupons",
  "Restorantet e mia": "My restaurants",
  "Nuk keni restorante": "No restaurants yet",
  "Shtoni restorantin tuaj të parë dhe do të shfaqet këtu.":
    "Add your first restaurant and it will appear here.",
  "Shto restorant": "Add restaurant",
  "Pa kategori": "No category",
  "UniBite · versioni 1.0.0": "UniBite · version 1.0.0",
  Gjuha: "Language",
  // #endregion

  // #region hyrja
  "Shkruani email-in dhe fjalëkalimin.": "Enter your email and password.",
  "Llogaria u krijua. Hapni email-in, konfirmojeni, pastaj hyni.":
    "Account created. Open your email, confirm it, then sign in.",
  "Ushqimi i kampusit, një porosi larg.": "Campus food, one order away.",
  "Mirë se vini": "Welcome",
  "Hyni ose krijoni llogarinë tuaj.": "Sign in or create your account.",
  "Email-i": "Email",
  "Fjalëkalimi": "Password",
  "Krijo llogari": "Create account",
  ose: "or",
  "Vazhdo si vizitor": "Continue as visitor",
  "Shfletoni restorantet pa llogari. Për të porositur, do t'ju kërkohet të hyni.":
    "Browse restaurants without an account. To order, you will be asked to sign in.",
  // #endregion

  // #region restoranti
  "Po ngarkohen produktet...": "Loading items...",
  "Nuk ka produkte në menunë": "No items on the menu",
  Restoranti: "Restaurant",
  "Të tjera": "Other",
  "Vizitor · Mund të shtoni në shportë, por për të porositur duhet llogari.":
    "Visitor · You can add to cart, but ordering requires an account.",
  Shtuar: "Added",
  "Produkti u shtua në shportë": "Item added to cart",
  // #endregion

  // #region shto restorant
  "Emri i restorantit është i detyrueshëm": "Restaurant name is required",
  "Restoranti u shtua me sukses!": "Restaurant added successfully!",
  "Emri i restorantit *": "Restaurant name *",
  "p.sh. Pizza House": "e.g. Pizza House",
  Kategoria: "Category",
  "p.sh. Pizza, Fast Food": "e.g. Pizza, Fast Food",
  Adresa: "Address",
  "p.sh. Rruga Adem Jashari": "e.g. Adem Jashari Street",
  Qyteti: "City",
  "Qyteti merret nga zgjedhja në krye të aplikacionit.":
    "The city comes from the selection at the top of the app.",
  "Koha e dorëzimit": "Delivery time",
  "p.sh. 20-30 min": "e.g. 20-30 min",
  "Po ruhet...": "Saving...",
  Ruaj: "Save",
  // #endregion

  // #region ofertat
  "Ofertat e javës": "Weekly deals",
  "Combo dhe zbritje sipas ditës e orarit": "Combos and discounts by day and time",
  "● Aktive tani": "● Active now",
  "Mëngjes Combo": "Breakfast Combo",
  "Kafe + croissant ose omletë me çmim të zbritur.":
    "Coffee + croissant or omelette at a reduced price.",
  "Pasta, rizoto ose sallatë me çmim studenti.": "Pasta, risotto or salad at a student price.",
  "Bli një picë të madhe dhe merr të dytën falas.":
    "Buy a large pizza and get the second one free.",
  "Zbritje në të gjitha rolls dhe setet e mbrëmjes.":
    "Discount on all rolls and evening sets.",
  "Fundjavë Familjare": "Family Weekend",
  "Grill dhe pjata familjare me zbritje fundjave.":
    "Grill and family platters with weekend discounts.",
  "Dy kafe speciale për çmimin e njërës.": "Two specialty coffees for the price of one.",
  "2 për 1": "2 for 1",
  // #endregion
};

type Vlera = Record<string, string | number>;

function zevendeso(teksti: string, vlera?: Vlera): string {
  if (!vlera) return teksti;
  return teksti.replace(/\{(\w+)\}/g, (_, celesi: string) => String(vlera[celesi] ?? `{${celesi}}`));
}

type GjuhaContextType = {
  gjuha: Gjuha;
  eshteAnglisht: boolean;
  ndryshoGjuhen: (gjuha: Gjuha) => void;
  ndrysho: () => void;
  t: (shqip: string, vlera?: Vlera) => string;
};

const GjuhaContext = createContext<GjuhaContextType | undefined>(undefined);

export function GjuhaProvider({ children }: { children: ReactNode }) {
  const [gjuha, setGjuha] = useState<Gjuha>("sq");

  useEffect(() => {
    try {
      const ruajtur = localStorage.getItem(CELESI);
      if (ruajtur === "en" || ruajtur === "sq") setGjuha(ruajtur);
    } catch {
      // Ruajtja lokale mund të dështojë në web; mbetet shqip.
    }
  }, []);

  function ndryshoGjuhen(g: Gjuha) {
    setGjuha(g);
    try {
      localStorage.setItem(CELESI, g);
    } catch {
      // ignore
    }
  }

  function ndrysho() {
    ndryshoGjuhen(gjuha === "sq" ? "en" : "sq");
  }

  function t(shqip: string, vlera?: Vlera): string {
    return zevendeso(gjuha === "en" ? (ANGLISHT[shqip] ?? shqip) : shqip, vlera);
  }

  return (
    <GjuhaContext.Provider value={{ gjuha, eshteAnglisht: gjuha === "en", ndryshoGjuhen, ndrysho, t }}>
      {children}
    </GjuhaContext.Provider>
  );
}

export function useGjuha() {
  const context = useContext(GjuhaContext);
  if (!context) {
    throw new Error("useGjuha must be used within GjuhaProvider");
  }
  return context;
}
