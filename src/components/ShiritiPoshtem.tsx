import { Href, router, usePathname } from "expo-router";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useBesnikeria } from "@/context/BesnikeriaContext";
import { statusiPorosise, usePorosite } from "@/context/PorositeContext";
import { useTema } from "@/context/TemaContext";

const TABS: { emri: string; ikona: string; rruga: string }[] = [
  { emri: "Restorantet", ikona: "🏠", rruga: "/" },
  { emri: "Shpërblimet", ikona: "🎁", rruga: "/shperblimet" },
  { emri: "Porositë", ikona: "📦", rruga: "/porosite" },
];

// Shiriti i poshtëm me tre faqet kryesore: restorantet, shpërblimet, porositë.
export function ShiritiPoshtem() {
  const rruga = usePathname();
  const tema = useTema();
  const { kuponat } = useBesnikeria();
  const { porosite } = usePorosite();

  const kuponatAktiv = kuponat.filter((k) => !k.perdorur).length;
  const porositeAktive = porosite.filter((p) => statusiPorosise(p) !== "derguar").length;

  return (
    <View
      style={[
        styles.shiriti,
        {
          backgroundColor: tema.kart,
          borderTopColor: tema.kufi,
          paddingBottom: Platform.OS === "ios" ? 24 : 10,
        },
      ]}
    >
      {TABS.map((tab) => {
        const aktiv = tab.rruga === "/" ? rruga === "/" : rruga.startsWith(tab.rruga);
        const shenja =
          tab.rruga === "/shperblimet"
            ? kuponatAktiv
            : tab.rruga === "/porosite"
              ? porositeAktive
              : 0;

        return (
          <TouchableOpacity
            key={tab.rruga}
            style={styles.butoni}
            onPress={() => router.navigate(tab.rruga as Href)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={tab.emri}
          >
            <View>
              <Text style={[styles.ikona, { opacity: aktiv ? 1 : 0.55 }]}>{tab.ikona}</Text>
              {shenja > 0 ? (
                <View style={styles.shenja}>
                  <Text style={styles.shenjaTeksti}>{shenja}</Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[
                styles.etiketa,
                {
                  color: aktiv ? tema.kryesor : tema.tekstDytësor,
                  fontWeight: aktiv ? "800" : "600",
                },
              ]}
            >
              {tab.emri}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shiriti: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 10,
    shadowColor: "#2E1065",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  butoni: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: 4,
  },
  ikona: {
    fontSize: 20,
  },
  etiketa: {
    fontSize: 11,
  },
  shenja: {
    position: "absolute",
    top: -5,
    right: -10,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 3,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  shenjaTeksti: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "800",
  },
});
