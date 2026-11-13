import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { ShiritiPoshtem } from "@/components/ShiritiPoshtem";
import { useCart } from "@/context/CartContext";
import {
  HAPAT,
  Porosi,
  indeksiStatusit,
  statusiPorosise,
  usePorosite,
} from "@/context/PorositeContext";
import { useTema } from "@/context/TemaContext";

// Ndjekja e porosive: statusi përparon me kohë (demo), rifreskohet çdo 30 s.
export default function Porosite() {
  const { porosite, pastroHistorikun } = usePorosite();
  const { addToCart } = useCart();
  const tema = useTema();
  const [, setTik] = useState(0);

  useEffect(() => {
    const intervali = setInterval(() => setTik((v) => v + 1), 30000);
    return () => clearInterval(intervali);
  }, []);

  function porositPerseri(porosi: Porosi) {
    porosi.artikuj.forEach((artikull) => {
      addToCart({
        menuItemId: `${porosi.id}-${artikull.emri}`,
        name: artikull.emri,
        price: artikull.cmimi,
        quantity: artikull.sasia,
        restaurantId: porosi.restorantId,
        restaurantName: porosi.restoranti,
      });
    });
    router.navigate("/cart");
  }

  function pastro() {
    Alert.alert(
      "Fshi historikun?",
      "Të gjitha porositë do të hiqen nga ky telefon. Ky veprim nuk kthehet.",
      [
        { text: "Anulo", style: "cancel" },
        { text: "Fshi", style: "destructive", onPress: () => pastroHistorikun() },
      ]
    );
  }

  return (
    <View style={[styles.faqja, { backgroundColor: tema.sfond }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.permbajtja} showsVerticalScrollIndicator={false}>
        {porosite.length === 0 ? (
          <View style={[styles.bosh, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
            <Text style={styles.boshIkona}>📦</Text>
            <Text style={[styles.boshTitulli, { color: tema.tekst }]}>Nuk ke porosi</Text>
            <Text style={[styles.boshTeksti, { color: tema.tekstDytësor }]}>
              Pasi të porosisësh, këtu mund ta ndjekësh porosinë hap pas hapi.
            </Text>
            <TouchableOpacity
              style={[styles.butoni, { backgroundColor: tema.kryesor }]}
              onPress={() => router.navigate("/")}
            >
              <Text style={styles.butoniTeksti}>Shiko restorantet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.koka}>
              <Text style={[styles.titulli, { color: tema.tekst }]}>Porositë e mia</Text>
              <TouchableOpacity onPress={pastro} accessibilityRole="button">
                <Text style={[styles.pastroTeksti, { color: tema.tekstDytësor }]}>Fshi historikun</Text>
              </TouchableOpacity>
            </View>

            {porosite.map((porosi) => {
              const statusi = statusiPorosise(porosi);
              const indeksi = indeksiStatusit(statusi);
              const perfunduar = statusi === "derguar";

              return (
                <View
                  key={porosi.id}
                  style={[styles.karta, { backgroundColor: tema.kart, borderColor: tema.kufi }]}
                >
                  <View style={styles.kartaMaja}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.restoranti, { color: tema.tekst }]} numberOfLines={1}>
                        {porosi.restoranti || "Porosi UniBite"}
                      </Text>
                      <Text style={[styles.meta, { color: tema.tekstDytësor }]}>
                        {porosi.kodi} · {new Date(porosi.krijuar).toLocaleString("sq-AL")}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusiBadge,
                        { backgroundColor: perfunduar ? "#DCFCE7" : tema.kryesorSfond },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusiBadgeTeksti,
                          { color: perfunduar ? "#15803D" : tema.kryesor },
                        ]}
                      >
                        {HAPAT[indeksi].etiketa}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.afati}>
                    {HAPAT.map((hap, i) => {
                      const aktiv = i <= indeksi;
                      const vija = i < HAPAT.length - 1;
                      return (
                        <View key={hap.id} style={styles.hapi}>
                          <View style={styles.hapiMajtas}>
                            <View
                              style={[
                                styles.pika,
                                {
                                  backgroundColor: aktiv ? tema.kryesor : tema.kryesorSfond,
                                  borderColor: aktiv ? tema.kryesor : tema.kufi,
                                },
                              ]}
                            >
                              <Text style={styles.pikaIkona}>{hap.ikona}</Text>
                            </View>
                            {vija ? (
                              <View
                                style={[
                                  styles.vija,
                                  { backgroundColor: i < indeksi ? tema.kryesor : tema.kufi },
                                ]}
                              />
                            ) : null}
                          </View>
                          <View style={styles.hapiDjathtas}>
                            <Text
                              style={[
                                styles.hapiEtiketa,
                                { color: aktiv ? tema.tekst : tema.tekstDytësor },
                              ]}
                            >
                              {hap.etiketa}
                            </Text>
                            <Text style={[styles.hapiMinuta, { color: tema.tekstDytësor }]}>
                              {hap.minuta === 0 ? "Menjëherë" : `pas ${hap.minuta} min`}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  <View style={[styles.ndaresi, { backgroundColor: tema.kufi }]} />

                  {porosi.artikuj.map((artikull, i) => (
                    <View key={`${porosi.id}-${i}`} style={styles.artikulliRresht}>
                      <Text style={[styles.artikulli, { color: tema.tekst }]} numberOfLines={1}>
                        {artikull.sasia}× {artikull.emri}
                      </Text>
                      <Text style={[styles.artikulliCmimi, { color: tema.tekst }]}>
                        €{(artikull.cmimi * artikull.sasia).toFixed(2)}
                      </Text>
                    </View>
                  ))}

                  {porosi.zbritja > 0 ? (
                    <View style={styles.artikulliRresht}>
                      <Text style={[styles.artikulli, { color: "#15803D" }]}>Zbritja e kuponit</Text>
                      <Text style={[styles.artikulliCmimi, { color: "#15803D" }]}>
                        −€{porosi.zbritja.toFixed(2)}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.totaliRresht}>
                    <Text style={[styles.totaliEtiketa, { color: tema.tekst }]}>Totali</Text>
                    <Text style={[styles.totali, { color: tema.kryesor }]}>
                      €{porosi.totaliFundit.toFixed(2)}
                    </Text>
                  </View>

                  <Text style={[styles.adresa, { color: tema.tekstDytësor }]}>
                    📍 {porosi.adresa}, {porosi.qyteti} · ☎ {porosi.telefoni}
                  </Text>
                  <Text style={[styles.adresa, { color: tema.tekstDytësor }]}>
                    💳 {porosi.pagesa}
                  </Text>
                  {porosi.shenime ? (
                    <Text style={[styles.adresa, { color: tema.tekstDytësor }]}>
                      📝 {porosi.shenime}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.porositPerseri, { borderColor: tema.kryesor }]}
                    onPress={() => porositPerseri(porosi)}
                  >
                    <Text style={[styles.porositPerseriTeksti, { color: tema.kryesor }]}>
                      🔁 Porosit përsëri
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}
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
    gap: 12,
  },
  koka: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  titulli: {
    fontSize: 22,
    fontWeight: "800",
  },
  pastroTeksti: {
    fontSize: 12,
    fontWeight: "700",
  },
  bosh: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 6,
    marginTop: 40,
  },
  boshIkona: {
    fontSize: 40,
  },
  boshTitulli: {
    fontSize: 17,
    fontWeight: "800",
  },
  boshTeksti: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  butoni: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
  },
  butoniTeksti: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  karta: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  kartaMaja: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  restoranti: {
    fontSize: 17,
    fontWeight: "800",
  },
  meta: {
    fontSize: 11,
    marginTop: 2,
  },
  statusiBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusiBadgeTeksti: {
    fontSize: 10,
    fontWeight: "800",
  },
  afati: {
    marginTop: 8,
  },
  hapi: {
    flexDirection: "row",
    gap: 10,
  },
  hapiMajtas: {
    alignItems: "center",
    width: 30,
  },
  pika: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  pikaIkona: {
    fontSize: 13,
  },
  vija: {
    width: 2,
    flex: 1,
    minHeight: 14,
  },
  hapiDjathtas: {
    flex: 1,
    paddingBottom: 8,
  },
  hapiEtiketa: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  hapiMinuta: {
    fontSize: 11,
    marginTop: 1,
  },
  ndaresi: {
    height: 1,
    marginVertical: 6,
  },
  artikulliRresht: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  artikulli: {
    flex: 1,
    fontSize: 13,
  },
  artikulliCmimi: {
    fontSize: 13,
  },
  totaliRresht: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  totaliEtiketa: {
    fontSize: 15,
    fontWeight: "800",
  },
  totali: {
    fontSize: 17,
    fontWeight: "800",
  },
  adresa: {
    fontSize: 12,
    marginTop: 2,
  },
  porositPerseri: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  porositPerseriTeksti: {
    fontSize: 14,
    fontWeight: "700",
  },
});
