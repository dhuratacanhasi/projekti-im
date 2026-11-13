import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useGjuha } from "@/i18n/GjuhaContext";

const ikona = require("../../assets/images/nav/translation.png");

// Butoni i gjuhës në krye të ekranit: trokitje e shpejtë SQ ⇄ EN.
export function ButoniGjuhes() {
  const { gjuha, ndrysho, t } = useGjuha();

  return (
    <Pressable
      onPress={ndrysho}
      style={styles.butoni}
      accessibilityRole="button"
      accessibilityLabel={t("Ndrysho gjuhën")}
      hitSlop={8}
    >
      <Image source={ikona} style={styles.ikona} resizeMode="contain" />
      <Text style={styles.teksti}>{gjuha === "sq" ? "SQ" : "EN"}</Text>
    </Pressable>
  );
}

// Zgjedhësi i plotë për faqen e profilit: Shqip / English.
export function ZgjedhesiGjuhes() {
  const { gjuha, ndryshoGjuhen, t } = useGjuha();

  return (
    <View style={styles.karta}>
      <View style={styles.kartaKoka}>
        <Image source={ikona} style={styles.kartaIkona} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.kartaTitulli}>{t("Gjuha")}</Text>
          <Text style={styles.kartaNentitulli}>Shqip / English</Text>
        </View>
      </View>

      <View style={styles.zgjedhesi}>
        {(
          [
            { kodi: "sq" as const, emri: "Shqip" },
            { kodi: "en" as const, emri: "English" },
          ]
        ).map((opsion) => {
          const zgjedhur = gjuha === opsion.kodi;
          return (
            <TouchableOpacity
              key={opsion.kodi}
              style={[styles.opsioni, zgjedhur && styles.opsioniZgjedhur]}
              onPress={() => ndryshoGjuhen(opsion.kodi)}
              activeOpacity={0.85}
            >
              <Text style={[styles.opsioniTeksti, zgjedhur && styles.opsioniTekstiZgjedhur]}>
                {opsion.emri}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  butoni: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  ikona: {
    width: 16,
    height: 16,
    tintColor: "#ffffff",
  },
  teksti: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },
  karta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDD6FE",
    padding: 14,
    gap: 10,
  },
  kartaKoka: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  kartaIkona: {
    width: 24,
    height: 24,
    tintColor: "#7C3AED",
  },
  kartaTitulli: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2E1065",
  },
  kartaNentitulli: {
    fontSize: 12,
    color: "#6D28D9",
    marginTop: 1,
  },
  zgjedhesi: {
    flexDirection: "row",
    gap: 8,
  },
  opsioni: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#DDD6FE",
    paddingVertical: 9,
    alignItems: "center",
  },
  opsioniZgjedhur: {
    borderColor: "#7C3AED",
    backgroundColor: "#EDE9FE",
  },
  opsioniTeksti: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6D28D9",
  },
  opsioniTekstiZgjedhur: {
    color: "#5B21B6",
  },
});
