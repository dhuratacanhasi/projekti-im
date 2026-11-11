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
import { useCart } from "@/context/CartContext";
import { useLokacioni } from "@/context/LokacioniContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";
import { dil, useSesioni } from "@/lib/sesioni";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";

export default function Profili() {
  const { perdoruesi } = useSesioni();
  const { eshteVizitor, dilSiVizitor } = useVizitori();
  const { itemCount } = useCart();
  const { qyteti } = useLokacioni();
  const tema = useTema();
  const [restorantet, setRestorantet] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dukeDale, setDukeDale] = useState(false);

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
          setRestorantet(data || []);
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
    Alert.alert("Dil nga llogaria", "A jeni i sigurt që dëshironi të dilni?", [
      { text: "Anulo", style: "cancel" },
      {
        text: "Dil",
        style: "destructive",
        onPress: async () => {
          setDukeDale(true);
          try {
            await dil();
            dilSiVizitor();
          } catch (e) {
            setDukeDale(false);
            Alert.alert("Dalja nuk u krye", (e as Error).message);
          }
        },
      },
    ]);
  }

  // Vizitori nuk ka llogari: i ofrojmë hyrjen.
  if (!perdoruesi) {
    return (
      <View style={[styles.qendra, { backgroundColor: tema.sfond }]}>
        <Text style={styles.figura}>👤</Text>
        <Text style={[styles.paLLogariTitulli, { color: tema.tekst }]}>Nuk jeni i kyçur</Text>
        <Text style={[styles.paLLogariTeksti, { color: tema.tekstDytësor }]}>
          Hyni ose krijoni llogari për të parë profilin dhe restorantet tuaja.
        </Text>
        <TouchableOpacity style={[styles.butoni, { backgroundColor: tema.kryesor }]} onPress={dilSiVizitor}>
          <Text style={styles.butoniTeksti}>Hyr / Krijo llogari</Text>
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
        <Text style={styles.anetari}>Anëtar i UniBite</Text>
        {eshteVizitor ? <Text style={styles.vizitorShenim}>Po shfletoni si vizitor</Text> : null}
      </LinearGradient>

      <View style={styles.statistika}>
        <View style={[styles.statistikaKarta, { backgroundColor: tema.kart }]}>
          <Text style={styles.statistikaFigura}>🛒</Text>
          <Text style={[styles.statistikaVlera, { color: tema.kryesor }]}>{itemCount}</Text>
          <Text style={[styles.statistikaEmri, { color: tema.tekstDytësor }]}>në shportë</Text>
        </View>
        <View style={[styles.statistikaKarta, { backgroundColor: tema.kart }]}>
          <Text style={styles.statistikaFigura}>🏪</Text>
          <Text style={[styles.statistikaVlera, { color: tema.kryesor }]}>{restorantet.length}</Text>
          <Text style={[styles.statistikaEmri, { color: tema.tekstDytësor }]}>restorante</Text>
        </View>
        <View style={[styles.statistikaKarta, { backgroundColor: tema.kart }]}>
          <Text style={styles.statistikaFigura}>📍</Text>
          <Text style={[styles.statistikaVlera, { color: tema.kryesor }]} numberOfLines={1}>
            {qyteti}
          </Text>
          <Text style={[styles.statistikaEmri, { color: tema.tekstDytësor }]}>qyteti</Text>
        </View>
      </View>

      <View style={styles.seksioni}>
        <View style={styles.seksioniKoka}>
          <Text style={[styles.seksioniTitulli, { color: tema.tekst }]}>Restorantet e mia</Text>
          <TouchableOpacity onPress={() => router.push("/add-restaurant")}>
            <Text style={[styles.shtoLink, { color: tema.kryesor }]}>+ Shto</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={tema.kryesor} style={{ marginVertical: 24 }} />
        ) : restorantet.length === 0 ? (
          <View style={[styles.bosh, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
            <Text style={styles.boshFigura}>🍽️</Text>
            <Text style={[styles.boshTitulli, { color: tema.tekst }]}>Nuk keni restorante</Text>
            <Text style={[styles.boshTeksti, { color: tema.tekstDytësor }]}>
              Shtoni restorantin tuaj të parë dhe do të shfaqet këtu.
            </Text>
            <TouchableOpacity
              style={[styles.butoni, styles.butoniVogel, { backgroundColor: tema.kryesor }]}
              onPress={() => router.push("/add-restaurant")}
            >
              <Text style={styles.butoniTeksti}>Shto restorant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          restorantet.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[styles.restorantiRresht, { backgroundColor: tema.kart }]}
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
                  {[r.category, r.city].filter(Boolean).join(" · ") || "Pa kategori"}
                </Text>
              </View>
              <Text style={[styles.shigjeta, { color: tema.kryesor }]}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity
        style={[styles.dalja, { borderColor: "#FCA5A5" }, dukeDale && styles.duke]}
        onPress={dale}
        disabled={dukeDale}
      >
        <Text style={styles.daljaTeksti}>{dukeDale ? "Po dilni…" : "Dil nga llogaria"}</Text>
      </TouchableOpacity>

      <Text style={[styles.versioni, { color: tema.tekstDytësor }]}>UniBite · versioni 1.0.0</Text>
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
    gap: 12,
    shadowColor: "#2E1065",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
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
