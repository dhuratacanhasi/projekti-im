import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { ZgjedhesiGjuhes } from "@/components/ButoniGjuhes";
import { PRAGU_KUPONIT, useBesnikeria } from "@/context/BesnikeriaContext";
import { useCart } from "@/context/CartContext";
import { QYTETET, useLokacioni } from "@/context/LokacioniContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";
import { useGjuha } from "@/i18n/GjuhaContext";
import { plotesoRestorantin } from "@/lib/katalogu";
import { dil, useSesioni } from "@/lib/sesioni";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";

export default function Profili() {
  const { perdoruesi } = useSesioni();
  const { eshteVizitor, dilSiVizitor } = useVizitori();
  const { itemCount } = useCart();
  const { porosite, progresi, kuponat } = useBesnikeria();
  const { qytetiLlogarise, ndryshoQytetinLlogarise } = useLokacioni();
  const tema = useTema();
  const { t } = useGjuha();
  const [restorantet, setRestorantet] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dukeDale, setDukeDale] = useState(false);
  const [dukeFshire, setDukeFshire] = useState<string | null>(null);

  const iniciali = (perdoruesi?.email ?? "?").charAt(0).toUpperCase();

  useFocusEffect(
    useCallback(() => {
      let aktiv = true;

      async function lexoRestorantet() {
        if (!perdoruesi) {
          setRestorantet([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        const { data } = await supabase
          .from("restaurants")
          .select("*")
          .eq("pronari_id", perdoruesi.id)
          .order("created_at", { ascending: false });

        if (aktiv) {
          setRestorantet((data || []).map(plotesoRestorantin));
          setLoading(false);
        }
      }

      lexoRestorantet();
      return () => {
        aktiv = false;
      };
    }, [perdoruesi])
  );

  async function dale() {
    Alert.alert(t("Dil nga llogaria"), t("A jeni i sigurt që dëshironi të dilni?"), [
      { text: t("Anulo"), style: "cancel" },
      {
        text: t("Dil"),
        style: "destructive",
        onPress: async () => {
          setDukeDale(true);
          try {
            await dil();
            dilSiVizitor();
          } catch (e) {
            setDukeDale(false);
            Alert.alert(t("Dalja nuk u krye"), (e as Error).message);
          }
        },
      },
    ]);
  }

  function fshiRestorantin(r: Restaurant) {
    if (!perdoruesi) return;
    const emri = r.name_sq || r.name;

    Alert.alert(
      t("Fshi restorantin"),
      t('A jeni i sigurt që dëshironi të fshini "{emri}"? Ky veprim nuk kthehet.', { emri }),
      [
        { text: t("Anulo"), style: "cancel" },
        {
          text: t("Fshi"),
          style: "destructive",
          onPress: async () => {
            setDukeFshire(r.id);
            try {
              // Fshijmë më parë artikujt e menusë, pastaj restorantin.
              await supabase.from("menu_items").delete().eq("restaurant_id", r.id);
              const { error } = await supabase
                .from("restaurants")
                .delete()
                .eq("id", r.id)
                .eq("pronari_id", perdoruesi.id);

              if (error) {
                Alert.alert(
                  t("Nuk u fshi"),
                  `${error.message}${t("\n\nPër të lejuar fshirjen, ekzekuto skedarin supabase/j6-fshirja.sql në Supabase → SQL Editor.")}`
                );
                return;
              }

              setRestorantet((lista) => lista.filter((x) => x.id !== r.id));
            } catch (e) {
              Alert.alert(t("Gabim"), (e as Error).message);
            } finally {
              setDukeFshire(null);
            }
          },
        },
      ]
    );
  }

  // Vizitori nuk ka llogari: i ofrojmë hyrjen.
  if (!perdoruesi) {
    return (
      <View style={[styles.qendra, { backgroundColor: tema.sfond }]}>
        <Text style={styles.figura}>👤</Text>
        <Text style={[styles.paLLogariTitulli, { color: tema.tekst }]}>{t("Nuk jeni i kyçur")}</Text>
        <Text style={[styles.paLLogariTeksti, { color: tema.tekstDytësor }]}>
          {t("Hyni ose krijoni llogari për të parë profilin dhe restorantet tuaja.")}
        </Text>
        <TouchableOpacity style={[styles.butoni, { backgroundColor: tema.kryesor }]} onPress={dilSiVizitor}>
          <Text style={styles.butoniTeksti}>{t("Hyr / Krijo llogari")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: tema.sfond }}
      contentContainerStyle={styles.percaktimi}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#7C3AED", "#5B21B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.koka}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarTeksti}>{iniciali}</Text>
        </View>
        <Text style={styles.email}>{perdoruesi.email}</Text>
        <Text style={styles.anetari}>{t("Anëtar i UniBite")}</Text>
        {eshteVizitor ? <Text style={styles.vizitorShenim}>{t("Po shfletoni si vizitor")}</Text> : null}
      </LinearGradient>

      <View style={styles.statistika}>
        <View style={[styles.statistikaKarta, { backgroundColor: tema.kart }]}>
          <Text style={styles.statistikaFigura}>🛒</Text>
          <Text style={[styles.statistikaVlera, { color: tema.kryesor }]}>{itemCount}</Text>
          <Text style={[styles.statistikaEmri, { color: tema.tekstDytësor }]}>{t("në shportë")}</Text>
        </View>
        <View style={[styles.statistikaKarta, { backgroundColor: tema.kart }]}>
          <Text style={styles.statistikaFigura}>🏪</Text>
          <Text style={[styles.statistikaVlera, { color: tema.kryesor }]}>{restorantet.length}</Text>
          <Text style={[styles.statistikaEmri, { color: tema.tekstDytësor }]}>{t("restorante")}</Text>
        </View>
        <View style={[styles.statistikaKarta, { backgroundColor: tema.kart }]}>
          <Text style={styles.statistikaFigura}>📍</Text>
          <Text style={[styles.statistikaVlera, { color: tema.kryesor }]} numberOfLines={1}>
            {qytetiLlogarise}
          </Text>
          <Text style={[styles.statistikaEmri, { color: tema.tekstDytësor }]}>
            {t("qyteti i llogarisë")}
          </Text>
        </View>
      </View>

      <View style={styles.seksioni}>
        <View style={styles.seksioniKoka}>
          <Text style={[styles.seksioniTitulli, { color: tema.tekst }]}>
            {t("Lokacioni i llogarisë")}
          </Text>
          <Text style={[styles.shtoLink, { color: tema.kryesor }]}>📍</Text>
        </View>
        <Text style={[styles.lokacioniShenim, { color: tema.tekstDytësor }]}>
          {t(
            "Ky qytet ruhet me llogarinë tuaj dhe nuk ndryshon kur zgjidhni një qytet tjetër për porosi."
          )}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.qytetetRow}
        >
          {QYTETET.map((q) => {
            const zgjedhur = q === qytetiLlogarise;
            return (
              <TouchableOpacity
                key={q}
                style={[
                  styles.qytetiChip,
                  {
                    borderColor: tema.kryesor,
                    backgroundColor: zgjedhur ? tema.kryesor : tema.kart,
                  },
                ]}
                onPress={() => ndryshoQytetinLlogarise(q)}
                accessibilityLabel={t("Zgjidh qytetin e llogarisë: {qyteti}", { qyteti: q })}
              >
                <Text
                  style={{
                    color: zgjedhur ? tema.butonTekst : tema.kryesor,
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {q}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.seksioni}>
        <View style={styles.seksioniKoka}>
          <Text style={[styles.seksioniTitulli, { color: tema.tekst }]}>{t("Besnikëria UniBite")}</Text>
          <Text style={[styles.shtoLink, { color: tema.kryesor }]}>🎟️</Text>
        </View>

        <View style={[styles.besnikKarta, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
          <View style={styles.besnikRresht}>
            <Text style={[styles.besnikNumri, { color: tema.kryesor }]}>{porosite}</Text>
            <Text style={[styles.besnikTeksti, { color: tema.tekstDytësor }]}>
              {t("porosi të përfunduara")}
            </Text>
          </View>

          {kuponat.filter((k) => !k.perdorur).length > 0 ? (
            <View style={styles.kuponRresht}>
              <Text style={styles.kuponIkona}>🎟️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.kuponTitulli, { color: tema.tekst }]}>
                  {t("{n} kuponë aktivë −10%", { n: kuponat.filter((k) => !k.perdorur).length })}
                </Text>
                <Text style={[styles.kuponKodi, { color: tema.tekstDytësor }]}>
                  {kuponat
                    .filter((k) => !k.perdorur)
                    .map((k) => k.kodi)
                    .join(" · ")}
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={[styles.kuponKodi, { color: tema.tekstDytësor }]}>
                {t("{progresi}/{pragu} porosi drejt kuponit të radhës −10%", {
                  progresi,
                  pragu: PRAGU_KUPONIT,
                })}
              </Text>
              <View style={[styles.progresShirit, { backgroundColor: tema.kryesorSfond }]}>
                <View
                  style={[
                    styles.progresMbushe,
                    {
                      width: `${(progresi / PRAGU_KUPONIT) * 100}%`,
                      backgroundColor: tema.kryesor,
                    },
                  ]}
                />
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.seksioni}>
        <View style={styles.seksioniKoka}>
          <Text style={[styles.seksioniTitulli, { color: tema.tekst }]}>{t("Restorantet e mia")}</Text>
          <TouchableOpacity onPress={() => router.push("/add-restaurant")}>
            <Text style={[styles.shtoLink, { color: tema.kryesor }]}>{t("+ Shto")}</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={tema.kryesor} style={{ marginVertical: 24 }} />
        ) : restorantet.length === 0 ? (
          <View style={[styles.bosh, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
            <Text style={styles.boshFigura}>🍽️</Text>
            <Text style={[styles.boshTitulli, { color: tema.tekst }]}>{t("Nuk keni restorante")}</Text>
            <Text style={[styles.boshTeksti, { color: tema.tekstDytësor }]}>
              {t("Shtoni restorantin tuaj të parë dhe do të shfaqet këtu.")}
            </Text>
            <TouchableOpacity
              style={[styles.butoni, styles.butoniVogel, { backgroundColor: tema.kryesor }]}
              onPress={() => router.push("/add-restaurant")}
            >
              <Text style={styles.butoniTeksti}>{t("Shto restorant")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          restorantet.map((r) => (
            <View key={r.id} style={[styles.restorantiRresht, { backgroundColor: tema.kart }]}>
              <TouchableOpacity
                style={styles.restorantiMaja}
                onPress={() => router.push(`/restaurant/${r.id}`)}
                activeOpacity={0.85}
              >
                {r.image_url ? (
                  <Image source={{ uri: r.image_url }} style={styles.restorantiFoto} resizeMode="cover" />
                ) : (
                  <View style={[styles.restorantiFoto, styles.restorantiFotoBosh]}>
                    <Text style={{ fontSize: 22 }}>🍽️</Text>
                  </View>
                )}
                <View style={styles.restorantiTeksti}>
                  <Text style={[styles.restorantiEmri, { color: tema.tekst }]} numberOfLines={1}>
                    {r.name_sq || r.name}
                  </Text>
                  <Text style={[styles.restorantiMeta, { color: tema.tekstDytësor }]} numberOfLines={1}>
                    {[r.category, r.city].filter(Boolean).join(" · ") || t("Pa kategori")}
                  </Text>
                </View>
                <Text style={[styles.shigjeta, { color: tema.kryesor }]}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fshiButoni}
                onPress={() => fshiRestorantin(r)}
                disabled={dukeFshire === r.id}
                accessibilityLabel={t("Fshi restorantin")}
              >
                <Text style={styles.fshiIkona}>{dukeFshire === r.id ? "…" : "🗑️"}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.seksioni}>
        <ZgjedhesiGjuhes />
      </View>

      <TouchableOpacity
        style={[styles.dalja, { borderColor: "#FCA5A5" }, dukeDale && styles.duke]}
        onPress={dale}
        disabled={dukeDale}
      >
        <Text style={styles.daljaTeksti}>{dukeDale ? t("Po dilni…") : t("Dil nga llogaria")}</Text>
      </TouchableOpacity>

      <Text style={[styles.versioni, { color: tema.tekstDytësor }]}>{t("UniBite · versioni 1.0.0")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  qendra: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
  },
  figura: {
    fontSize: 54,
    marginBottom: 10,
  },
  paLLogariTitulli: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  paLLogariTeksti: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  percaktimi: {
    paddingBottom: 36,
  },
  koka: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarTeksti: {
    fontSize: 38,
    fontWeight: "800",
    color: "#ffffff",
  },
  email: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
  },
  anetari: {
    fontSize: 13,
    color: "#DDD6FE",
    marginTop: 3,
  },
  vizitorShenim: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#2E1065",
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statistika: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: -22,
  },
  statistikaKarta: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "#2E1065",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statistikaFigura: {
    fontSize: 18,
  },
  statistikaVlera: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  statistikaEmri: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 1,
  },
  seksioni: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 10,
  },
  seksioniKoka: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seksioniTitulli: {
    fontSize: 18,
    fontWeight: "800",
  },
  shtoLink: {
    fontSize: 14,
    fontWeight: "700",
  },
  lokacioniShenim: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: -4,
  },
  qytetetRow: {
    gap: 8,
    paddingVertical: 4,
    paddingRight: 8,
  },
  qytetiChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bosh: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  boshFigura: {
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
  restorantiRresht: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    gap: 6,
    shadowColor: "#2E1065",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  restorantiMaja: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fshiButoni: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
  },
  fshiIkona: {
    fontSize: 18,
  },
  besnikKarta: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  besnikRresht: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  besnikNumri: {
    fontSize: 26,
    fontWeight: "800",
  },
  besnikTeksti: {
    fontSize: 13,
    fontWeight: "600",
  },
  kuponRresht: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    padding: 10,
    marginTop: 2,
  },
  kuponIkona: {
    fontSize: 22,
  },
  kuponTitulli: {
    fontSize: 14,
    fontWeight: "800",
  },
  kuponKodi: {
    fontSize: 12,
    marginTop: 1,
  },
  progresShirit: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 2,
  },
  progresMbushe: {
    height: "100%",
    borderRadius: 999,
  },
  restorantiFoto: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
  },
  restorantiFotoBosh: {
    alignItems: "center",
    justifyContent: "center",
  },
  restorantiTeksti: {
    flex: 1,
    gap: 2,
  },
  restorantiEmri: {
    fontSize: 15,
    fontWeight: "700",
  },
  restorantiMeta: {
    fontSize: 12,
  },
  shigjeta: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 4,
  },
  butoni: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  butoniVogel: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 6,
  },
  butoniTeksti: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  dalja: {
    marginHorizontal: 16,
    marginTop: 28,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  daljaTeksti: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "700",
  },
  duke: {
    opacity: 0.6,
  },
  versioni: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 18,
  },
});
