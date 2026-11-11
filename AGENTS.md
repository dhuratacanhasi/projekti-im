# AGENTS.md

## Projekti
UniBite – një aplikacion mobil për studentët në Mitrovicë që u mundëson të porosisin ushqim nga restorante dhe fast food në afërsi gjatë pushimeve të shkurtra.

## Përdoruesi
Studentët që duan të porosisin ushqim shpejt pa pasur nevojë të dalin ose të telefonojnë restorantin. Restorantet/fast food-et që dëshirojnë të marrin porosi më efikase.

## Ekranet
- Login / Register (autentifikim me email)
- Home / Restaurants (lista e restoranteve në Mitrovicë)
- Restaurant Menu (menuja e restorantit të zgjedhur)
- Cart (shporta me produkte)
- Order Status / Track Order (gjurmimi i porosisë)
- Profile (profili i përdoruesit)
- Loyalty / Coupons (kuponë për zbritje sipas blerjeve)

## Stack
- Expo SDK 58, TypeScript, React Native 19
- Expo Router (file-based routing në src/app/)
- Supabase (supabase-js) – Auth, Database, RLS
- .env.local: EXPO_PUBLIC_SUPABASE_URL dhe EXPO_PUBLIC_SUPABASE_ANON_KEY
- KURRË service_role key në aplikacion apo GitHub
- UI në shqip

## Rregullat për agjentin
- Hapa të vegjël; një ndryshim në një kohë
- Shpjego çdo ndryshim para se ta bësh
- Pyet para se të instalosh paketa
- Mos prek .env*.local apo sekrete
- Commit pas çdo hapi që punon
- Teksti i UI-së në shqip
- Përdor anglisht për emra tabelash, kolonash, funksionesh në kod
- Ndjek Expo SDK 58 docs (jo memorie)
- Përdor `npx expo install` për paketa

## Statusi
- Punon tani: Strukturë demo (artikuj) – do të transformohet në UniBite
- Misioni tjetër: M0 (konfigurim Supabase + lidhje)
