import { Pressable, StyleSheet, Text } from "react-native";

import { useVizitori } from "@/context/VizitoriContext";

// Butoni “Hyr” në krye të listës kur përdoruesi është vizitor.
export function ButoniHyr() {
  const { dilSiVizitor } = useVizitori();

  return (
    <Pressable onPress={dilSiVizitor} accessibilityRole="button" hitSlop={8}>
      <Text style={styles.teksti}>Hyr</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  teksti: { color: "#ffffff", fontWeight: "700", fontSize: 16, paddingHorizontal: 8 },
});
