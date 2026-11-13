import { Pressable, StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import { useGjuha } from "@/i18n/GjuhaContext";
import { useSesioni } from "@/lib/sesioni";

// Rrethi me inicialin e llogarisë në krye të listës; hap profilin.
export function ButoniProfili() {
  const { perdoruesi } = useSesioni();
  const { t } = useGjuha();
  const iniciali = (perdoruesi?.email ?? "?").charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={() => router.push("/profili")}
      accessibilityRole="button"
      accessibilityLabel={t("Profili im")}
      hitSlop={8}
      style={styles.rrethi}
    >
      <Text style={styles.teksti}>{iniciali}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rrethi: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  teksti: { color: "#ffffff", fontWeight: "800", fontSize: 14 },
});
