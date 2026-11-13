import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { OfertatJaves } from "@/components/OfertatJaves";
import { ShiritiPoshtem } from "@/components/ShiritiPoshtem";
import { useCart } from "@/context/CartContext";
import { QYTETET, useLokacioni } from "@/context/LokacioniContext";
import { useTema } from "@/context/TemaContext";
import { useVizitori } from "@/context/VizitoriContext";
import { DEMO_RESTAURANTS } from "@/data/demo";
import { bashkoKatalogun } from "@/lib/katalogu";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";

export default function Home() {
  const { itemCount } = useCart();
  const { eshteVizitor, dilSiVizitor } = useVizitori();
  const { qyteti, ndryshoQytetin } = useLokacioni();
  const tema = useTema();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zgjedhesiHapur, setZgjedhesiHapur] = useState(false);

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

      setRestaurants(bashkoKatalogun(data || []));
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

  // Restorantet filtrohen sipas qytetit të zgjedhur në krye.
  const teFiltruara = useMemo(
    () => restaurants.filter((r) => (r.city ?? "Mitrovicë") === qyteti),
    [restaurants, qyteti]
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

  return (
    <View style={[styles.container, { backgroundColor: tema.sfond }]}>
      <LinearGradient
        colors={["#7C3AED", "#5B21B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerTeksti}>
            <Text style={styles.pershendetje}>Përshëndetje 👋</Text>
            <Text style={styles.heading}>Çka po hajmë sot?</Text>
          </View>

          <Pressable
            style={styles.lokacioni}
            onPress={() => setZgjedhesiHapur(true)}
            accessibilityRole="button"
            accessibilityLabel={`Ndrysho qytetin, aktualisht ${qyteti}`}
          >
            <Text style={styles.lokacioniEmri} numberOfLines={1}>
              📍 {qyteti}
            </Text>
            <Text style={styles.lokacioniShigjeta}>▾</Text>
          </Pressable>
        </View>

        <Text style={styles.subtitle}>
          {teFiltruara.length} restorante · {eshteVizitor ? "po shfletoni si vizitor" : "gati për porosi"}
        </Text>

        <View style={styles.headerButtons}>
          <Link href="/cart" asChild>
            <TouchableOpacity style={styles.cartButton}>
              <Text style={styles.cartButtonText}>🛒 Shporta · {itemCount}</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.addButton} onPress={shtoRestorant}>
            <Text style={styles.addButtonText}>+ Shto</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
        data={teFiltruara}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<OfertatJaves />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchRestaurants(true)} colors={[tema.kryesor]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={[styles.emptyTitle, { color: tema.tekst }]}>Nuk ka restorante në {qyteti}</Text>
            <Text style={[styles.emptyText, { color: tema.tekstDytësor }]}>
              Provo një qytet tjetër ose shiko të gjitha restorantet.
            </Text>
            <Pressable
              style={[styles.emptyButton, { backgroundColor: tema.kryesor }]}
              onPress={() => setZgjedhesiHapur(true)}
            >
              <Text style={styles.emptyButtonText}>Ndrysho qytetin</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/restaurant/${item.id}`} asChild>
            <TouchableOpacity style={styles.card} activeOpacity={0.85}>
              <View style={styles.cardMedia}>
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <View style={styles.cardImageFallback}>
                    <Text style={styles.cardImageFallbackText}>🍽️</Text>
                  </View>
                )}
                <LinearGradient
                  colors={["transparent", "rgba(46,16,101,0.75)"]}
                  style={styles.cardOverlay}
                />
                {item.rating ? (
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingBadgeText}>★ {item.rating}</Text>
                  </View>
                ) : null}
                <View style={styles.cardMediaTekst}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {item.name_sq || item.name}
                  </Text>
                  {item.category ? <Text style={styles.category}>{item.category}</Text> : null}
                </View>
              </View>

              <View style={styles.cardBody}>
                {item.description_sq ? (
                  <Text style={[styles.description, { color: tema.tekstDytësor }]} numberOfLines={2}>
                    {item.description_sq}
                  </Text>
                ) : null}
                <View style={styles.cardFooter}>
                  {item.delivery_time ? (
                    <Text style={[styles.infoText, { color: tema.tekstDytësor }]}>🕒 {item.delivery_time}</Text>
                  ) : null}
                  {item.city ? (
                    <Text style={[styles.infoText, { color: tema.tekstDytësor }]}>📍 {item.city}</Text>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />

      <ShiritiPoshtem />

      <Modal
        visible={zgjedhesiHapur}
        transparent
        animationType="fade"
        onRequestClose={() => setZgjedhesiHapur(false)}
      >
        <Pressable style={styles.modalSfond} onPress={() => setZgjedhesiHapur(false)}>
          <Pressable style={styles.modalKarta} onPress={() => {}}>
            <View style={styles.modalDoreza} />
            <Text style={styles.modalTitulli}>Zgjidh qytetin</Text>
            <Text style={styles.modalNentitulli}>Restorantet do të filtrohen sipas qytetit.</Text>

            {QYTETET.map((q) => {
              const zgjedhur = q === qyteti;
              return (
                <Pressable
                  key={q}
                  style={[styles.qytetiRresht, zgjedhur && styles.qytetiRreshtZgjedhur]}
                  onPress={() => {
                    ndryshoQytetin(q);
                    setZgjedhesiHapur(false);
                  }}
                >
                  <Text style={[styles.qytetiEmri, zgjedhur && styles.qytetiEmriZgjedhur]}>📍 {q}</Text>
                  {zgjedhur ? <Text style={styles.qytetiShenja}>✓</Text> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  headerTeksti: {
    flex: 1,
  },
  pershendetje: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DDD6FE",
    letterSpacing: 0.4,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 2,
  },
  lokacioni: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: 150,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 4,
  },
  lokacioniEmri: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },
  lokacioniShigjeta: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#EDE9FE",
    marginTop: 8,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cartButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
  },
  cartButtonText: {
    color: "#5B21B6",
    fontSize: 15,
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  vizitorBanner: {
    marginHorizontal: 16,
    marginTop: 12,
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
    gap: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#2E1065",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardMedia: {
    height: 160,
    backgroundColor: "#EDE9FE",
    justifyContent: "flex-end",
  },
  cardImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardImageFallback: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  cardImageFallbackText: {
    fontSize: 44,
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingBadgeText: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "800",
  },
  cardMediaTekst: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
  },
  category: {
    fontSize: 13,
    color: "#EDE9FE",
    marginTop: 1,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  infoText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyButton: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  modalSfond: {
    flex: 1,
    backgroundColor: "rgba(46,16,101,0.45)",
    justifyContent: "flex-end",
  },
  modalKarta: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
    gap: 6,
  },
  modalDoreza: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#DDD6FE",
    marginBottom: 10,
  },
  modalTitulli: {
    fontSize: 21,
    fontWeight: "800",
    color: "#2E1065",
  },
  modalNentitulli: {
    fontSize: 13,
    color: "#6D28D9",
    marginBottom: 10,
  },
  qytetiRresht: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  qytetiRreshtZgjedhur: {
    backgroundColor: "#EDE9FE",
  },
  qytetiEmri: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E1065",
  },
  qytetiEmriZgjedhur: {
    color: "#5B21B6",
    fontWeight: "800",
  },
  qytetiShenja: {
    fontSize: 16,
    fontWeight: "800",
    color: "#7C3AED",
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
