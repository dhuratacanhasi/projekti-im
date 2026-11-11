-- J6 · UniBite — Fshirja e restoranteve të vetë
-- Ekzekutohet në Supabase → SQL Editor, pas j6-hyrja-rls.sql.
-- Skripti është i përsëritshëm: mund të bëhet Run edhe pas një gabimi.
--
-- Rregulli: përdoruesi i kyçur mund të fshijë vetëm restorantin që ka
-- pronari_id = auth.uid(), bashkë me artikujt e menusë së tij.

-- #region 1 · leja për DELETE
grant delete on public.restaurants to authenticated;
grant delete on public.menu_items to authenticated;
-- #endregion

-- #region 2 · politikat e fshirjes
drop policy if exists "fshi vetem restorantet e mia" on public.restaurants;
create policy "fshi vetem restorantet e mia"
  on public.restaurants for delete to authenticated
  using (pronari_id = (select auth.uid()));

drop policy if exists "fshi menute e restoranteve te mia" on public.menu_items;
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
-- #endregion
