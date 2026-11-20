import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export interface ThriftItem {
  id: string;
  title: string;
  category: string;
  price: number;
  size: string;
  material: string;
  condition: string;
  source?: "cloud" | "api";
}

export default function CustomerScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<ThriftItem[]>([]);

  // State katalog gabungan (Cloud Supabase RLS + Supplier API)
  const [products, setProducts] = useState<ThriftItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [promoMessage] = useState<string>("🎉 Promo: THRIFT2026 (Diskon 15%)");

  // Mengambil stok Cloud Supabase (RLS) + API Eksternal DummyJSON
  const fetchAllProducts = async (isPullRefresh = false) => {
    try {
      if (!isPullRefresh) setLoading(true);

      // 1. Ambil stok baju dari tabel thrift_items Supabase (terfilter RLS per akun)
      const { data: cloudData, error: cloudError } = await supabase
        .from("thrift_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (cloudError) {
        console.error(
          "Gagal mengambil data Cloud Supabase:",
          cloudError.message,
        );
      }

      const mappedCloudProducts: ThriftItem[] = (cloudData || []).map(
        (item: any) => ({
          id: item.id.toString(),
          title: item.title,
          category: item.category,
          price: Number(item.price) || 0,
          size: item.size || "L",
          material: item.material || "Cotton Premium",
          condition: item.condition || "Grade A",
          source: "cloud",
        }),
      );

      // 2. Ambil katalog dari API publik eksternal (Syarat Modul 3 tetap berjalan)
      const response = await fetch(
        "https://dummyjson.com/products/category/mens-shirts",
      );
      const data = await response.json();

      const mappedApiProducts: ThriftItem[] = (data.products || []).map(
        (item: any) => ({
          id: item.id.toString(),
          title: item.title,
          category: "Import Thrift",
          price: Math.round(item.price * 15000),
          size: "L",
          material: "Cotton Premium",
          condition: "Grade A (Original API)",
          source: "api",
        }),
      );

      // Gabungkan stok Cloud di atas dan katalog Supplier API di bawah
      setProducts([...mappedCloudProducts, ...mappedApiProducts]);
    } catch (error) {
      console.error("Gagal mengambil katalog:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Otomatis sinkron ulang setiap kali halaman Customer dibuka
  useFocusEffect(
    useCallback(() => {
      fetchAllProducts();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllProducts(true);
  };

  const addToCart = (item: ThriftItem) => setCart((prev) => [...prev, item]);
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    router.push({
      pathname: "/checkout",
      params: {
        cartData: JSON.stringify(cart),
        total: totalPrice,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Utama */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>
          🛍️ THRIFTKASIR - Dashboard Customer (Cloud + API)
        </Text>
      </View>

      <View style={styles.mainContent}>
        {/* Banner Promo */}
        <View style={styles.blueBanner}>
          <Text style={styles.blueBannerTitle}>
            Katalog Pakaian Thrift Online
          </Text>
          <Text style={styles.blueBannerSub}>{promoMessage}</Text>
        </View>

        {/* Kondisi Jika Loading / Data Belum Muncul */}
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#006aff" />
            <Text
              style={{ marginTop: 10, color: "#64748b", fontWeight: "bold" }}
            >
              Menyinkronkan katalog Cloud & API Server...
            </Text>
          </View>
        ) : (
          /* List Gabungan Produk Cloud + API */
          <FlatList
            data={products}
            keyExtractor={(item) => `${item.source}-${item.id}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.productCard,
                  item.source === "cloud" && styles.cloudCardHighlight,
                ]}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.productTitle}>{item.title}</Text>
                  </View>

                  <Text style={styles.productSub}>
                    Kat: {item.category} | Size: {item.size}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>
                      Rp {item.price.toLocaleString("id-ID")}
                    </Text>
                    <View
                      style={[
                        styles.sourceBadge,
                        item.source === "cloud"
                          ? styles.cloudBadge
                          : styles.apiBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.sourceBadgeText,
                          item.source === "cloud"
                            ? styles.cloudBadgeText
                            : styles.apiBadgeText,
                        ]}
                      >
                        {item.source === "cloud"
                          ? "☁️ Cloud Stok"
                          : "🌐 API Supplier"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    style={styles.detailBtn}
                    onPress={() =>
                      router.push({
                        pathname: `/detail/${item.id}`,
                        params: {
                          title: item.title,
                          price: item.price,
                          category: item.category,
                          size: item.size,
                          material: item.material,
                          condition: item.condition,
                        },
                      })
                    }
                  >
                    <Text style={styles.btnText}>Detail</Text>
                  </Pressable>
                  <Pressable
                    style={styles.addBtn}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={styles.btnText}>+ Kasir</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}

        {/* Bottom Cart Bar */}
        <View style={styles.bottomCartBar}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text
              style={{ fontSize: 14, fontWeight: "bold", color: "#0f172a" }}
            >
              Item Terpilih: {cart.length} pcs
            </Text>
            <Text
              style={{ fontSize: 17, fontWeight: "bold", color: "#16a34a" }}
            >
              Rp {totalPrice.toLocaleString("id-ID")}
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            <Pressable
              style={[
                styles.actionBtn,
                { backgroundColor: "#16a34a" },
                cart.length === 0 && { backgroundColor: "#cbd5e1" },
              ]}
              disabled={cart.length === 0}
              onPress={handleCheckout}
            >
              <Text style={styles.actionBtnText}>
                {cart.length > 0
                  ? "Proses Transaksi Kasir →"
                  : "Pilih Barang Dulu"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#334155" }]}
              onPress={() => router.push("/")}
            >
              <Text style={styles.actionBtnText}>← Kembali Ke Menu Utama</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerBar: {
    backgroundColor: "#0b1329",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 15, fontWeight: "bold", color: "#ffffff" },
  mainContent: { flex: 1, padding: 16 },
  blueBanner: {
    backgroundColor: "#0b1329",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  blueBannerTitle: { fontSize: 17, fontWeight: "bold", color: "#ffffff" },
  blueBannerSub: { fontSize: 12, color: "#38bdf8", marginTop: 2 },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  productCard: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cloudCardHighlight: {
    borderColor: "#93c5fd",
    backgroundColor: "#f8fbff",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  productTitle: { fontWeight: "bold", fontSize: 14, color: "#0f172a" },
  productSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 8,
    flexWrap: "wrap",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16a34a",
  },
  sourceBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  cloudBadge: {
    backgroundColor: "#dbeafe",
  },
  apiBadge: {
    backgroundColor: "#f1f5f9",
  },
  sourceBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  cloudBadgeText: {
    color: "#1d4ed8",
  },
  apiBadgeText: {
    color: "#475569",
  },
  detailBtn: {
    backgroundColor: "#006aff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  addBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  btnText: { color: "#ffffff", fontWeight: "bold", fontSize: 12 },
  bottomCartBar: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#006aff",
    marginTop: 8,
  },
  actionBtn: { paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  actionBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 13 },
});
