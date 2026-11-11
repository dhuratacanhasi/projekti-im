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
import { router } from "expo-router";

import { useCart } from "@/context/CartContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";

type Pagesa = "cash" | "karte";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { eshteVizitor, dilSiVizitor } = useVizitori();
  const tema = useTema();
  const [adresa, setAdresa] = useState("");
  const [telefoni, setTelefoni] = useState("");
  const [shenime, setShenime] = useState("");
  const [pagesa, setPagesa] = useState<Pagesa>("cash");

  function porosit() {
    if (!adresa.trim()) {
      Alert.alert("Mungon adresa", "Shkruani adresën / lokacionin e dorëzimit.");
      return;
    }

    const numri = telefoni.replace(/\D/g, "");
    if (numri.length < 6) {
      Alert.alert("Mungon telefoni", "Shkruani një numër telefoni të saktë.");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Shporta është bosh", "Shtoni produkte para se të porosisni.");
      return;
    }

    const rreshtat = items
      .map((item) => `${item.quantity}× ${item.name} — €${(item.price * item.quantity).toFixed(2)}`)
      .join("\n");
    const metoda = pagesa === "cash" ? "Cash në dorëzim" : "Kartë në dorëzim";
    const shenimi = shenime.trim() ? `Shënime: ${shenime.trim()}\n` : "";

    Alert.alert(
      "Porosia u dërgua",
      `Adresa: ${adresa.trim()}\nTelefoni: ${telefoni.trim()}\nPagesa: ${metoda}\n${shenimi}\n${rreshtat}\n\nTotali: €${total.toFixed(2)}`,
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.replace("/");
          },
        },
      ]
    );
  }

  if (eshteVizitor) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>
          Për të porositur duhet të hyni ose të krijoni llogari.
        </Text>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: tema.kryesor }]} onPress={dilSiVizitor}>
          <Text style={styles.primaryButtonText}>Hyr / Krijo llogari</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>Shporta është bosh</Text>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: tema.kryesor }]} onPress={() => router.replace("/")}>
          <Text style={styles.primaryButtonText}>Kthehu te restorantet</Text>
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
        <Text style={[styles.heading, { color: tema.kryesor }]}>Të dhënat e porosisë</Text>
        <Text style={[styles.subtitle, { color: tema.tekstDytësor }]}>
          Plotësoni adresën dhe telefonin që dorëzuesi t'ju gjejë.
        </Text>

        <Text style={[styles.label, { color: tema.tekst }]}>Adresa / lokacioni i dorëzimit *</Text>
        <TextInput
          style={[styles.input, { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart }]}
          value={adresa}
          onChangeText={setAdresa}
          placeholder="Rruga, numri, kati, apartamenti"
          placeholderTextColor={tema.tekstDytësor}
          multiline
        />

        <Text style={[styles.label, { color: tema.tekst }]}>Numri i telefonit *</Text>
        <TextInput
          style={[styles.input, { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart }]}
          value={telefoni}
          onChangeText={setTelefoni}
          placeholder="+383 44 123 456"
          placeholderTextColor={tema.tekstDytësor}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: tema.tekst }]}>Mënyra e pagesës</Text>
        <View style={styles.pagesaRow}>
          {[
            { id: "cash" as const, emri: "Cash në dorëzim" },
            { id: "karte" as const, emri: "Kartë në dorëzim" },
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

        <Text style={[styles.label, { color: tema.tekst }]}>Shënime (opsionale)</Text>
        <TextInput
          style={[
            styles.input,
            styles.inputShumen,
            { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart },
          ]}
          value={shenime}
          onChangeText={setShenime}
          placeholder="p.sh. pa qepë, zile 3, kati 2"
          placeholderTextColor={tema.tekstDytësor}
          multiline
        />

        <View style={[styles.summary, { backgroundColor: tema.kart, borderColor: tema.kufi }]}>
          <Text style={[styles.summaryTitle, { color: tema.tekst }]}>Përmbledhja e porosisë</Text>
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
          <View style={[styles.summaryTotalRow, { borderTopColor: tema.kufi }]}>
            <Text style={[styles.summaryTotalLabel, { color: tema.tekst }]}>Totali</Text>
            <Text style={[styles.summaryTotal, { color: tema.kryesor }]}>€{total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: tema.kryesor }]} onPress={porosit}>
          <Text style={styles.primaryButtonText}>Porosit dhe konfirmo</Text>
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
  pagesaButon: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
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
