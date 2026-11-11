import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";
import { DEMO_RESTAURANTS } from "@/data/demo";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";

export default function Home() {
  const { itemCount } = useCart();
  const { eshteVizitor, dilSiVizitor } = useVizitori();
  const tema = useTema();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRestaurants(isRefreshing = false) {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Vizitori shfleton demo-n lokale; Supabase kërkon llogari (RLS).
      if (eshteVizitor) {
        setRestaurants(DEMO_RESTAURANTS);
        return;
      }

      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) {
        setError(error.message);
        return;
      }

      setRestaurants(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchRestaurants();
    }, [eshteVizitor])
  );

  function shtoRestorant() {
    if (eshteVizitor) {
      Alert.alert("Kërkohet llogari", "Për të shtuar restorant duhet të hyni ose të krijoni llogari.", [
        { text: "Anulo", style: "cancel" },
        { text: "Hyr", onPress: dilSiVizitor },
      ]);
      return;
    }
    router.push("/add-restaurant");
  }

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <ActivityIndicator size="large" color={tema.kryesor} />
        <Text style={[styles.loadingText, { color: tema.tekstDytësor }]}>Po ngarkohen restorantet...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <Text style={styles.errorTitle}>Gabim</Text>
        <Text style={[styles.errorText, { color: tema.tekstDytësor }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: tema.kryesor }]} onPress={() => fetchRestaurants()}>
          <Text style={styles.retryButtonText}>Provo përsëri</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (restaurants.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>Nuk ka restorante të disponueshëm</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: tema.sfond }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.heading, { color: tema.kryesor }]}>UniBite</Text>
          <Text style={[styles.subtitle, { color: tema.tekstDytësor }]}>
            {eshteVizitor ? "Po shfletoni si vizitor" : "Restorantet në Mitrovicë"}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <Link href="/cart" asChild>
            <TouchableOpacity style={StyleSheet.flatten([styles.cartButton, { borderColor: tema.kryesor }])}>
              <Text style={[styles.cartButtonText, { color: tema.kryesor }]}>🛒 {itemCount}</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: tema.kryesor }]} onPress={shtoRestorant}>
            <Text style={styles.addButtonText}>+ Shto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {eshteVizitor && (
        <TouchableOpacity
          style={[styles.vizitorBanner, { backgroundColor: tema.kryesorSfond, borderColor: tema.kryesor }]}
          onPress={dilSiVizitor}
        >
          <Text style={[styles.vizitorBannerText, { color: tema.kryesor }]}>
            Vizitor · Hyni për të porositur ose për të shtuar restorant
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchRestaurants(true)} colors={[tema.kryesor]} />
        }
        renderItem={({ item }) => (
          <Link href={`/restaurant/${item.id}`} asChild>
            <TouchableOpacity style={StyleSheet.flatten([styles.card, { backgroundColor: tema.kart }])}>
              <View style={styles.cardHeader}>
                <Text style={[styles.restaurantName, { color: tema.tekst }]}>{item.name_sq || item.name}</Text>
                {item.rating && <Text style={styles.rating}>★ {item.rating}</Text>}
              </View>
              {item.category && (
                <Text style={[styles.category, { color: tema.tekstDytësor }]}>{item.category}</Text>
              )}
              <View style={styles.cardFooter}>
                {item.delivery_time && (
                  <Text style={[styles.infoText, { color: tema.tekstDytësor }]}>🕒 {item.delivery_time}</Text>
                )}
                {item.address && (
                  <Text style={[styles.infoText, { color: tema.tekstDytësor }]}>📍 {item.address}</Text>
                )}
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  cartButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B35",
  },
  cartButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  vizitorBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFB800",
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
