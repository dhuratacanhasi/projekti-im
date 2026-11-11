import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

import { useVizitori } from "@/context/VizitoriContext";
import { dil } from "@/lib/sesioni";

// Butoni “Dil” në krye të listës. Pas daljes roja në _layout.tsx e kthen aplikacionin te hyrja.
export function ButoniDil() {
  const [duke, setDuke] = useState(false);
  const { dilSiVizitor } = useVizitori();

  async function dalja() {
    setDuke(true);
    try {
      await dil();
      dilSiVizitor();
    } catch (e) {
      setDuke(false);
      Alert.alert("Dalja nuk u krye", (e as Error).message);
    }
  }

  return (
    <Pressable onPress={dalja} disabled={duke} accessibilityRole="button" hitSlop={8}>
      <Text style={styles.teksti}>{duke ? "…" : "Dil"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  teksti: { color: "#ffffff", fontWeight: "700", fontSize: 16, paddingHorizontal: 8 },
});
