import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ShiritiPoshtem } from "@/components/ShiritiPoshtem";
import { PRAGU_KUPONIT, useBesnikeria } from "@/context/BesnikeriaContext";
import { useTema } from "@/context/TemaContext";

export default function Shperblimet() {
  const { porosite, progresi, kuponat } = useBesnikeria();
  const tema = useTema();

  const aktivet = kuponat.filter((k) => !k.perdorur);
  const tePerdorur = kuponat.filter((k) => k.perdorur);
  const mbetura = PRAGU_KUPONIT - progresi;

  return (
    <View style={[styles.faqja, { backgroundColor: tema.sfond }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.permbajtja} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#7C3AED", "#5B21B6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroIkona}>🎁</Text>
          <Text style={styles.heroTitulli}>Shpërblimet UniBite</Text>
          <Text style={styles.heroTeksti}>
            Çdo {PRAGU_KUPONIT} porosi = kupon −10% që aplikohet automatikisht
          </Text>

          <View style={styles.heroShirit}>
            <View
              style={[
                styles.heroMbushe,
                { width: `${(progresi / PRAGU_KUPONIT) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.heroProgres}>
            {porosite} porosi gjithsej · edhe {mbetura} për kuponin e radhës
          </Text>
        </LinearGradient>

        <Text style={[styles.seksioni, { color: tema.tekst }]}>Kuponët e mi</Text>

        {aktivet.length === 0 ? (
          <View style={[styles.bosh, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
            <Text style={styles.boshIkona}>🎟️</Text>
            <Text style={[styles.boshTitulli, { color: tema.tekst }]}>Nuk ke kupon aktiv</Text>
            <Text style={[styles.boshTeksti, { color: tema.tekstDytësor }]}>
              Porosit edhe {mbetura} herë dhe fiton një kupon −10% për porosinë tjetër.
            </Text>
            <TouchableOpacity
              style={[styles.butoni, { backgroundColor: tema.kryesor }]}
              onPress={() => router.navigate("/")}
            >
              <Text style={styles.butoniTeksti}>Porosit tani</Text>
            </TouchableOpacity>
          </View>
        ) : (
          aktivet.map((k) => (
            <View
              key={k.id}
              style={[styles.kupon, { backgroundColor: tema.kart, borderColor: tema.kryesor }]}
            >
              <View style={styles.kuponMaja}>
                <Text style={styles.kuponIkona}>🎟️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.kuponTitulli, { color: tema.tekst }]}>
                    Kupon −{k.zbritje}%
                  </Text>
                  <Text style={[styles.kuponKodi, { color: tema.tekstDytësor }]}>
                    Kodi: {k.kodi}
                  </Text>
                </View>
                <View style={styles.aktivBadge}>
                  <Text style={styles.aktivBadgeTeksti}>AKTIV</Text>
                </View>
              </View>

              <Text style={[styles.kuponShenim, { color: tema.kryesor }]}>
                Aplikohet automatikisht kur të porosisësh.
              </Text>

              <TouchableOpacity
                style={[styles.kuponButoni, { backgroundColor: tema.kryesor }]}
                onPress={() => router.navigate("/")}
              >
                <Text style={styles.kuponButoniTeksti}>Përdore tani</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={[styles.seksioni, { color: tema.tekst }]}>Si funksionon?</Text>
        <View style={[styles.udhezues, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
          {[
            ["1", "Porosit ushqim nga UniBite."],
            ["2", `Çdo ${PRAGU_KUPONIT} porosi fiton një kupon −10%.`],
            ["3", "Kuponi aplikohet vetë në porosinë tjetër."],
          ].map(([numri, teksti]) => (
            <View key={numri} style={styles.hapi}>
              <View style={[styles.hapiNumri, { backgroundColor: tema.kryesorSfond }]}>
                <Text style={[styles.hapiNumriTeksti, { color: tema.kryesor }]}>{numri}</Text>
              </View>
              <Text style={[styles.hapiTeksti, { color: tema.tekstDytësor }]}>{teksti}</Text>
            </View>
          ))}
        </View>

        {tePerdorur.length > 0 ? (
          <>
            <Text style={[styles.seksioni, { color: tema.tekst }]}>Kuponë të përdorur</Text>
            {tePerdorur.map((k) => (
              <View
                key={k.id}
                style={[
                  styles.kuponPerdorur,
                  { backgroundColor: tema.kart, borderColor: tema.kufi },
                ]}
              >
                <Text style={styles.kuponIkona}>🎟️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.kuponTitulli, { color: tema.tekstDytësor }]}>
                    Kupon −{k.zbritje}%
                  </Text>
                  <Text style={[styles.kuponKodi, { color: tema.tekstDytësor }]}>
                    Kodi: {k.kodi}
                  </Text>
                </View>
                <Text style={[styles.perdorur, { color: tema.tekstDytësor }]}>Përdorur</Text>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>

      <ShiritiPoshtem />
    </View>
  );
}

const styles = StyleSheet.create({
  faqja: {
    flex: 1,
  },
  permbajtja: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
  },
  hero: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 6,
  },
  heroIkona: {
    fontSize: 34,
  },
  heroTitulli: {
    fontSize: 23,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 4,
  },
  heroTeksti: {
    fontSize: 13,
    color: "#EDE9FE",
    marginTop: 3,
    lineHeight: 18,
  },
  heroShirit: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
    marginTop: 14,
  },
  heroMbushe: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FBBF24",
  },
  heroProgres: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DDD6FE",
    marginTop: 8,
  },
  seksioni: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 2,
  },
  bosh: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  boshIkona: {
    fontSize: 34,
  },
  boshTitulli: {
    fontSize: 16,
    fontWeight: "800",
  },
  boshTeksti: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  butoni: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
  },
  butoniTeksti: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  kupon: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    gap: 8,
  },
  kuponMaja: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  kuponIkona: {
    fontSize: 24,
  },
  kuponTitulli: {
    fontSize: 16,
    fontWeight: "800",
  },
  kuponKodi: {
    fontSize: 12,
    marginTop: 1,
  },
  aktivBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  aktivBadgeTeksti: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "800",
  },
  kuponShenim: {
    fontSize: 12,
    fontWeight: "600",
  },
  kuponButoni: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  kuponButoniTeksti: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  udhezues: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  hapi: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hapiNumri: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  hapiNumriTeksti: {
    fontSize: 13,
    fontWeight: "800",
  },
  hapiTeksti: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  kuponPerdorur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    opacity: 0.7,
  },
  perdorur: {
    fontSize: 11,
    fontWeight: "700",
  },
});
