import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export interface ThriftItem {
  id: string;
  title: string;
  category: string;
  price: number;
  size: string;
  material: string;
  condition: string;
}

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [products, setProducts] = useState<ThriftItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSupplier, setLoadingSupplier] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");

  // 1. READ (SELECT) DARI SUPABASE DENGAN PROTEKSI RLS
  const fetchCloudCatalog = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("thrift_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      Alert.alert("Gagal Memuat Katalog", err.message);
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCloudCatalog();
  }, [fetchCloudCatalog]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCloudCatalog();
  };

  // 2. CREATE (INSERT) BARANG THRIFT KE SUPABASE
  const handleAddProduct = async () => {
    if (!title.trim() || !category.trim() || !price.trim() || !size.trim()) {
      Alert.alert(
        "Input Tidak Lengkap",
        "Isi nama barang, kategori, harga, dan ukuran.",
      );
      return;
    }

    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    if (numericPrice <= 0) {
      Alert.alert("Harga Tidak Valid", "Masukkan nominal harga dalam Rupiah.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("thrift_items").insert([
        {
          user_id: user?.id,
          title: title.trim(),
          category: category.trim(),
          price: numericPrice,
          size: size.trim().toUpperCase(),
          material: "Cotton Premium",
          condition: "Grade A",
        },
      ]);

      if (error) throw error;

      setTitle("");
      setCategory("");
      setPrice("");
      setSize("");
      fetchCloudCatalog();
      Alert.alert("Berhasil", "Barang thrift tersimpan ke Cloud Catalog!");
    } catch (err: any) {
      Alert.alert("Gagal Menyimpan", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // IMPORT SUPPLIER API (MODUL 3) -> LANGSUNG SIMPAN KE CLOUD SUPABASE
  const handleImportSupplier = async () => {
    setLoadingSupplier(true);
    try {
      const response = await fetch(
        "https://dummyjson.com/products/category/mens-shirts?limit=3",
      );
      const json = await response.json();

      const mappedItems = (json.products || []).map((item: any) => ({
        user_id: user?.id,
        title: item.title,
        category: "Import Thrift",
        price: Math.round((item.price || 20) * 15000),
        size: "L",
        material: "Cotton Import",
        condition: "Grade A",
      }));

      const { error } = await supabase.from("thrift_items").insert(mappedItems);
      if (error) throw error;

      fetchCloudCatalog();
      Alert.alert(
        "Import Berhasil",
        `${mappedItems.length} stok supplier masuk ke database cloud!`,
      );
    } catch (err: any) {
      Alert.alert(
        "Error Supplier API",
        err.message || "Gagal mengambil data supplier.",
      );
    } finally {
      setLoadingSupplier(false);
    }
  };

  // 3. UPDATE KONDISI GRADE BARANG (OPTIMISTIC UI + RLS)
  const handleToggleCondition = async (item: ThriftItem) => {
    const nextCondition =
      item.condition === "Grade A" ? "Grade B (Promo)" : "Grade A";

    setProducts((prev) =>
      prev.map((p) =>
        p.id === item.id ? { ...p, condition: nextCondition } : p,
      ),
    );

    try {
      const { error } = await supabase
        .from("thrift_items")
        .update({ condition: nextCondition })
        .eq("id", item.id);

      if (error) throw error;
    } catch (err: any) {
      Alert.alert("Gagal Update Grade", err.message);
      fetchCloudCatalog();
    }
  };

  // 4. DELETE BARANG DARI CLOUD SUPABASE
  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));

    try {
      const { error } = await supabase
        .from("thrift_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      Alert.alert("Gagal Menghapus", err.message);
      fetchCloudCatalog();
    }
  };

  return (
    <View style={styles.screen}>
      {/* HEADER CRIMSON */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          ⚙️ Dashboard Admin (Cloud RLS & API)
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* TOMBOL IMPORT SUPPLIER API */}
        <TouchableOpacity
          style={styles.supplierBtn}
          onPress={handleImportSupplier}
          disabled={loadingSupplier}
          activeOpacity={0.85}
        >
          {loadingSupplier ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.supplierBtnText}>
              🌐 Import Stok dari Supplier API (Async/Await)
            </Text>
          )}
        </TouchableOpacity>

        {/* FORM TAMBAH BARANG */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>+ Tambah Barang Thrift Baru</Text>

          <TextInput
            style={styles.input}
            placeholder="Nama Barang (mis. Jaket Vintage 90s)"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Kategori (Outerwear / T-Shirt / Pants)"
            placeholderTextColor="#94a3b8"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Harga (Rp)"
            placeholderTextColor="#94a3b8"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Ukuran (S / M / L / XL)"
            placeholderTextColor="#94a3b8"
            value={size}
            onChangeText={setSize}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={[styles.addBtn, submitting && { opacity: 0.6 }]}
            onPress={handleAddProduct}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.addBtnText}>+ Tambah Ke Katalog Cloud</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* DAFTAR STOK KATALOG */}
        <Text style={styles.sectionTitle}>
          Stok Katalog Cloud ({products.length} Items)
        </Text>

        {loadingList ? (
          <ActivityIndicator
            size="small"
            color="#e11d48"
            style={{ marginVertical: 20 }}
          />
        ) : products.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Belum ada stok untuk akun kasir ini. Tambahkan barang di atas atau
              import dari Supplier API.
            </Text>
          </View>
        ) : (
          products.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMeta}>
                  {item.category} | Size: {item.size}
                </Text>

                <View style={styles.priceGradeRow}>
                  <Text style={styles.itemPrice}>
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.gradeBadge,
                      item.condition === "Grade A"
                        ? styles.gradeA
                        : styles.gradeB,
                    ]}
                    onPress={() => handleToggleCondition(item)}
                  >
                    <Text style={styles.gradeText}>{item.condition} ↻</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteProduct(item.id)}
              >
                <Text style={styles.deleteBtnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* KEMBALI KE MENU UTAMA */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/" as any)}
        >
          <Text style={styles.backBtnText}>← Kembali Ke Menu Utama</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    backgroundColor: "#9f1239",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  supplierBtn: {
    backgroundColor: "#0284c7",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  supplierBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: "#e11d48",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  addBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 14,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  itemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800",
  },
  itemMeta: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  priceGradeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  itemPrice: {
    color: "#16a34a",
    fontSize: 14,
    fontWeight: "800",
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradeA: {
    backgroundColor: "#dbeafe",
  },
  gradeB: {
    backgroundColor: "#fef3c7",
  },
  gradeText: {
    color: "#1e293b",
    fontSize: 11,
    fontWeight: "700",
  },
  deleteBtn: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  backBtn: {
    backgroundColor: "#334155",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  backBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
