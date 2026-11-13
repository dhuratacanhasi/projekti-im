import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { ButoniGjuhes } from "@/components/ButoniGjuhes";
import { useVizitori } from "@/context/VizitoriContext";
import { useGjuha } from "@/i18n/GjuhaContext";
import { hyr, krijoLlogari } from "@/lib/sesioni";

// Ekrani i hyrjes. Pas hyrjes nuk ka router.push: roja në _layout.tsx e çon vetë te lista.
export default function Hyrja() {
  const { hyjSiVizitor } = useVizitori();
  const { t } = useGjuha();
  const [email, setEmail] = useState("");
  const [fjalekalimi, setFjalekalimi] = useState("");
  const [mesazhi, setMesazhi] = useState<{ tekst: string; gabim: boolean } | null>(null);
  const [duke, setDuke] = useState(false);

  // #region veprimi
  async function vepro(cili: "hyr" | "krijo") {
    if (!email.trim() || !fjalekalimi) return setMesazhi({ tekst: t("Shkruani email-in dhe fjalëkalimin."), gabim: true });
    setDuke(true);
    setMesazhi(null);
    try {
      if (cili === "hyr") {
        await hyr(email.trim(), fjalekalimi);
      } else if ((await krijoLlogari(email.trim(), fjalekalimi)) === "konfirmo") {
        setMesazhi({ tekst: t("Llogaria u krijua. Hapni email-in, konfirmojeni, pastaj hyni."), gabim: false });
      }
    } catch (e) {
      setMesazhi({ tekst: (e as Error).message, gabim: true });
    } finally {
      setDuke(false);
    }
  }
  // #endregion

  return (
    <LinearGradient colors={["#4C1D95", "#7C3AED", "#A78BFA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ekrani}>
      <View pointerEvents="none" style={[styles.rrethi, styles.rrethiNje]} />
      <View pointerEvents="none" style={[styles.rrethi, styles.rrethiDy]} />

      <View style={styles.gjuha}>
        <ButoniGjuhes />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.permutja} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.marka}>
            <View style={styles.logoja}>
              <Text style={styles.logojaTekst}>U</Text>
            </View>
            <Text style={styles.titulli}>UniBite</Text>
            <Text style={styles.nentitulli}>{t("Ushqimi i kampusit, një porosi larg.")}</Text>
          </View>

          <View style={styles.karta}>
            <Text style={styles.kartaTitulli}>{t("Mirë se vini")}</Text>
            <Text style={styles.kartaNentitulli}>{t("Hyni ose krijoni llogarinë tuaj.")}</Text>

            <TextInput
              style={styles.fusha}
              placeholder={t("Email-i")}
              placeholderTextColor="#8B7AB8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.fusha}
              placeholder={t("Fjalëkalimi")}
              placeholderTextColor="#8B7AB8"
              value={fjalekalimi}
              onChangeText={setFjalekalimi}
              secureTextEntry
              autoComplete="password"
            />

            {mesazhi ? <Text style={mesazhi.gabim ? styles.gabimi : styles.info}>{mesazhi.tekst}</Text> : null}

            <Pressable style={[styles.butoni, duke && styles.duke]} onPress={() => vepro("hyr")} disabled={duke} accessibilityRole="button">
              <Text style={styles.butoniTekst}>{duke ? t("Prisni…") : t("Hyr")}</Text>
            </Pressable>

            <Pressable style={[styles.dytesor, duke && styles.duke]} onPress={() => vepro("krijo")} disabled={duke} accessibilityRole="button">
              <Text style={styles.dytesorTekst}>{t("Krijo llogari")}</Text>
            </Pressable>

            <View style={styles.ndaresi}>
              <View style={styles.vija} />
              <Text style={styles.ose}>{t("ose")}</Text>
              <View style={styles.vija} />
            </View>

            <Pressable style={[styles.vizitor, duke && styles.duke]} onPress={hyjSiVizitor} disabled={duke} accessibilityRole="button">
              <Text style={styles.vizitorTekst}>{t("Vazhdo si vizitor")}</Text>
            </Pressable>
            <Text style={styles.vizitorShpjegim}>
              {t("Shfletoni restorantet pa llogari. Për të porositur, do t'ju kërkohet të hyni.")}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ekrani: { flex: 1 },
  flex: { flex: 1 },
  gjuha: { position: "absolute", top: 54, right: 18, zIndex: 10 },
  rrethi: { position: "absolute", borderRadius: 999, backgroundColor: "#ffffff" },
  rrethiNje: { width: 260, height: 260, top: -80, right: -70, opacity: 0.1 },
  rrethiDy: { width: 180, height: 180, bottom: 40, left: -60, opacity: 0.08 },
  permutja: { flexGrow: 1, justifyContent: "center", padding: 22, paddingTop: 70, paddingBottom: 40, gap: 26 },
  marka: { alignItems: "center", gap: 8 },
  logoja: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  logojaTekst: { color: "#ffffff", fontSize: 44, fontWeight: "800", lineHeight: 52 },
  titulli: { fontSize: 40, fontWeight: "800", color: "#ffffff", letterSpacing: 0.5 },
  nentitulli: { fontSize: 15, color: "#EDE9FE" },
  karta: {
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 22,
    gap: 12,
    shadowColor: "#2E1065",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  kartaTitulli: { fontSize: 22, fontWeight: "800", color: "#2E1065" },
  kartaNentitulli: { fontSize: 14, color: "#6D28D9", marginBottom: 2 },
  fusha: {
    padding: 14,
    fontSize: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD6FE",
    backgroundColor: "#F6F4FF",
    color: "#2E1065",
  },
  gabimi: { color: "#b3261e", fontSize: 14 },
  info: { color: "#5B21B6", fontSize: 14 },
  butoni: { marginTop: 4, padding: 15, borderRadius: 14, backgroundColor: "#7C3AED", alignItems: "center" },
  butoniTekst: { color: "#ffffff", fontWeight: "700", fontSize: 16 },
  dytesor: { padding: 15, borderRadius: 14, borderWidth: 2, borderColor: "#7C3AED", alignItems: "center" },
  dytesorTekst: { color: "#7C3AED", fontWeight: "700", fontSize: 16 },
  ndaresi: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 2 },
  vija: { flex: 1, height: 1, backgroundColor: "#DDD6FE" },
  ose: { color: "#8B7AB8", fontSize: 13 },
  vizitor: { padding: 14, borderRadius: 14, backgroundColor: "#EDE9FE", alignItems: "center" },
  vizitorTekst: { color: "#5B21B6", fontWeight: "700", fontSize: 16 },
  vizitorShpjegim: { color: "#6D28D9", fontSize: 12, textAlign: "center" },
  duke: { opacity: 0.6 },
});
