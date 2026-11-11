import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { eshteVizitor, dilSiVizitor } = useVizitori();
  const tema = useTema();

  function handleOrder() {
    if (items.length === 0) {
      Alert.alert("Gabim", "Shporta është bosh");
      return;
    }

    // Porosia kërkon llogari; shporta ruhet dhe vazhdon pas hyrjes.
    if (eshteVizitor) {
      Alert.alert(
        "Kërkohet llogari",
        "Për të porositur duhet të hyni ose të krijoni llogari. Shporta juaj do të ruhet.",
        [
          { text: "Anulo", style: "cancel" },
          { text: "Hyr", onPress: dilSiVizitor },
        ]
      );
      return;
    }

    router.push("/checkout");
  }

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>Shporta është bosh</Text>
        <TouchableOpacity style={[styles.shopButton, { backgroundColor: tema.kryesor }]} onPress={() => router.push("/")}>
          <Text style={styles.shopButtonText}>Kthehu te restorantet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: tema.sfond }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: tema.kart }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.itemName, { color: tema.tekst }]}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeText}>Fshi</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.price, { color: tema.tekstDytësor }]}>€{item.price.toFixed(2)}</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: tema.kryesorSfond }]}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={[styles.quantityButtonText, { color: tema.tekst }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.quantityText, { color: tema.tekst }]}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: tema.kryesorSfond }]}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={[styles.quantityButtonText, { color: tema.tekst }]}>+</Text>
              </TouchableOpacity>
              <Text style={[styles.itemTotal, { color: tema.kryesor }]}>
                €{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      />
      <View style={[styles.footer, { backgroundColor: tema.kart, borderTopColor: tema.kufi }]}>
        {eshteVizitor && (
          <Text style={[styles.vizitorNote, { color: tema.tekstDytësor }]}>
            Po shfletoni si vizitor. Për të porositur, hyni ose krijoni llogari.
          </Text>
        )}
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: tema.tekst }]}>Totali:</Text>
          <Text style={[styles.totalAmount, { color: tema.kryesor }]}>€{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={[styles.orderButton, { backgroundColor: tema.kryesor }]} onPress={handleOrder}>
          <Text style={styles.orderButtonText}>Porosit tani</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  removeText: {
    color: "#d32f2f",
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
  itemTotal: {
    marginLeft: "auto",
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  vizitorNote: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  orderButton: {
    backgroundColor: "#FF6B35",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
