import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { OFERTAT, diteShqip, ofertaAktive } from "@/data/ofertat";
import { useGjuha } from "@/i18n/GjuhaContext";

// Seksioni "Ofertat e javës" në krye të listës.
export function OfertatJaves() {
  const { t, gjuha } = useGjuha();

  return (
    <View style={styles.seksioni}>
      <View style={styles.koka}>
        <Text style={styles.titulli}>{t("Ofertat e javës")}</Text>
        <Text style={styles.nentitulli}>{t("Combo dhe zbritje sipas ditës e orarit")}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rreshti}
      >
        {OFERTAT.map((oferta) => {
          const aktive = ofertaAktive(oferta);
          return (
            <Pressable
              key={oferta.id}
              style={styles.karta}
              onPress={() => {
                if (oferta.restorantId) router.push(`/restaurant/${oferta.restorantId}`);
              }}
            >
              <Image source={{ uri: oferta.foto }} style={styles.foto} resizeMode="cover" />
              <LinearGradient
                colors={["transparent", "rgba(46,16,101,0.9)"]}
                style={styles.mbulesa}
              />

              <View style={styles.zbritja}>
                <Text style={styles.zbritjaTeksti}>{oferta.zbritje}</Text>
              </View>

              {aktive ? (
                <View style={styles.aktive}>
                  <Text style={styles.aktiveTeksti}>{t("● Aktive tani")}</Text>
                </View>
              ) : null}

              <View style={styles.teksti}>
                <Text style={styles.titulliKarte} numberOfLines={1}>
                  {t(oferta.titulli)}
                </Text>
                <Text style={styles.pershkrimi} numberOfLines={2}>
                  {t(oferta.pershkrimi)}
                </Text>
                <Text style={styles.orari}>
                  🕒 {diteShqip(oferta.ditet, gjuha)} · {oferta.nga}–{oferta.deri}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  seksioni: {
    marginTop: 18,
    marginBottom: 4,
  },
  koka: {
    marginBottom: 10,
  },
  titulli: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2E1065",
  },
  nentitulli: {
    fontSize: 12,
    color: "#6D28D9",
    marginTop: 1,
  },
  rreshti: {
    gap: 12,
    paddingRight: 8,
  },
  karta: {
    width: 250,
    height: 168,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#EDE9FE",
    justifyContent: "flex-end",
  },
  foto: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mbulesa: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  zbritja: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#F59E0B",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  zbritjaTeksti: {
    color: "#2E1065",
    fontSize: 12,
    fontWeight: "800",
  },
  aktive: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  aktiveTeksti: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "800",
  },
  teksti: {
    padding: 12,
    gap: 2,
  },
  titulliKarte: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
  },
  pershkrimi: {
    fontSize: 11,
    lineHeight: 15,
    color: "#EDE9FE",
  },
  orari: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DDD6FE",
    marginTop: 3,
  },
});
