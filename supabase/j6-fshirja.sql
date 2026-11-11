-- J6 · UniBite — Fshirja e restoranteve të vetë
-- Ekzekutohet në Supabase → SQL Editor, pas j6-hyrja-rls.sql.
--
-- RËNDËSISHME: disa versione të SQL Editor lejojnë vetëm NJË deklaratë për
-- çdo "Run" (gabimi: "Only singular query allowed"). Në atë rast, ekzekuto
-- secilën deklaratë veç, një nga një, nga lart poshtë.

-- 1) Leja për DELETE në restorante.
grant delete on public.restaurants to authenticated;

-- 2) Leja për DELETE në menu.
grant delete on public.menu_items to authenticated;

-- 3) Hiq politikën e vjetër të fshirjes (nëse ekziston).
drop policy if exists "fshi vetem restorantet e mia" on public.restaurants;

-- 4) Krijo politikën: fshi vetëm restorantet e mia.
create policy "fshi vetem restorantet e mia"
  on public.restaurants for delete to authenticated
  using (pronari_id = (select auth.uid()));

-- 5) Hiq politikën e vjetër të menusë.
drop policy if exists "fshi menute e restoranteve te mia" on public.menu_items;

-- 6) Krijo politikën e menusë.
create policy "fshi menute e restoranteve te mia"
  on public.menu_items for delete to authenticated
  using (
    exists (
      select 1
      from public.restaurants r
      where r.id = menu_items.restaurant_id
        and r.pronari_id = (select auth.uid())
    )
  );
