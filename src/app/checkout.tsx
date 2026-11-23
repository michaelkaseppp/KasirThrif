import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

interface CartItem {
  id: string;
  title: string;
  category: string;
  price: number;
  size: string;
}

interface CloudTransaction {
  id: string;
  receipt_no: string;
  items_summary: string;
  total_items: number;
  total_amount: number;
  created_at: string;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ cartData?: string; total?: string }>();

  const cartItems: CartItem[] = useMemo(() => {
    if (!params.cartData) return [];
    try {
      const parsed = JSON.parse(params.cartData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [params.cartData]);

  const totalAmount = Number(params.total) || 0;

  const [isPaid, setIsPaid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [receiptTime, setReceiptTime] = useState("");

  // State Riwayat Transaksi Cloud (RLS)
  const [history, setHistory] = useState<CloudTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // READ (SELECT) riwayat transaksi milik kasir aktif (terisolasi RLS)
  const fetchTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err: any) {
      console.error("Gagal memuat riwayat transaksi:", err.message);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // CREATE (INSERT) struk transaksi ke tabel transactions Supabase
  const handleCompletePayment = async () => {
    if (cartItems.length === 0) return;
    if (!user?.id) {
      Alert.alert(
        "Sesi Tidak Aktif",
        "Silakan login ulang terlebih dahulu.",
      );
      return;
    }

    const generatedNo = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowFormatted = new Date().toLocaleString("id-ID");
    const summaryText = cartItems.map((item) => item.title).join(", ");

    setSaving(true);
    try {
      const { error } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          receipt_no: generatedNo,
          items_summary: summaryText,
          total_items: cartItems.length,
          total_amount: totalAmount,
        },
      ]);

      if (error) throw error;

      setReceiptNo(generatedNo);
      setReceiptTime(nowFormatted);
      setIsPaid(true);
      fetchTransactions();
    } catch (err: any) {
      Alert.alert("Gagal Menyimpan Struk", err.message);
    } finally {
      setSaving(false);
    }
  };

  // DELETE riwayat struk (RLS)
  const handleDeleteHistory = async (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      Alert.alert("Gagal Menghapus Riwayat", err.message);
      fetchTransactions();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>
          💳 Ringkasan Pembayaran & Struk Cloud
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!isPaid ? (
          <>
            {/* Banner Pembayaran */}
            <View style={styles.navyBanner}>
              <Text style={styles.bannerTitle}>Rincian Pembayaran</Text>
              <Text style={styles.bannerSub}>
                Konfirmasi akhir sebelum mencetak & menyimpan struk ke Cloud
              </Text>
            </View>

            {/* Ringkasan Keranjang */}
            <View style={styles.summaryCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.mutedLabel}>Jumlah Pakaian Thrift:</Text>
                <Text style={styles.boldValue}>{cartItems.length} Pcs</Text>
              </View>

              {cartItems.map((item, idx) => (
                <View key={`${item.id}-${idx}`} style={styles.itemLine}>
                  <Text style={styles.itemLineText} numberOfLines={1}>
                    • {item.title} ({item.size})
                  </Text>
                  <Text style={styles.itemLinePrice}>
                    Rp {item.price.toLocaleString("id-ID")}
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.rowBetween}>
                <Text style={styles.totalLabel}>Total Tagihan:</Text>
                <Text style={styles.totalValue}>
                  Rp {totalAmount.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>

            <Pressable
              style={[
                styles.greenBtn,
                (cartItems.length === 0 || saving) && { opacity: 0.6 },
              ]}
              disabled={cartItems.length === 0 || saving}
              onPress={handleCompletePayment}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.btnText}>
                  Selesai & Cetak Struk (Simpan Cloud)
                </Text>
              )}
            </Pressable>

            <Pressable
              style={styles.redBtn}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/customer");
                }
              }}
            >
              <Text style={styles.btnText}>← Batal / Tambah Barang</Text>
            </Pressable>
          </>
        ) : (
          /* TAMPILAN STRUK DIGITAL RESMI */
          <View style={styles.receiptWrapper}>
            <View style={styles.receiptCard}>
              <Text style={styles.storeTitle}>🛍️ THRIFTKASIR STORE</Text>
              <Text style={styles.storeSub}>
                Official Thrift Store Kasir System (Cloud Verified)
              </Text>

              <View style={styles.dashedLine} />

              <View style={styles.rowBetween}>
                <Text style={styles.mutedLabel}>No. Transaksi:</Text>
                <Text style={styles.boldValue}>{receiptNo}</Text>
              </View>
              <View style={[styles.rowBetween, { marginTop: 4 }]}>
                <Text style={styles.mutedLabel}>Waktu:</Text>
                <Text style={styles.boldValue}>{receiptTime}</Text>
              </View>

              <View style={styles.dashedLine} />

              <Text style={styles.receiptSection}>RINCIAN ITEM BELANJA</Text>
              {cartItems.map((item, idx) => (
                <View key={`${item.id}-${idx}`} style={{ marginBottom: 8 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.boldValue}>{item.title}</Text>
                    <Text style={styles.boldValue}>
                      Rp {item.price.toLocaleString("id-ID")}
                    </Text>
                  </View>
                  <Text style={styles.itemMeta}>
                    Size: {item.size} | Kat: {item.category}
                  </Text>
                </View>
              ))}

              <View style={styles.dashedLine} />

              <View style={styles.rowBetween}>
                <Text style={styles.totalLabel}>TOTAL BAYAR:</Text>
                <Text style={styles.totalValue}>
                  Rp {totalAmount.toLocaleString("id-ID")}
                </Text>
              </View>

              <View style={styles.dashedLine} />

              <Text style={styles.thanksText}>*** TERIMA KASIH ***</Text>
              <Text style={styles.policyText}>
                Struk tersimpan otomatis di database cloud akun kasir Anda.
              </Text>
            </View>

            <Pressable
              style={styles.greenBtn}
              onPress={() => router.replace("/customer")}
            >
              <Text style={styles.btnText}>✓ Selesai & Transaksi Baru</Text>
            </Pressable>
          </View>
        )}

        {/* RIWAYAT TRANSAKSI CLOUD (TERISOLASI RLS PER AKUN) */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>
            📜 Riwayat Transaksi Kasir Ini ({history.length})
          </Text>
          <Text style={styles.historySub}>
            Dilindungi Row Level Security (hanya tampil untuk akun aktif)
          </Text>

          {loadingHistory ? (
            <ActivityIndicator
              size="small"
              color="#2563eb"
              style={{ marginTop: 12 }}
            />
          ) : history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>
                Belum ada riwayat transaksi tersimpan pada akun ini.
              </Text>
            </View>
          ) : (
            history.map((trx) => (
              <View key={trx.id} style={styles.historyCard}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.historyNo}>
                    {trx.receipt_no} • {trx.total_items} pcs
                  </Text>
                  <Text style={styles.historyItems} numberOfLines={1}>
                    {trx.items_summary}
                  </Text>
                  <Text style={styles.historyAmount}>
                    Rp {Number(trx.total_amount).toLocaleString("id-ID")}
                  </Text>
                </View>

                <Pressable
                  style={styles.voidBtn}
                  onPress={() => handleDeleteHistory(trx.id)}
                >
                  <Text style={styles.voidBtnText}>Hapus</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  },
  headerTitle: { color: "#ffffff", fontSize: 15, fontWeight: "bold" },
  content: { padding: 16, paddingBottom: 32 },
  navyBanner: {
    backgroundColor: "#0b1329",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
  },
  bannerTitle: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  bannerSub: { color: "#38bdf8", fontSize: 12, marginTop: 3 },
  summaryCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mutedLabel: { color: "#64748b", fontSize: 13 },
  boldValue: { color: "#0f172a", fontSize: 14, fontWeight: "bold" },
  itemLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  itemLineText: { color: "#334155", fontSize: 13, flex: 1, marginRight: 8 },
  itemLinePrice: { color: "#0f172a", fontSize: 13, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  totalLabel: { color: "#0f172a", fontSize: 16, fontWeight: "bold" },
  totalValue: { color: "#16a34a", fontSize: 18, fontWeight: "bold" },
  greenBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  redBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  receiptWrapper: {
    backgroundColor: "#0b1329",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  receiptCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },
  storeSub: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    marginTop: 2,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    borderStyle: "dashed",
    marginVertical: 12,
  },
  receiptSection: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  itemMeta: { fontSize: 11, color: "#64748b", marginTop: 2 },
  thanksText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#475569",
    fontSize: 12,
  },
  policyText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 11,
    marginTop: 4,
  },
  historySection: {
    marginTop: 18,
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  historyTitle: { fontSize: 15, fontWeight: "bold", color: "#0f172a" },
  historySub: { fontSize: 11, color: "#64748b", marginTop: 2, marginBottom: 10 },
  emptyHistory: { paddingVertical: 14, alignItems: "center" },
  emptyHistoryText: { color: "#94a3b8", fontSize: 12 },
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  historyNo: { fontSize: 13, fontWeight: "bold", color: "#0f172a" },
  historyItems: { fontSize: 12, color: "#64748b", marginTop: 2 },
  historyAmount: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: 2,
  },
  voidBtn: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  voidBtnText: { color: "#dc2626", fontSize: 11, fontWeight: "bold" },
});
