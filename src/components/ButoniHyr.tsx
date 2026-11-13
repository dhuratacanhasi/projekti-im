import { Pressable, StyleSheet, Text } from "react-native";

import { useVizitori } from "@/context/VizitoriContext";
import { useGjuha } from "@/i18n/GjuhaContext";

// Butoni “Hyr” në krye të listës kur përdoruesi është vizitor.
export function ButoniHyr() {
  const { dilSiVizitor } = useVizitori();
  const { t } = useGjuha();

  return (
    <Pressable onPress={dilSiVizitor} accessibilityRole="button" hitSlop={8}>
      <Text style={styles.teksti}>{t("Hyr")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  teksti: { color: "#ffffff", fontWeight: "700", fontSize: 16, paddingHorizontal: 8 },
});
