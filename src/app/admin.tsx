import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { INITIAL_PRODUCTS, ThriftItem } from "./customer";

export default function AdminScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<ThriftItem[]>(INITIAL_PRODUCTS);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");

  const handleAddProduct = () => {
    if (!title || !price) return Alert.alert("Error", "Isi Nama & Harga!");
    const newItem: ThriftItem = {
      id: Date.now().toString(),
      title,
      category: category || "General",
      price: Number(price) || 0,
      size: size || "All Size",
      material: "Cotton",
      condition: "Grade A",
    };
    setProducts([newItem, ...products]);
    setTitle("");
    setCategory("");
    setPrice("");
    setSize("");
  };

  return (
    <View style={styles.container}>
      {/* Header Admin */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>⚙️ Dashboard Admin</Text>
      </View>

      <ScrollView style={styles.mainContent}>
        {/* Form Tambah Barang */}
        <View style={styles.adminForm}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              marginBottom: 10,
              color: "#0f172a",
            }}
          >
            ➕ Tambah Barang Thrift Baru
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Barang"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Kategori"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Harga (Rp)"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Ukuran (S/M/L/XL)"
            value={size}
            onChangeText={setSize}
          />

          <Pressable
            style={[styles.actionBtn, { backgroundColor: "#e11d48" }]}
            onPress={handleAddProduct}
          >
            <Text style={styles.actionBtnText}>+ Tambah Ke Katalog</Text>
          </Pressable>
        </View>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            marginVertical: 12,
            color: "#0f172a",
          }}
        >
          Stok Katalog ({products.length} Items)
        </Text>
        {products.map((item) => (
          <View key={item.id} style={[styles.productCard, { marginBottom: 8 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productSub}>
                {item.category} | Size: {item.size}
              </Text>
              <Text style={styles.productPrice}>
                Rp {item.price.toLocaleString("id-ID")}
              </Text>
            </View>
            <Pressable
              style={[styles.detailBtn, { backgroundColor: "#dc2626" }]}
              onPress={() =>
                setProducts(products.filter((p) => p.id !== item.id))
              }
            >
              <Text style={styles.btnText}>Hapus</Text>
            </Pressable>
          </View>
        ))}

        {/* Tombol Kembali ke Menu Utama ditaruh di Paling Bawah */}
        <Pressable
          style={[
            styles.actionBtn,
            { backgroundColor: "#334155", marginTop: 12, marginBottom: 30 },
          ]}
          onPress={() => router.push("/")}
        >
          <Text style={styles.actionBtnText}>← Kembali Ke Menu Utama</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerBar: {
    backgroundColor: "#881337",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
  mainContent: { flex: 1, padding: 16 },
  adminForm: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
  },
  actionBtn: { paddingVertical: 11, borderRadius: 8, alignItems: "center" },
  actionBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 13 },
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
  productTitle: { fontWeight: "bold", fontSize: 14, color: "#0f172a" },
  productSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: 4,
  },
  detailBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 6 },
  btnText: { color: "#ffffff", fontWeight: "bold", fontSize: 12 },
});
