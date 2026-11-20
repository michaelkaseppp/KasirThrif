import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function KasirLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kasirName, setKasirName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = kasirName.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert(
        "Data Belum Lengkap",
        "Masukkan email dan password akun kasir.",
      );
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert(
        "Password Terlalu Pendek",
        "Password minimal terdiri dari 6 karakter.",
      );
      return;
    }

    if (isRegistering && !cleanName) {
      Alert.alert(
        "Nama Kasir Kosong",
        "Masukkan nama kasir atau nama cabang toko thrift.",
      );
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              callsign: cleanName,
              role: "kasir_admin",
            },
          },
        });

        if (error) {
          Alert.alert("Registrasi Gagal", error.message);
        } else {
          Alert.alert(
            "Akun Kasir Terdaftar!",
            "Silakan masuk menggunakan email dan password yang baru didaftarkan.",
          );
          setIsRegistering(false);
          setPassword("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          Alert.alert("Akses Ditolak", error.message);
        } else {
          router.replace("/" as any);
        }
      }
    } catch (err: any) {
      Alert.alert(
        "Gangguan Koneksi",
        "Gagal terhubung ke server autentikasi Supabase.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.brandHeader}>
            <Text style={styles.brandTitle}>🛍️ THRIFTKASIR</Text>
            <Text style={styles.brandBadge}>SECURE POS AUTHENTICATION</Text>
            <Text style={styles.brandSubtitle}>
              {isRegistering
                ? "Daftarkan akun kasir/admin baru untuk mengelola katalog cloud"
                : "Masuk untuk mengakses sistem kasir & katalog toko thrift"}
            </Text>
          </View>

          {isRegistering && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NAMA KASIR / CABANG</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Mekell - Malang HQ"
                placeholderTextColor="#64748b"
                value={kasirName}
                onChangeText={setKasirName}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL KASIR</Text>
            <TextInput
              style={styles.input}
              placeholder="kasir@thriftstore.id"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD AKSES</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimal 6 karakter..."
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {isRegistering
                  ? "Daftarkan Akun Kasir"
                  : "Masuk ke Sistem Kasir →"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            <Text style={styles.switchText}>
              {isRegistering
                ? "Sudah punya akun kasir? Masuk di sini"
                : "Belum punya akun kasir? Daftar baru di sini"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#334155",
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  brandHeader: {
    alignItems: "center",
    marginBottom: 22,
  },
  brandTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  brandBadge: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 4,
    marginBottom: 8,
  },
  brandSubtitle: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  switchBtn: {
    marginTop: 14,
    paddingVertical: 8,
    alignItems: "center",
  },
  switchText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
});
