import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { itemCount } = useCart();
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
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Po ngarkohen restorantet...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Gabim</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRestaurants}>
          <Text style={styles.retryButtonText}>Provo përsëri</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (restaurants.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Nuk ka restorante të disponueshëm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>UniBite</Text>
          <Text style={styles.subtitle}>Restorantet në Mitrovicë</Text>
        </View>
        <View style={styles.headerButtons}>
          <Link href="/cart" asChild>
            <TouchableOpacity style={styles.cartButton}>
              <Text style={styles.cartButtonText}>🛒 {itemCount}</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/add-restaurant" asChild>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Shto</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchRestaurants(true)} colors={["#FF6B35"]} />
        }
        renderItem={({ item }) => (
          <Link href={`/restaurant/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.restaurantName}>{item.name_sq || item.name}</Text>
                {item.rating && <Text style={styles.rating}>★ {item.rating}</Text>}
              </View>
              {item.category && (
                <Text style={styles.category}>{item.category}</Text>
              )}
              <View style={styles.cardFooter}>
                {item.delivery_time && (
                  <Text style={styles.infoText}>🕒 {item.delivery_time}</Text>
                )}
                {item.address && (
                  <Text style={styles.infoText}>📍 {item.address}</Text>
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
    paddingTop: 60,
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
