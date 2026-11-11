import { SplashScreen, Stack } from "expo-router";

import { ButoniDil } from "@/components/ButoniDil";
import { CartProvider } from "@/context/CartContext";
import { SesioniProvider, useSesioni } from "@/lib/sesioni";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SesioniProvider>
      <CartProvider>
        <Harta />
      </CartProvider>
    </SesioniProvider>
  );
}

const lista = { title: "UniBite", headerRight: () => <ButoniDil /> };

// #region harta
// Pa hyrë: vetëm “hyrja”. I hyrë: ekranet e UniBite. Kur sesioni ndryshon,
// ekrani ndryshon vetë. Roja është vetëm për përdoruesin: të dhënat
// i mbron RLS-i në server.
function Harta() {
  const { perdoruesi, dukeLexuar } = useSesioni();
  if (!dukeLexuar) SplashScreen.hide();

  return (
    // #region roja
    <Stack>
      <Stack.Protected guard={perdoruesi !== null}>
        <Stack.Screen name="index" options={lista} />
        <Stack.Screen name="add-restaurant" options={{ title: "Shto Restorant", presentation: "modal" }} />
        <Stack.Screen name="restaurant/[id]" options={{ title: "Menuja" }} />
        <Stack.Screen name="cart" options={{ title: "Shporta" }} />
      </Stack.Protected>
      <Stack.Protected guard={perdoruesi === null}>
        <Stack.Screen name="hyrja" options={{ title: "Hyrja", headerShown: false }} />
      </Stack.Protected>
    </Stack>
    // #endregion
  );
}
// #endregion
