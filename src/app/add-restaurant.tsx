import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useLokacioni } from "@/context/LokacioniContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";
import { supabase } from "@/lib/supabase";

export default function AddRestaurant() {
  const { eshteVizitor, dilSiVizitor } = useVizitori();
  const { qyteti } = useLokacioni();
  const tema = useTema();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert("Gabim", "Emri i restorantit është i detyrueshëm");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("restaurants").insert([
        {
          name: name.trim(),
          name_sq: name.trim(),
          category: category.trim() || null,
          address: address.trim() || null,
          city: qyteti,
          delivery_time: deliveryTime.trim() || null,
          is_active: true,
          rating: 0,
        },
      ]);

      if (error) {
        Alert.alert("Gabim", error.message);
        return;
      }

      Alert.alert("Sukses", "Restoranti u shtua me sukses!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Gabim", err.message);
    } finally {
      setLoading(false);
    }
  }

  if (eshteVizitor) {
    return (
      <View style={[styles.container, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.title, { color: tema.kryesor }]}>Kërkohet llogari</Text>
        <Text style={[styles.guardText, { color: tema.tekstDytësor }]}>
          Për të shtuar restorant duhet të hyni ose të krijoni llogari.
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: tema.kryesor }]} onPress={dilSiVizitor}>
          <Text style={styles.buttonText}>Hyr / Krijo llogari</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: tema.sfond }]}>
      <Text style={[styles.title, { color: tema.kryesor }]}>Shto Restorant</Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: tema.tekst }]}>Emri i restorantit *</Text>
        <TextInput
          style={[styles.input, { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart }]}
          value={name}
          onChangeText={setName}
          placeholder="p.sh. Pizza House"
          placeholderTextColor={tema.tekstDytësor}
        />

        <Text style={[styles.label, { color: tema.tekst }]}>Kategoria</Text>
        <TextInput
          style={[styles.input, { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart }]}
          value={category}
          onChangeText={setCategory}
          placeholder="p.sh. Pizza, Fast Food"
          placeholderTextColor={tema.tekstDytësor}
        />

        <Text style={[styles.label, { color: tema.tekst }]}>Adresa</Text>
        <TextInput
          style={[styles.input, { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart }]}
          value={address}
          onChangeText={setAddress}
          placeholder="p.sh. Rruga Adem Jashari"
          placeholderTextColor={tema.tekstDytësor}
        />

        <Text style={[styles.label, { color: tema.tekst }]}>Qyteti</Text>
        <View
          style={[
            styles.input,
            styles.qytetiFusha,
            { borderColor: tema.kufi, backgroundColor: tema.kryesorSfond },
          ]}
        >
          <Text style={[styles.qytetiTeksti, { color: tema.tekst }]}>📍 {qyteti}</Text>
        </View>
        <Text style={[styles.ndihme, { color: tema.tekstDytësor }]}>
          Qyteti merret nga zgjedhja në krye të aplikacionit.
        </Text>

        <Text style={[styles.label, { color: tema.tekst }]}>Koha e dorëzimit</Text>
        <TextInput
          style={[styles.input, { borderColor: tema.kufi, color: tema.tekst, backgroundColor: tema.kart }]}
          value={deliveryTime}
          onChangeText={setDeliveryTime}
          placeholder="p.sh. 20-30 min"
          placeholderTextColor={tema.tekstDytësor}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: tema.kryesor }, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Po ruhet..." : "Ruaj"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4FF",
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7C3AED",
    marginBottom: 24,
    textAlign: "center",
  },
  guardText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E1065",
    marginBottom: -8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDD6FE",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#2E1065",
  },
  qytetiFusha: {
    justifyContent: "center",
  },
  qytetiTeksti: {
    fontSize: 16,
    fontWeight: "600",
  },
  ndihme: {
    fontSize: 12,
    marginTop: -10,
  },
  button: {
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
