import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export interface ThriftItem {
  id: string;
  title: string;
  category: string;
  price: number;
  size: string;
  material: string;
  condition: string;
}

export const INITIAL_PRODUCTS: ThriftItem[] = [
  {
    id: "1",
    title: "Jaket Denim Vintage 90s",
    category: "Outerwear",
    price: 150000,
    size: "L",
    material: "Heavy Denim 14oz",
    condition: "Grade A (No Minus)",
  },
  {
    id: "2",
    title: "Kaos Band Oversize Original",
    category: "T-Shirt",
    price: 85000,
    size: "XL",
    material: "100% Cotton Combed",
    condition: "Grade A (Faded Vintage Look)",
  },
  {
    id: "3",
    title: "Celana Corduroy Cargo",
    category: "Pants",
    price: 120000,
    size: "32",
    material: "Corduroy Velvet",
    condition: "Grade A (Kancing & Resleting Aman)",
  },
  {
    id: "4",
    title: "Sweater Hoodie Thrift JP",
    category: "Sweater",
    price: 95000,
    size: "M",
    material: "Fleece Heavyweight",
    condition: "Grade A (Bulu halus & Tag Lengkap)",
  },
  {
    id: "5",
    title: "Kemeja Flanel Uniqlo Second",
    category: "Shirt",
    price: 75000,
    size: "L",
    material: "Flannel Cotton",
    condition: "Grade B+ (Warna pekat)",
  },
  {
    id: "6",
    title: "Workjacket Carhartt Style",
    category: "Outerwear",
    price: 210000,
    size: "XL",
    material: "Duck Canvas",
    condition: "Grade A+ (Mulus)",
  },
  {
    id: "7",
    title: "Vest Rompi Tactical Army",
    category: "Vest",
    price: 65000,
    size: "All Size",
    material: "Ripstop Nylon",
    condition: "Grade A (Banyak Saku)",
  },
  {
    id: "8",
    title: "Celana Jeans Levis 501 Second",
    category: "Jeans",
    price: 180000,
    size: "34",
    material: "Rigid Denim",
    condition: "Grade A (Button Fly Aman)",
  },
  {
    id: "9",
    title: "Varsity Jacket Leather Sleeve",
    category: "Outerwear",
    price: 250000,
    size: "L",
    material: "Wool & Faux Leather",
    condition: "Grade A (Rib Kencang)",
  },
  {
    id: "10",
    title: "Kaos Graphic Anime Retro",
    category: "T-Shirt",
    price: 70000,
    size: "M",
    material: "Cotton Combed 30s",
    condition: "Grade B+ (Print Mulus)",
  },
  {
    id: "11",
    title: "Trench Coat Formal Beige",
    category: "Outerwear",
    price: 220000,
    size: "L",
    material: "Gabardine Cotton",
    condition: "Grade A (Kancing Lengkap)",
  },
  {
    id: "12",
    title: "Celana Chino Slimfit Dickies",
    category: "Pants",
    price: 135000,
    size: "30",
    material: "Twill Cotton",
    condition: "Grade A (Warna Pekat)",
  },
  {
    id: "13",
    title: "Sweater Crewneck Champion",
    category: "Sweater",
    price: 110000,
    size: "L",
    material: "Cotton Fleece",
    condition: "Grade A (Logo Bordir Clean)",
  },
  {
    id: "14",
    title: "Kemeja Hawaii Motif Floral",
    category: "Shirt",
    price: 68000,
    size: "M",
    material: "Rayon Viscose",
    condition: "Grade A (Adem & Lembut)",
  },
  {
    id: "15",
    title: "Jaket Windbreaker Nike Vintage",
    category: "Outerwear",
    price: 125000,
    size: "L",
    material: "Micro Polyester",
    condition: "Grade A (Zipper Smooth)",
  },
  {
    id: "16",
    title: "Kaos Stripe Horizontal Retro",
    category: "T-Shirt",
    price: 60000,
    size: "S",
    material: "Cotton Interlock",
    condition: "Grade B (Warna Khas)",
  },
  {
    id: "17",
    title: "Celana Jogger Fleece Adidas",
    category: "Pants",
    price: 90000,
    size: "M",
    material: "Fleece Blend",
    condition: "Grade A (Karet Pinggang Kencang)",
  },
  {
    id: "18",
    title: "Jaket Tracktop Puma Classic",
    category: "Outerwear",
    price: 115000,
    size: "M",
    material: "Polyester Tricot",
    condition: "Grade A (Full Tag)",
  },
];

export default function CustomerScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<ThriftItem[]>([]);

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
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>
          🛍️ THRIFTKASIR - Dashboard Customer
        </Text>
      </View>

      <View style={styles.mainContent}>
        {/* Banner Katalog */}
        <View style={styles.blueBanner}>
          <Text style={styles.blueBannerTitle}>Katalog Pakaian Thrift</Text>
          <Text style={styles.blueBannerSub}>
            Pilih item thrift siap pakai untuk dimasukkan ke kasir
          </Text>
        </View>

        {/* List Produk */}
        <FlatList
          data={INITIAL_PRODUCTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productSub}>
                  Kat: {item.category} | Size: {item.size}
                </Text>
                <Text style={styles.productPrice}>
                  Rp {item.price.toLocaleString("id-ID")}
                </Text>
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
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
  mainContent: { flex: 1, padding: 16 },
  blueBanner: {
    backgroundColor: "#0b1329",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  blueBannerTitle: { fontSize: 17, fontWeight: "bold", color: "#ffffff" },
  blueBannerSub: { fontSize: 12, color: "#38bdf8", marginTop: 2 },
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
