import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const cartItems = params.cartData
    ? JSON.parse(params.cartData as string)
    : [];
  const total = Number(params.total) || 0;
  const [isReceiptPrinted, setIsReceiptPrinted] = useState(false);

  if (isReceiptPrinted) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#0b1329", padding: 20 }}>
        <View style={styles.receiptPaper}>
          <Text style={styles.storeTitle}>🛍️ THRIFTKASIR STORE</Text>
          <Text style={styles.storeSub}>
            Official Thrift Store Kasir System
          </Text>
          <Text style={styles.receiptLine}>
            ------------------------------------------
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>No. Transaksi:</Text>
            <Text style={styles.infoValBold}>
              TK-{Math.floor(100000 + Math.random() * 900000)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Waktu:</Text>
            <Text style={styles.infoValBold}>
              {new Date().toLocaleString("id-ID")}
            </Text>
          </View>
          <Text style={styles.receiptLine}>
            ------------------------------------------
          </Text>

          <Text style={{ fontSize: 12, fontWeight: "bold", marginVertical: 6 }}>
            RINCIAN ITEM BELANJA
          </Text>
          {cartItems.map((item: any, idx: number) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <View>
                <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 11, color: "#64748b" }}>
                  Size: {item.size} | Kat: {item.category}
                </Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                Rp {item.price.toLocaleString("id-ID")}
              </Text>
            </View>
          ))}

          <Text style={styles.receiptLine}>
            ------------------------------------------
          </Text>

          <View style={styles.infoRow}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              TOTAL BAYAR:
            </Text>
            <Text
              style={{ fontSize: 15, fontWeight: "bold", color: "#16a34a" }}
            >
              Rp {total.toLocaleString("id-ID")}
            </Text>
          </View>

          <Text style={styles.receiptLine}>
            ------------------------------------------
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              color: "#64748b",
              marginTop: 4,
            }}
          >
            *** TERIMA KASIH ***
          </Text>
          <Text style={{ fontSize: 10, textAlign: "center", color: "#64748b" }}>
            Barang thrift yang sudah dibeli tidak dapat ditukar/dikembalikan.
          </Text>
        </View>

        <Pressable
          style={[
            styles.checkoutBtn,
            { backgroundColor: "#16a34a", marginTop: 16, marginBottom: 40 },
          ]}
          onPress={() => router.push("/customer")}
        >
          <Text style={styles.checkoutBtnText}>✓ Selesai & Transaksi Baru</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>💳 Ringkasan Pembayaran</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.blueBanner}>
          <Text style={styles.blueBannerTitle}>Rincian Pembayaran</Text>
          <Text style={styles.blueBannerSub}>
            Konfirmasi akhir sebelum mencetak struk
          </Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Jumlah Pakaian Thrift:</Text>
            <Text style={styles.infoValBold}>{cartItems.length} Pcs</Text>
          </View>
          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <Text
              style={{ fontSize: 15, fontWeight: "bold", color: "#0f172a" }}
            >
              Total Tagihan:
            </Text>
            <Text
              style={{ fontSize: 17, fontWeight: "bold", color: "#16a34a" }}
            >
              Rp {total.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20, gap: 10 }}>
          <Pressable
            style={[styles.checkoutBtn, { backgroundColor: "#16a34a" }]}
            onPress={() => setIsReceiptPrinted(true)}
          >
            <Text style={styles.checkoutBtnText}>Selesaikan & Cetak Struk</Text>
          </Pressable>

          <Pressable
            style={[styles.checkoutBtn, { backgroundColor: "#dc2626" }]}
            onPress={() => router.back()}
          >
            <Text style={styles.checkoutBtnText}>← Batal / Tambah Barang</Text>
          </Pressable>
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
    marginBottom: 14,
  },
  blueBannerTitle: { fontSize: 17, fontWeight: "bold", color: "#ffffff" },
  blueBannerSub: { fontSize: 12, color: "#38bdf8", marginTop: 2 },
  detailCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  infoLabel: { fontSize: 13, color: "#64748b" },
  infoValBold: { fontSize: 13, fontWeight: "bold", color: "#0f172a" },
  checkoutBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  receiptPaper: { backgroundColor: "#ffffff", padding: 20, borderRadius: 8 },
  storeTitle: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0f172a",
  },
  storeSub: { fontSize: 11, textAlign: "center", color: "#64748b" },
  receiptLine: { textAlign: "center", color: "#94a3b8", marginVertical: 4 },
});
