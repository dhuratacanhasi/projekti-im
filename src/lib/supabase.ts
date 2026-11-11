// Klienti Supabase, sipas udhëzuesit zyrtar për Expo (supabase.com/docs, “Use Supabase with Expo React Native”).
// #region klienti
import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

import "expo-sqlite/localStorage/install";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const celesi = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, celesi, {
  auth: {
    // Web-i parapërgatitet në Node, ku s'ka localStorage.
    storage: typeof localStorage === "undefined" ? undefined : localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
// #endregion

// TODO 5 (hapi B): token-i të rifreskohet vetëm kur aplikacioni është në ekran (AppState),
// si në udhëzuesin zyrtar të Supabase Auth për React Native.
// #region appstate
AppState.addEventListener("change", (gjendja) => {
  if (gjendja === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
// #endregion
