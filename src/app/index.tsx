import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ShiftPinVault from "../components/ShiftPinVault";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [pinModalVisible, setPinModalVisible] = useState(false);

  const kasirName =
    user?.user_metadata?.callsign ||
    user?.email?.split("@")[0] ||
    "Kasir Aktif";

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* BAR SESI KASIR AKTIF + KUNCI PIN + SIGN OUT */}
        <View style={styles.sessionBar}>
          <View style={styles.sessionInfo}>
            <View style={styles.onlineDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionName} numberOfLines={1}>
                {kasirName}
              </Text>
              <Text style={styles.sessionEmail} numberOfLines={1}>
                {user?.email}
              </Text>
            </View>
          </View>

          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.pinBtn}
              onPress={() => setPinModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.pinText}>🔒 PIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={signOut}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGO & JUDUL UTAMA */}
        <Text style={styles.title}>🛍️ THRIFTKASIR</Text>
        <Text style={styles.subtitle}>
          Sistem Kasir & Manajemen Toko Thrift
        </Text>

        {/* TOMBOL CUSTOMER / KASIR */}
        <TouchableOpacity
          style={styles.customerBtn}
          onPress={() => router.push("/customer" as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnIcon}>🛒</Text>
          <Text style={styles.btnTitle}>Customer / Kasir</Text>
          <Text style={styles.btnDesc}>
            Katalog belanja, tambah keranjang & transaksi
          </Text>
        </TouchableOpacity>

        {/* TOMBOL ADMIN MODE */}
        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => router.push("/admin" as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnIcon}>⚙️</Text>
          <Text style={styles.btnTitle}>Admin Mode</Text>
          <Text style={styles.btnDesc}>
            Kelola stok pakaian thrift (Cloud RLS) & hapus barang
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL SHIFT PIN VAULT (SECURE STORE) */}
      <ShiftPinVault
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        kasirName={kasirName}
      />
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
    backgroundColor: "#1e293b",
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#334155",
  },
  sessionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 20,
  },
  sessionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 8,
  },
  sessionName: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "800",
  },
  sessionEmail: {
    color: "#94a3b8",
    fontSize: 11,
  },
  actionGroup: {
    flexDirection: "row",
    gap: 6,
  },
  pinBtn: {
    backgroundColor: "#1d4ed8",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pinText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  logoutBtn: {
    backgroundColor: "#334155",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: "#f87171",
    fontSize: 11,
    fontWeight: "700",
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 22,
  },
  customerBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    marginBottom: 14,
  },
  adminBtn: {
    backgroundColor: "#e11d48",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
  },
  btnIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  btnTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  btnDesc: {
    color: "#e2e8f0",
    fontSize: 12,
    textAlign: "center",
  },
});
