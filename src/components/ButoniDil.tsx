import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

import { dil } from "@/lib/sesioni";

// Butoni “Dil” në krye të listës. Pas daljes roja në _layout.tsx e kthen aplikacionin te hyrja.
export function ButoniDil() {
  const [duke, setDuke] = useState(false);

  async function dalja() {
    setDuke(true);
    try {
      await dil();
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
  teksti: { color: "#FF6B35", fontWeight: "700", fontSize: 16, paddingHorizontal: 8 },
});
