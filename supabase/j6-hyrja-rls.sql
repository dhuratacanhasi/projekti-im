-- J6 · UniBite — Hapi A + Hapi C (11.11.2026)
-- Ekzekutohet në Supabase → SQL Editor, pasi të jetë fikur “Confirm email”.
-- Skripti është i përsëritshëm: mund të bëhet Run edhe pas një gabimi.
--
-- Modeli i të dhënave:
--   • Restorantet bazë (12 realët) kanë pronari_id = null dhe formojnë katalogun
--     e përbashkët që shohin të gjithë përdoruesit e kyçur.
--   • Restoranti që shton një përdorues nga telefoni merr pronari_id = auth.uid()
--     dhe shihet vetëm nga ai përdorues.
--   • Aplikacioni NUK e dërgon pronari_id; serveri e vendos vetë me default.

-- #region A · dera mbyllet
-- Fshijmë çdo policy të javës 5 (pavarësisht emrit) nga tabelat e UniBite.
do $$
declare
  p record;
begin
  for p in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('restaurants', 'menu_items')
  loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- anon (pa llogari) nuk ka më qasje në tabela.
revoke all on public.restaurants from anon;
revoke all on public.menu_items from anon;

-- RLS-i duhet të jetë i ndezur që policy-t të kenë efekt.
alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
-- #endregion

-- #region C1 · pronari i rreshtit
-- Kolona mbushet automatikisht me llogarinë që krijon rreshtin.
alter table public.restaurants
  add column if not exists pronari_id uuid default auth.uid()
  references auth.users (id) on delete cascade;

create index if not exists restaurants_pronari_idx
  on public.restaurants (pronari_id);
-- #endregion

-- #region C2 · qasja për përdoruesin e kyçur
grant select, insert, update on public.restaurants to authenticated;
grant select on public.menu_items to authenticated;

-- Lexim: katalogu i përbashkët (pronari_id null) + restorantet e mia.
create policy "lexo katalogun dhe te vetat"
  on public.restaurants for select to authenticated
  using (pronari_id is null or pronari_id = (select auth.uid()));

-- Shtim: vetëm për veten (serveri e mbush pronari_id, klienti s'e dërgon).
create policy "shto vetem per vete"
  on public.restaurants for insert to authenticated
  with check (pronari_id = (select auth.uid()));

-- Ndryshim: vetëm restorantet e mia.
create policy "ndrysho vetem te vetat"
  on public.restaurants for update to authenticated
  using (pronari_id = (select auth.uid()))
  with check (pronari_id = (select auth.uid()));

-- Menutë: vetëm për restorantet që përdoruesi mund t'i shohë.
create policy "lexo menute e restoranteve te dukshme"
  on public.menu_items for select to authenticated
  using (
    exists (
      select 1
      from public.restaurants r
      where r.id = menu_items.restaurant_id
        and (r.pronari_id is null or r.pronari_id = (select auth.uid()))
    )
  );
-- #endregion
