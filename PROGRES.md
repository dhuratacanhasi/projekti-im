# PROGRESI — UniBite

Përditësimi i fundit: 13.11.2026

## Përmbledhje

UniBite është një aplikacion mobil për porositje ushqimi, i ndërtuar me Expo SDK 58 (React Native + TypeScript) dhe Supabase. Aplikacioni mbulon rrjedhën e plotë nga shfletimi i katalogut deri te porosia, besnikëria dhe ndjekja e porosisë.

## Milestonet

| Milestone | Statusi | Përshkrimi |
| --- | --- | --- |
| M0 — Ideja dhe dokumentimi | ✅ | Përcaktimi i idesë, përdoruesit të parë dhe rrjedhës së aplikacionit. |
| M1 — Katalogu nga Supabase | ✅ | Lista e restoranteve lexohet nga tabela `restaurants`, me gjendje ngarkimi, bosh dhe gabimi. |
| M2 — Shtimi i restorantit | ✅ | Forma "+ Shto" ruan restorantin në Supabase me trajtim gabimesh. |
| M3 — Home me të dhëna reale | ✅ | Ekrani kryesor plotësisht i lidhur me Supabase. |
| M4 — Menu, shportë dhe checkout | ✅ | Menuja e restorantit, shporta dhe checkout-i me qytet, adresë, telefon, pagesë dhe shënime. |
| M5 — Autentifikim dhe RLS | ✅ | Hyrje/regjistrim me Supabase Auth, politika RLS për `restaurants` dhe `menu_items`, pronësi e rreshtave. |
| M6 — Besnikëria dhe porositë | ✅ | Kupon −10% pas çdo 10 porosish, aplikim automatik në checkout, ndjekje e porosisë dhe ekran shpërblimesh. |

## Funksionalitetet e përfunduara

- Autentifikim me email/fjalëkalim dhe modalitet vizitori me katalog demo.
- Filtrim i restoranteve sipas 7 qyteteve; 20 restorante dhe 160 artikuj në katalog.
- Shportë që ruhet edhe kur vizitori hyn në llogari.
- Checkout me përmbledhje porosie dhe konfirmim lokal.
- Program besnikërie me kupon −10% të aplikuar automatikisht.
- Ndjekje e porosisë me statuse të përditësuara automatikisht.
- Shtim dhe fshirje e restorantit të vetëm (RLS).
- Ndërfaqe dygjuhëshe shqip ⇄ anglisht, përfshirë përmbajtjen e katalogut.
- Profil me progresin e besnikërisë, restorantet e mia dhe lokacionin e llogarisë.
- Dizajn i unifikuar vjollcë me ikona të personalizuara.

## Hapat e ardhshëm

- Ruajtja e porosive në Supabase (`orders` / `order_items`) në vend të ruajtjes lokale.
- Njoftime për statusin e porosisë.
- Panel i plotë për pronarët e restoranteve (menaxhim menuje).
- Teste automatike për rrjedhën e porosisë dhe përkthimet.

## Shënim

Të dhënat e porosive dhe kuponat ruhen lokalisht në pajisje, të ndara për çdo llogari. Skriptet e databazës ndodhen në dosjen `supabase/` dhe ekzekutohen manualisht në Supabase SQL Editor.
