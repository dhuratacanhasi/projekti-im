import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";
import { DEMO_MENU_ITEMS, DEMO_RESTAURANTS } from "@/data/demo";
import { useGjuha } from "@/i18n/GjuhaContext";
import { bashkoMenune, plotesoRestorantin } from "@/lib/katalogu";
import { supabase } from "@/lib/supabase";
import { MenuItem, Restaurant } from "@/types";

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  const { eshteVizitor } = useVizitori();
  const tema = useTema();
  const { t, eshteAnglisht } = useGjuha();
  const [restoranti, setRestoranti] = useState<Restaurant | null>(null);
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
        setRestoranti(DEMO_RESTAURANTS.find((r) => r.id === id) ?? null);
        setMenuItems(
          DEMO_MENU_ITEMS.filter((item) => item.restaurant_id === id && item.is_available !== false)
        );
        return;
      }

      const [{ data: restData }, { data: menuData, error: menuError }] = await Promise.all([
        supabase.from("restaurants").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", id)
          .eq("is_available", true)
          .order("category", { ascending: true }),
      ]);

      if (menuError) {
        setError(menuError.message);
        return;
      }

      setRestoranti(
        restData ? plotesoRestorantin(restData) : DEMO_RESTAURANTS.find((r) => r.id === id) ?? null
      );
      setMenuItems(bashkoMenune(menuData || [], id as string));
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

  // Artikujt grupohen sipas kategorisë për një menu më të lexueshme.
  const kategoriaTjeter = t("Të tjera");
  const seksionet = useMemo(() => {
    const mapa = new Map<string, MenuItem[]>();
    for (const artikull of menuItems) {
      const kategoria = artikull.category || kategoriaTjeter;
      if (!mapa.has(kategoria)) mapa.set(kategoria, []);
      mapa.get(kategoria)!.push(artikull);
    }
    return Array.from(mapa.entries()).map(([title, data]) => ({ title, data }));
  }, [menuItems, kategoriaTjeter]);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <ActivityIndicator size="large" color={tema.kryesor} />
        <Text style={[styles.loadingText, { color: tema.tekstDytësor }]}>
          {t("Po ngarkohen produktet...")}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <Text style={styles.errorTitle}>{t("Gabim")}</Text>
        <Text style={[styles.errorText, { color: tema.tekstDytësor }]}>{error}</Text>
      </View>
    );
  }

  if (menuItems.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: tema.sfond }]}>
        <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>
          {t("Nuk ka produkte në menunë")}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: tema.sfond }]}>
      <Stack.Screen
        options={{ title: restoranti?.name_sq || restoranti?.name || t("Menuja") }}
      />

      <SectionList
        sections={seksionet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchMenu(true)} colors={[tema.kryesor]} />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              {restoranti?.image_url ? (
                <Image source={{ uri: restoranti.image_url }} style={styles.heroImage} resizeMode="cover" />
              ) : (
                <View style={styles.heroFallback}>
                  <Text style={styles.heroFallbackText}>🍽️</Text>
                </View>
              )}
              <LinearGradient
                colors={["transparent", "rgba(46,16,101,0.85)"]}
                style={styles.heroOverlay}
              />
              <View style={styles.heroTekst}>
                <Text style={styles.heroTitulli} numberOfLines={2}>
                  {restoranti?.name_sq || restoranti?.name || t("Restoranti")}
                </Text>
                <View style={styles.heroMetaRow}>
                  {restoranti?.rating ? <Text style={styles.heroMeta}>★ {restoranti.rating}</Text> : null}
                  {restoranti?.delivery_time ? (
                    <Text style={styles.heroMeta}>🕒 {restoranti.delivery_time}</Text>
                  ) : null}
                  {restoranti?.city ? <Text style={styles.heroMeta}>📍 {restoranti.city}</Text> : null}
                </View>
                {restoranti?.address ? (
                  <Text style={styles.heroAdresa} numberOfLines={1}>
                    {restoranti.address}
                  </Text>
                ) : null}
              </View>
            </View>

            {eshteVizitor && (
              <View style={[styles.vizitorBanner, { backgroundColor: tema.kryesorSfond, borderColor: tema.kryesor }]}>
                <Text style={[styles.vizitorBannerText, { color: tema.kryesor }]}>
                  {t("Vizitor · Mund të shtoni në shportë, por për të porositur duhet llogari.")}
                </Text>
              </View>
            )}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={[styles.seksioniTitulli, { color: tema.tekst }]}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={[styles.itemRow, { backgroundColor: tema.kart }]}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="cover" />
            ) : (
              <View style={[styles.itemImage, styles.itemImageFallback]}>
                <Text style={styles.itemImageFallbackText}>🍴</Text>
              </View>
            )}

            <View style={styles.itemBody}>
              <Text style={[styles.itemName, { color: tema.tekst }]} numberOfLines={2}>
                {eshteAnglisht ? item.name_en || item.name_sq || item.name : item.name_sq || item.name}
              </Text>
              {(item.description_sq || item.description || item.description_en) && (
                <Text style={[styles.description, { color: tema.tekstDytësor }]} numberOfLines={2}>
                  {eshteAnglisht
                    ? item.description_en || item.description_sq || item.description
                    : item.description_sq || item.description}
                </Text>
              )}
              <View style={styles.itemFooter}>
                <Text style={[styles.price, { color: tema.kryesor }]}>€{Number(item.price).toFixed(2)}</Text>
                <TouchableOpacity
                  style={[styles.addToCartButton, { backgroundColor: tema.kryesor }]}
                  onPress={() => {
                    addToCart({
                      menuItemId: item.id,
                      name:
                        (eshteAnglisht
                          ? item.name_en || item.name_sq || item.name
                          : item.name_sq || item.name) || "",
                      price: Number(item.price),
                      quantity: 1,
                      restaurantId: id as string,
                      restaurantName: restoranti?.name_sq || restoranti?.name || "",
                    });
                    Alert.alert(t("Shtuar"), t("Produkti u shtua në shportë"));
                  }}
                >
                  <Text style={styles.addToCartButtonText}>{t("+ Shto")}</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  listContent: {
    paddingBottom: 30,
  },
  hero: {
    height: 210,
    backgroundColor: "#EDE9FE",
    justifyContent: "flex-end",
  },
  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroFallback: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  heroFallbackText: {
    fontSize: 56,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroTekst: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 3,
  },
  heroTitulli: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 2,
  },
  heroMeta: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EDE9FE",
  },
  heroAdresa: {
    fontSize: 12,
    color: "#DDD6FE",
    marginTop: 2,
  },
  vizitorBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  vizitorBannerText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  seksioniTitulli: {
    fontSize: 17,
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 10,
    gap: 12,
    shadowColor: "#2E1065",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
  },
  itemImageFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemImageFallbackText: {
    fontSize: 30,
  },
  itemBody: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
  },
  addToCartButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
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
