# 🍽️ UniBite

**Aplikacion mobil për porositje ushqimi** — shfletim restorantesh, menu, shportë, checkout, besnikëri dhe ndjekje porosie.

![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres%20%2B%20RLS-3ECF8E?logo=supabase&logoColor=white)

---

## Për projektin

UniBite është një aplikacion mobil i ndërtuar me **Expo (React Native)** dhe **Supabase**, që u mundëson përdoruesve të shfletojnë restorante, të shohin menunë, të shtojnë produkte në shportë dhe të bëjnë porosi për dorëzim. Aplikacioni është ndërtuar si projekt i lëndës dhe demonstron një rrjedhë të plotë: autentifikim, katalog me të dhëna reale, RLS në server, porositje dhe besnikëri.

### Karakteristikat kryesore

- 🔐 **Autentifikim** me email dhe fjalëkalim përmes Supabase Auth.
- 👤 **Modaliteti vizitor** — shfletim i katalogut demo pa llogari; porositja dhe shtimi i restorantit kërkojnë llogari. Shporta ruhet edhe pas hyrjes në llogari.
- 🏙️ **Filtrimi sipas qytetit** (7 qytete) me katalog prej 20 restorantesh dhe 160 artikujsh.
- 🛒 **Shportë dhe checkout** — qytet, adresë, telefon, mënyrë pagese (cash/kartë), shënime dhe përmbledhje e porosisë.
- 🎁 **Programi i besnikërisë** — çdo 10 porosi të përfunduara fiton një kupon **−10%**, i cili aplikohet automatikisht në checkout. Ekran i dedikuar shpërblimesh.
- 📦 **Ndjekja e porosisë** — statusi përditësohet automatikisht në kohë reale (Konfirmuar → Në përgatitje → Në rrugë → Dorëzuar).
- 🏪 **Menaxhimi i restoranteve** — përdoruesi mund të shtojë dhe të fshijë restorantin e vet; restorantet e tjera mbeten të pandryshueshme falë RLS-së.
- 🌐 **Ndërfaqe dygjuhëshe** — shqip (parazgjedhur) dhe anglisht, duke përfshirë përmbajtjen e katalogut; zgjedhja ruhet në pajisje.
- 📍 **Lokacion i pavarur** — qyteti i llogarisë (profili) është i ndarë nga qyteti i porosisë/dorëzimit.
- 🎨 **Identitet vizual** — paletë vjollcë (`#7C3AED` / `#5B21B6`), ikona PNG të personalizuara dhe ekran splash i markës.

## Teknologjitë

| Shtresa | Teknologjia |
| --- | --- |
| Framework | Expo SDK 58, React Native 0.88, React 19 |
| Gjuha | TypeScript 6 |
| Navigimi | Expo Router (file-based routing) |
| Backend | Supabase (Auth, PostgreSQL, Row Level Security) |
| Ruajtja lokale | `expo-sqlite` (polyfill për `localStorage`) |
| UI | React Native core, Expo Linear Gradient, ikona PNG |

## Struktura e projektit

```text
src/
├── app/                 # Ekranet (Expo Router)
│   ├── index.tsx        # Home: qyteti, ofertat, lista e restoranteve
│   ├── restaurant/[id]  # Menuja e restorantit
│   ├── artikull/[id]    # Detajet e produktit
│   ├── cart.tsx         # Shporta
│   ├── checkout.tsx     # Porosia
│   ├── porosite.tsx     # Ndjekja e porosive
│   ├── shperblimet.tsx  # Shpërblimet dhe kuponat
│   ├── profili.tsx      # Profili, besnikëria, restorantet e mia
│   ├── add-restaurant.tsx
│   └── hyrja.tsx        # Hyrje / regjistrim
├── components/          # Komponentë të ripërdorshëm (butona, shiriti i poshtëm, ofertat)
├── context/             # Gjendja globale: shporta, lokacioni, besnikëria, porositë, tema
├── data/                # Katalogu demo dhe përkthimet e përmbajtjes
├── i18n/                # Fjalori shqip ⇄ anglisht dhe konteksti i gjuhës
├── lib/                 # Supabase, sesioni, bashkimi i katalogut
└── types/               # Tipet TypeScript

supabase/
├── j6-hyrja-rls.sql     # Politikat RLS për restaurants / menu_items
├── j6-fshirja.sql       # Politikat për fshirjen e restorantit të vet
└── seed-katalogu.sql    # Të dhëna fillestare për katalogun
```

## Instalimi dhe nisja

**Kërkesat:** Node.js 20+, npm, aplikacioni Expo Go (ose emulator Android/iOS).

```bash
# 1. Klonimi i repositorit
git clone https://github.com/dhuratacanhasi/projekti-im.git
cd projekti-im

# 2. Instalimi i varësive
npm install

# 3. Konfigurimi i variablave të mjedisit
#    Kopjo .env.example në .env.local dhe plotëso vlerat e projektit Supabase
cp .env.example .env.local

# 4. Nisja e aplikacionit
npx expo start
```

Skano QR-kodin me Expo Go ose shtyp `a` për emulatorin Android.

### Variablat e mjedisit

Krijo skedarin `.env.local` në rrënjë të projektit:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<projekti>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

> ⚠️ `.env.local` nuk duhet të komitohet kurrë. Vetëm çelësi **anon/publishable** përdoret në klient — çelësi `service_role` nuk duhet të shfaqet në aplikacion.

## Konfigurimi i Supabase

Në **Supabase → SQL Editor**, ekzekuto skriptet sipas radhës:

1. `supabase/seed-katalogu.sql` — krijon/plotëson katalogun e restoranteve dhe menutë.
2. `supabase/j6-hyrja-rls.sql` — aktivizon RLS dhe politikat e qasjes për përdoruesit e kyçur.
3. `supabase/j6-fshirja.sql` — lejon fshirjen e restorantit të vetëm të pronarit.

### Modeli i sigurisë (RLS)

- Vizitorët (`anon`) **nuk** kanë qasje në tabelat e katalogut.
- Përdoruesit e kyçur lexojnë katalogun e përbashkët (`pronari_id IS NULL`) dhe restorantet e veta.
- `pronari_id` mbushet automatikisht nga serveri me `auth.uid()`; klienti nuk e dërgon.
- Shtimi dhe ndryshimi lejohen vetëm për rreshtat e pronarit.

## Të dhënat dhe gjendja lokale

| Të dhëna | Ruajtja |
| --- | --- |
| Porositë e përfunduara | `unibite_porosite:<userId>` |
| Kuponat | `unibite_kuponat:<userId>` |
| Historiku i porosive | `unibite_porosite_histori:<userId>` |
| Gjuha | `unibite_gjuha` |
| Qyteti i llogarisë | `unibite_qyteti_llogarise:<userId>` |

Porositë dhe kuponat janë lokale për çdo llogari; vizitorët nuk shohin të dhëna të llogarive tjera.

## Ekipi

- **Elma Arifi**
- **Dhurata Canhasi**

Projekt i lëndës — UniBite · versioni 1.0.0.

## Licenca

Shih [LICENSE](LICENSE).
