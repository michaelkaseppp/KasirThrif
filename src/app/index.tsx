import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🛍️ THRIFTKASIR</Text>
        <Text style={styles.subtitle}>
          Sistem Kasir & Manajemen Toko Thrift
        </Text>

        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.roleBtn, styles.customerBtn]}
            onPress={() => router.push("/customer")}
          >
            <Text style={styles.roleIcon}>🛒</Text>
            <Text style={styles.roleTitle}>Customer / Kasir</Text>
            <Text style={styles.roleDesc}>
              Katalog belanja, tambah keranjang & transaksi
            </Text>
          </Pressable>

          <Pressable
            style={[styles.roleBtn, styles.adminBtn]}
            onPress={() => router.push("/admin")}
          >
            <Text style={styles.roleIcon}>⚙️</Text>
            <Text style={styles.roleTitle}>Admin Mode</Text>
            <Text style={styles.roleDesc}>
              Kelola stok pakaian thrift & hapus barang
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  logo: { fontSize: 26, fontWeight: "bold", color: "#ffffff" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginBottom: 24, marginTop: 4 },
  buttonGroup: { width: "100%", gap: 14 },
  roleBtn: { padding: 18, borderRadius: 12, alignItems: "center" },
  customerBtn: { backgroundColor: "#2563eb" },
  adminBtn: { backgroundColor: "#e11d48" },
  roleIcon: { fontSize: 28, marginBottom: 4 },
  roleTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
  roleDesc: {
    fontSize: 12,
    color: "#e2e8f0",
    marginTop: 2,
    textAlign: "center",
  },
});
