import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";
import { DEMO_MENU_ITEMS } from "@/data/demo";
import { supabase } from "@/lib/supabase";
import { MenuItem } from "@/types";

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  const { eshteVizitor } = useVizitori();
  const tema = useTema();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMenu(isRefreshing = false) {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Vizitori lexon menunë demo; përdoruesi i kyçur lexon Supabase.
      if (eshteVizitor) {
        setMenuItems(
          DEMO_MENU_ITEMS.filter((item) => item.restaurant_id === id && item.is_available !== false)
        );
        return;
      }

      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", id)
        .eq("is_available", true)
        .order("category", { ascending: true });

      if (error) {
        setError(error.message);
        return;
      }

      setMenuItems(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchMenu();
      }
    }, [id, eshteVizitor])
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <ActivityIndicator size="large" color={tema.kryesor} />
        <Text style={[styles.loadingText, { color: tema.tekstDytësor }]}>Po ngarkohen produktet...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <Text style={styles.errorTitle}>Gabim</Text>
        <Text style={[styles.errorText, { color: tema.tekstDytësor }]}>{error}</Text>
      </View>
    );
  }

  if (menuItems.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>Nuk ka produkte në menunë</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: tema.sfond }]}>
      <Text style={[styles.heading, { color: tema.kryesor }]}>Menuja</Text>

      {eshteVizitor && (
        <View style={[styles.vizitorBanner, { backgroundColor: tema.kryesorSfond, borderColor: tema.kryesor }]}>
          <Text style={[styles.vizitorBannerText, { color: tema.kryesor }]}>
            Vizitor · Mund të shtoni në shportë, por për të porositur duhet llogari.
          </Text>
        </View>
      )}

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchMenu(true)} colors={[tema.kryesor]} />
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: tema.kart }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.itemName, { color: tema.tekst }]}>{item.name_sq || item.name}</Text>
              <Text style={[styles.price, { color: tema.kryesor }]}>€{Number(item.price).toFixed(2)}</Text>
            </View>
            {(item.description_sq || item.description) && (
              <Text style={[styles.description, { color: tema.tekstDytësor }]}>
                {item.description_sq || item.description}
              </Text>
            )}
            {item.category && <Text style={styles.category}>{item.category}</Text>}
            <TouchableOpacity
              style={[styles.addToCartButton, { backgroundColor: tema.kryesor }]}
              onPress={() => {
                addToCart({
                  menuItemId: item.id,
                  name: item.name_sq || item.name || "",
                  price: Number(item.price),
                  quantity: 1,
                  restaurantId: id as string,
                });
                Alert.alert("Shtuar", "Produkti u shtua në shportë");
              }}
            >
              <Text style={styles.addToCartButtonText}>+ Shto në shportë</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F4FF",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F6F4FF",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7C3AED",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  vizitorBanner: {
    marginHorizontal: 16,
    marginBottom: 4,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  vizitorBannerText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
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
    marginBottom: 6,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2E1065",
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7C3AED",
  },
  description: {
    fontSize: 14,
    color: "#6D28D9",
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    color: "#8B7AB8",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6D28D9",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#6D28D9",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6D28D9",
  },
});
