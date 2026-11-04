import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { MenuItem } from "@/types";

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
    }, [id])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Po ngarkohen produktet...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Gabim</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (menuItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Nuk ka produkte në menunë</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Menuja</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchMenu(true)} colors={["#FF6B35"]} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.itemName}>{item.name_sq || item.name}</Text>
              <Text style={styles.price}>€{Number(item.price).toFixed(2)}</Text>
            </View>
            {(item.description_sq || item.description) && (
              <Text style={styles.description}>{item.description_sq || item.description}</Text>
            )}
            {item.category && <Text style={styles.category}>{item.category}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
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
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
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
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
