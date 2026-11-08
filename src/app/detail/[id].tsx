import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = (params.title as string) || "Jaket Denim Vintage 90s";
  const price = Number(params.price) || 150000;
  const category = (params.category as string) || "Outerwear";
  const size = (params.size as string) || "L";
  const material = (params.material as string) || "Heavy Denim 14oz";
  const condition = (params.condition as string) || "Grade A (No Minus)";

  return (
    <View style={styles.container}>
      {/* Header Top */}
      <View style={styles.headerBanner}>
        <Pressable onPress={() => router.back()} style={styles.navBackBtn}>
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>🔍 Detail Item Thrifting</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Title Box */}
        <View style={styles.bannerBox}>
          <Text style={styles.bannerTitle}>
            Detail Produk Thrift #{params.id || "1"}
          </Text>
          <Text style={styles.bannerSub}>
            Spesifikasi lengkap & kondisi barang bekas berkualitas
          </Text>
        </View>

        {/* Card Main Info */}
        <View style={styles.mainCard}>
          <Text style={styles.productTitle}>{title}</Text>
          <Text style={styles.productPrice}>
            Rp {price.toLocaleString("id-ID")}
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kategori Pakaian:</Text>
            <Text style={styles.infoValueBold}>{category}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ukuran Tag (Size):</Text>
            <Text style={styles.infoValueBold}>{size}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bahan / Material Utama:</Text>
            <Text style={styles.infoValueBold}>{material}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Kondisi Barang (Grade):</Text>
            <Text style={styles.gradeText}>{condition}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status Kebersihan:</Text>
            <Text style={styles.qcText}>✓ Lolos QC & Laundry Hygienic</Text>
          </View>

          {/* Note Box */}
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>📌 Catatan Transaksi Kasir:</Text>
            <Text style={styles.noteDesc}>
              • Barang thrifting bersifat unik (stok hanya 1 pcs per artikel).
              {"\n"}• Pastikan kondisi barang sudah dicek fisik bersama pembeli
              sebelum melakukan pembayaran di kasir.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Button Back */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.backCatalogBtn} onPress={() => router.back()}>
          <Text style={styles.backCatalogText}>← Kembali ke Katalog Kasir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerBanner: {
    backgroundColor: "#0b1329",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navBackBtn: { paddingRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
  content: { flex: 1, padding: 16 },
  bannerBox: {
    backgroundColor: "#0b1329",
    padding: 16,
    borderRadius: 8,
    marginBottom: 14,
  },
  bannerTitle: { fontSize: 18, fontWeight: "bold", color: "#ffffff" },
  bannerSub: { fontSize: 12, color: "#38bdf8", marginTop: 4 },
  mainCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  productTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: 6,
  },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 14 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  infoLabel: { fontSize: 13, color: "#64748b" },
  infoValueBold: { fontSize: 13, fontWeight: "bold", color: "#0f172a" },
  gradeText: { fontSize: 13, fontWeight: "bold", color: "#d97706" },
  qcText: { fontSize: 13, fontWeight: "bold", color: "#16a34a" },
  noteBox: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 16,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  noteDesc: { fontSize: 11, color: "#64748b", lineHeight: 16 },
  bottomBar: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  backCatalogBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backCatalogText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
});
