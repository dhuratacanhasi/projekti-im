import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Href, router } from "expo-router";
import { useCart } from "@/context/CartContext";
import { PRAGU_KUPONIT, useBesnikeria } from "@/context/BesnikeriaContext";
import { QYTETET, useLokacioni } from "@/context/LokacioniContext";
import { usePorosite } from "@/context/PorositeContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";
import { useGjuha } from "@/i18n/GjuhaContext";

type Pagesa = "cash" | "karte";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { kuponAktiv, perdorKupon, regjistroPorosi, progresi } = useBesnikeria();
  const { shtoPorosi } = usePorosite();
  const { eshteVizitor, dilSiVizitor } = useVizitori();
  const { qyteti, ndryshoQytetin } = useLokacioni();
  const tema = useTema();
  const { t } = useGjuha();
  const [adresa, setAdresa] = useState("");
  const [telefoni, setTelefoni] = useState("");
  const [shenime, setShenime] = useState("");
  const [pagesa, setPagesa] = useState<Pagesa>("cash");
  // Kuponi aplikohet automatikisht; përdoruesi mund ta heqë me një trokitje.
  const [perdorKuponin, setPerdorKuponin] = useState(true);

  const zbritja = perdorKuponin && kuponAktiv ? (total * kuponAktiv.zbritje) / 100 : 0;
  const totaliFundit = Math.max(0, total - zbritja);

  function porosit() {
    if (!adresa.trim()) {
      Alert.alert(t("Mungon adresa"), t("Shkruani adresën / lokacionin e dorëzimit."));
      return;
    }

    const numri = telefoni.replace(/\D/g, "");
    if (numri.length < 6) {
      Alert.alert(t("Mungon telefoni"), t("Shkruani një numër telefoni të saktë."));
      return;
    }

    if (items.length === 0) {
      Alert.alert(t("Shporta është bosh"), t("Shtoni produkte para se të porosisni."));
      return;
    }

    const rreshtat = items
      .map((item) => `${item.quantity}× ${item.name} — €${(item.price * item.quantity).toFixed(2)}`)
      .join("\n");
    const metoda = pagesa === "cash" ? t("Cash në dorëzim") : t("Kartë në dorëzim");
    const shenimi = shenime.trim() ? t("Shënime: {shenime}\n", { shenime: shenime.trim() }) : "";
    const kuponTeksti =
      zbritja > 0 && kuponAktiv
        ? t("Kupon: {kodi} (−{zbritje}%)\nZbritja: −€{zbritjaEuro}\n", {
            kodi: kuponAktiv.kodi,
            zbritje: kuponAktiv.zbritje,
            zbritjaEuro: zbritja.toFixed(2),
          })
        : "";

    Alert.alert(
      t("Porosia u dërgua"),
      t(
        "Qyteti: {qyteti}\nAdresa: {adresa}\nTelefoni: {telefoni}\nPagesa: {pagesa}\n{shenime}{kupon}\n{rreshtat}\n\nTotali: €{totali}",
        {
          qyteti,
          adresa: adresa.trim(),
          telefoni: telefoni.trim(),
          pagesa: metoda,
          shenime: shenimi,
          kupon: kuponTeksti,
          rreshtat,
          totali: totaliFundit.toFixed(2),
        }
      ),
      [
        {
          text: "OK",
          onPress: () => {
            if (zbritja > 0 && kuponAktiv) perdorKupon(kuponAktiv.id);

            shtoPorosi({
              restorantId: items[0]?.restaurantId ?? "",
              restoranti: items[0]?.restaurantName ?? "",
              artikuj: items.map((item) => ({
                emri: item.name,
                sasia: item.quantity,
                cmimi: item.price,
              })),
              totali: total,
              zbritja,
              totaliFundit,
              qyteti,
              adresa: adresa.trim(),
              telefoni: telefoni.trim(),
              pagesa: metoda,
              shenime: shenime.trim(),
            });

            const rezultati = regjistroPorosi();
            clearCart();
            router.replace("/porosite" as Href);

            if (rezultati.fitoiKupon && rezultati.kupon) {
              const kuponIRi = rezultati.kupon;
              setTimeout(() => {
                Alert.alert(
                  t("Urime! 🎉"),
                  t(
                    "Fitove një kupon {zbritje}% për porosinë e radhës.\nKodi: {kodi}\n\nDo të aplikohet automatikisht në checkout.",
                    { zbritje: kuponIRi.zbritje, kodi: kuponIRi.kodi }
                  )
                );
              }, 500);
            }
          },
        },
      ]
    );
  }

  if (eshteVizitor) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>
          {t("Për të porositur duhet të hyni ose të krijoni llogari.")}
        </Text>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: tema.kryesor }]} onPress={dilSiVizitor}>
          <Text style={styles.primaryButtonText}>{t("Hyr / Krijo llogari")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>{t("Shporta është bosh")}</Text>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: tema.kryesor }]} onPress={() => router.replace("/")}>
          <Text style={styles.primaryButtonText}>{t("Kthehu te restorantet")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tema.sfond }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { color: tema.kryesor }]}>{t("Të dhënat e porosisë")}</Text>
        <Text style={[styles.subtitle, { color: tema.tekstDytësor }]}>
          {t("Plotësoni adresën dhe telefonin që dorëzuesi t'ju gjejë.")}
        </Text>

        <Text style={[styles.label, { color: tema.tekst }]}>{t("Qyteti i dorëzimit")}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.qytetetRow}
        >
          {QYTETET.map((q) => {
            const zgjedhur = q === qyteti;
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
                onPress={() => ndryshoQytetin(q)}
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

        <Text style={[styles.label, { color: tema.tekst }]}>{t("Adresa / lokacioni i dorëzimit *")}</Text>
        <TextInput
          style={[styles.input, { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart }]}
          value={adresa}
          onChangeText={setAdresa}
          placeholder={t("Rruga, numri, kati, apartamenti")}
          placeholderTextColor={tema.tekstDytësor}
          multiline
        />

        <Text style={[styles.label, { color: tema.tekst }]}>{t("Numri i telefonit *")}</Text>
        <TextInput
          style={[styles.input, { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart }]}
          value={telefoni}
          onChangeText={setTelefoni}
          placeholder="+383 44 123 456"
          placeholderTextColor={tema.tekstDytësor}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: tema.tekst }]}>{t("Mënyra e pagesës")}</Text>
        <View style={styles.pagesaRow}>
          {[
            { id: "cash" as const, emri: t("Cash në dorëzim") },
            { id: "karte" as const, emri: t("Kartë në dorëzim") },
          ].map((opsion) => (
            <TouchableOpacity
              key={opsion.id}
              style={[
                styles.pagesaButon,
                {
                  borderColor: tema.kryesor,
                  backgroundColor: pagesa === opsion.id ? tema.kryesor : tema.kart,
                },
              ]}
              onPress={() => setPagesa(opsion.id)}
            >
              <Text
                style={{
                  color: pagesa === opsion.id ? tema.butonTekst : tema.kryesor,
                  fontWeight: "600",
                  fontSize: 13,
                }}
              >
                {opsion.emri}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: tema.tekst }]}>{t("Shënime (opsionale)")}</Text>
        <TextInput
          style={[
            styles.input,
            styles.inputShumen,
            { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart },
          ]}
          value={shenime}
          onChangeText={setShenime}
          placeholder={t("p.sh. pa qepë, zile 3, kati 2")}
          placeholderTextColor={tema.tekstDytësor}
          multiline
        />

        {kuponAktiv ? (
          <TouchableOpacity
            style={[
              styles.kuponKarta,
              {
                borderColor: perdorKuponin ? tema.kryesor : tema.kufi,
                backgroundColor: perdorKuponin ? tema.kryesorSfond : tema.kart,
              },
            ]}
            onPress={() => setPerdorKuponin((v) => !v)}
            activeOpacity={0.85}
          >
            <View style={styles.kuponMaja}>
              <Text style={styles.kuponIkona}>🎟️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.kuponTitulli, { color: tema.tekst }]}>
                  {t("Kupon −{zbritje}%", { zbritje: kuponAktiv.zbritje })}
                </Text>
                <Text style={[styles.kuponKodi, { color: tema.tekstDytësor }]}>
                  {t("Kodi: {kodi} · trokit për ta {veprim}", {
                    kodi: kuponAktiv.kodi,
                    veprim: t(perdorKuponin ? "hequr" : "përdorur"),
                  })}
                </Text>
              </View>
              <View
                style={[
                  styles.kuponCheck,
                  {
                    borderColor: tema.kryesor,
                    backgroundColor: perdorKuponin ? tema.kryesor : "transparent",
                  },
                ]}
              >
                {perdorKuponin ? <Text style={styles.kuponCheckTeksti}>✓</Text> : null}
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.kuponProgres, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
            <Text style={[styles.kuponTitulli, { color: tema.tekst }]}>{t("🎟️ Besnikëria UniBite")}</Text>
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
          </View>
        )}

        <View style={[styles.summary, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
          <Text style={[styles.summaryTitle, { color: tema.tekst }]}>{t("Përmbledhja e porosisë")}</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={[styles.summaryItem, { color: tema.tekst }]}>
                {item.quantity}× {item.name}
              </Text>
              <Text style={[styles.summaryPrice, { color: tema.tekst }]}>
                €{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          {zbritja > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryItem, { color: tema.tekstDytësor }]}>{t("Zbritja e kuponit")}</Text>
              <Text style={[styles.summaryPrice, { color: "#15803D", fontWeight: "700" }]}>
                −€{zbritja.toFixed(2)}
              </Text>
            </View>
          ) : null}
          <View style={[styles.summaryTotalRow, { borderTopColor: tema.kufi }]}>
            <Text style={[styles.summaryTotalLabel, { color: tema.tekst }]}>{t("Totali")}</Text>
            <Text style={[styles.summaryTotal, { color: tema.kryesor }]}>€{totaliFundit.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: tema.kryesor }]} onPress={porosit}>
          <Text style={styles.primaryButtonText}>{t("Porosit dhe konfirmo")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
  inputShumen: {
    minHeight: 70,
  },
  pagesaRow: {
    flexDirection: "row",
    gap: 10,
  },
  qytetetRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
    paddingRight: 8,
  },
  qytetiChip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pagesaButon: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  kuponKarta: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  kuponMaja: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  kuponIkona: {
    fontSize: 22,
  },
  kuponTitulli: {
    fontSize: 15,
    fontWeight: "800",
  },
  kuponKodi: {
    fontSize: 12,
    marginTop: 1,
  },
  kuponCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  kuponCheckTeksti: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
  kuponProgres: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    gap: 4,
  },
  progresShirit: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 4,
  },
  progresMbushe: {
    height: "100%",
    borderRadius: 999,
  },
  summary: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryItem: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  summaryPrice: {
    fontSize: 14,
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 10,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "bold",
  },
  primaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
