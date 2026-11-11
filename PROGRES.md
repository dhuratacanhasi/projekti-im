# PROGRESI - UniBite

## Çka punon
- **M0**: AGENTS.md është përditësuar me idenë e UniBite. Agjenti e përmbledh saktë qëllimin e aplikacionit (platformë porosish ushqimi për studentët në Mitrovicë).
- **M1**: Aplikacioni lexon restorantet nga tabela `restaurants` në Supabase dhe i shfaq në listë në telefonin mobil. Ka gjendje ngarkimi, bosh dhe gabim.
- **M2**: Përdoruesi mund të shtojë një restorant të ri nga telefoni përmes formës "+ Shto". Të dhënat ruhen në Supabase me trajtim të gabimeve.
- **M3**: Ekrani kryesor (lista e restoranteve) është i lidhur plotësisht me Supabase dhe funksionon me të dhëna reale.

## Çka bëri agjenti
- Analizoi projektin ekzistues dhe dokumentet (AGENTS.md, HARTA.md, BISEDAT.md)
- Përditësoi dokumentet për aplikacionin UniBite (ideja, ekranet, rrjedha)
- Krijoi lidhjen me Supabase (.env.local, supabase.ts, instaloi @supabase/supabase-js)
- Krijoi tabelat `restaurants` dhe `menu_items` në Supabase me RLS dhe të dhëna shembull
- Transformoi aplikacionin nga demo në UniBite (lista e restoranteve nga Supabase)
- Shtoi funksionalitetin për të shtuar restorante nga telefoni (M2)
- Shtoi menunë për çdo restorant dhe funksionalitetin e shportës
- Bëri commit-e pas çdo hapi të rëndësishëm

## Hapi tjetër
- Shtimi i autentifikimit me email (Login/Register) për përdoruesit
- Krijimi i tabelës `orders` dhe `order_items` për ruajtjen e porosive
- Implementimi i gjurmimit të porosisë (Order Status/Track Order)
- Zhvillimi i sistemit të pikëve të lojalitetit dhe kuponëve sipas blerjeve
