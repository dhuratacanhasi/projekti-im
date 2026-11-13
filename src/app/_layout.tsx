import { View } from "react-native";
import { SplashScreen, Stack } from "expo-router";

import { ButoniDil } from "@/components/ButoniDil";
import { ButoniGjuhes } from "@/components/ButoniGjuhes";
import { ButoniHyr } from "@/components/ButoniHyr";
import { ButoniProfili } from "@/components/ButoniProfili";
import { BesnikeriaProvider } from "@/context/BesnikeriaContext";
import { CartProvider } from "@/context/CartContext";
import { LokacioniProvider } from "@/context/LokacioniContext";
import { PorositeProvider } from "@/context/PorositeContext";
import { useTema } from "@/context/TemaContext";
import { VizitoriProvider, useVizitori } from "@/context/VizitoriContext";
import { GjuhaProvider, useGjuha } from "@/i18n/GjuhaContext";
import { SesioniProvider, useSesioni } from "@/lib/sesioni";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GjuhaProvider>
      <SesioniProvider>
        <VizitoriProvider>
          <LokacioniProvider>
            <BesnikeriaProvider>
              <CartProvider>
                <PorositeProvider>
                  <Harta />
                </PorositeProvider>
              </CartProvider>
            </BesnikeriaProvider>
          </LokacioniProvider>
        </VizitoriProvider>
      </SesioniProvider>
    </GjuhaProvider>
  );
}

// #region harta
// Pa llogari: hyrja ose vizitori. Vizitori shfleton me të dhëna demo,
// por porosia dhe shtimi i restorantit kërkojnë llogari.
// Të dhënat e vërteta i mbron RLS-i në server.
function Harta() {
  const { perdoruesi, dukeLexuar } = useSesioni();
  const { eshteVizitor } = useVizitori();
  const { t } = useGjuha();
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
            title: eshteVizitor ? t("UniBite · Vizitor") : "UniBite",
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingRight: 4 }}>
                <ButoniGjuhes />
                {perdoruesi ? (
                  <>
                    <ButoniProfili />
                    <ButoniDil />
                  </>
                ) : (
                  <ButoniHyr />
                )}
              </View>
            ),
          }}
        />
        <Stack.Screen name="profili" options={{ title: t("Profili im") }} />
        <Stack.Screen
          name="add-restaurant"
          options={{ title: t("Shto Restorant"), presentation: "modal" }}
        />
        <Stack.Screen name="restaurant/[id]" options={{ title: t("Menuja") }} />
        <Stack.Screen name="cart" options={{ title: t("Shporta") }} />
        <Stack.Screen name="checkout" options={{ title: t("Porosia") }} />
        <Stack.Screen name="shperblimet" options={{ title: t("Shpërblimet") }} />
        <Stack.Screen name="porosite" options={{ title: t("Porositë e mia") }} />
      </Stack.Protected>
      <Stack.Protected guard={!iLejuar}>
        <Stack.Screen name="hyrja" options={{ title: t("Hyrja"), headerShown: false }} />
      </Stack.Protected>
    </Stack>
    // #endregion
  );
}
// #endregion
