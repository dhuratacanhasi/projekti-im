import { View } from "react-native";
import { SplashScreen, Stack } from "expo-router";

import { ButoniDil } from "@/components/ButoniDil";
import { ButoniHyr } from "@/components/ButoniHyr";
import { ButoniProfili } from "@/components/ButoniProfili";
import { CartProvider } from "@/context/CartContext";
import { LokacioniProvider } from "@/context/LokacioniContext";
import { useTema } from "@/context/TemaContext";
import { VizitoriProvider, useVizitori } from "@/context/VizitoriContext";
import { SesioniProvider, useSesioni } from "@/lib/sesioni";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SesioniProvider>
      <VizitoriProvider>
        <LokacioniProvider>
          <CartProvider>
            <Harta />
          </CartProvider>
        </LokacioniProvider>
      </VizitoriProvider>
    </SesioniProvider>
  );
}

// #region harta
// Pa llogari: hyrja ose vizitori. Vizitori shfleton me të dhëna demo,
// por porosia dhe shtimi i restorantit kërkojnë llogari.
// Të dhënat e vërteta i mbron RLS-i në server.
function Harta() {
  const { perdoruesi, dukeLexuar } = useSesioni();
  const { eshteVizitor } = useVizitori();
  const tema = useTema();
  if (!dukeLexuar) SplashScreen.hide();

  const iLejuar = perdoruesi !== null || eshteVizitor;

  return (
    // #region roja
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tema.kryesor },
        headerTintColor: tema.butonTekst,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: tema.sfond },
      }}
    >
      <Stack.Protected guard={iLejuar}>
        <Stack.Screen
          name="index"
          options={{
            title: eshteVizitor ? "UniBite · Vizitor" : "UniBite",
            headerRight: () =>
              perdoruesi ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingRight: 4 }}>
                  <ButoniProfili />
                  <ButoniDil />
                </View>
              ) : (
                <ButoniHyr />
              ),
          }}
        />
        <Stack.Screen name="profili" options={{ title: "Profili im" }} />
        <Stack.Screen name="add-restaurant" options={{ title: "Shto Restorant", presentation: "modal" }} />
        <Stack.Screen name="restaurant/[id]" options={{ title: "Menuja" }} />
        <Stack.Screen name="cart" options={{ title: "Shporta" }} />
        <Stack.Screen name="checkout" options={{ title: "Porosia" }} />
      </Stack.Protected>
      <Stack.Protected guard={!iLejuar}>
        <Stack.Screen name="hyrja" options={{ title: "Hyrja", headerShown: false }} />
      </Stack.Protected>
    </Stack>
    // #endregion
  );
}
// #endregion
