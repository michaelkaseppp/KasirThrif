import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SHIFT_PIN_KEY = "thriftkasir_shift_pin";

interface ShiftPinVaultProps {
  visible: boolean;
  onClose: () => void;
  kasirName: string;
}

async function getStoredPin(): Promise<string | null> {
  if (Platform.OS === "web") {
    return typeof localStorage !== "undefined"
      ? localStorage.getItem(SHIFT_PIN_KEY)
      : null;
  }
  return SecureStore.getItemAsync(SHIFT_PIN_KEY);
}

async function setStoredPin(value: string): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(SHIFT_PIN_KEY, value);
    }
    return;
  }
  await SecureStore.setItemAsync(SHIFT_PIN_KEY, value);
}

async function deleteStoredPin(): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(SHIFT_PIN_KEY);
    }
    return;
  }
  await SecureStore.deleteItemAsync(SHIFT_PIN_KEY);
}

/**
 * Full-screen shift lock modal backed by hardware-encrypted expo-secure-store
 * (with a localStorage fallback when running on web).
 */
export default function ShiftPinVault({
  visible,
  onClose,
  kasirName,
}: ShiftPinVaultProps) {
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (visible) {
      loadSavedPin();
    }
  }, [visible]);

  const loadSavedPin = async () => {
    setChecking(true);
    setPinInput("");
    try {
      const existing = await getStoredPin();
      setSavedPin(existing);
    } catch (error: any) {
      console.error("Gagal membaca SecureStore PIN:", error);
      Alert.alert(
        "Gagal Membaca PIN",
        error?.message || "Tidak dapat mengakses brankas PIN perangkat.",
      );
    } finally {
      setChecking(false);
    }
  };

  const handleCreatePin = async () => {
    const cleanPin = pinInput.trim();
    if (cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      Alert.alert(
        "Format PIN Salah",
        "Masukkan tepat 4 digit angka (contoh: 1234).",
      );
      return;
    }

    try {
      await setStoredPin(cleanPin);
      setSavedPin(cleanPin);
      setPinInput("");
      Alert.alert(
        "Layar Terkunci",
        "PIN Shift berhasil dienkripsi di SecureStore.",
      );
    } catch (error: any) {
      Alert.alert(
        "Gagal Menyimpan PIN",
        error?.message || "Terjadi kesalahan saat menyimpan PIN.",
      );
    }
  };

  const handleUnlock = () => {
    try {
      if (pinInput.trim() === savedPin) {
        setPinInput("");
        onClose();
      } else {
        Alert.alert("PIN Salah", "PIN tidak cocok dengan brankas perangkat.");
        setPinInput("");
      }
    } catch (error: any) {
      Alert.alert(
        "Gagal Membuka Kunci",
        error?.message || "Terjadi kesalahan saat memverifikasi PIN.",
      );
    }
  };

  const handleResetPin = async () => {
    if (pinInput.trim() !== savedPin) {
      Alert.alert(
        "Verifikasi Dulu",
        "Masukkan PIN lama yang benar di kolom atas sebelum menghapus PIN.",
      );
      return;
    }

    try {
      await deleteStoredPin();
      setSavedPin(null);
      setPinInput("");
      Alert.alert("PIN Dihapus", "PIN Shift telah dihapus dari SecureStore.");
    } catch (error: any) {
      Alert.alert(
        "Gagal Menghapus PIN",
        error?.message || "Terjadi kesalahan saat menghapus PIN.",
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={() => {
        if (!savedPin) onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.title}>
            {savedPin ? "SHIFT KASIR TERKUNCI" : "ATUR PIN SHIFT KASIR"}
          </Text>
          <Text style={styles.badge}>EXPO SECURE-STORE VAULT</Text>

          <Text style={styles.subtitle}>
            {savedPin
              ? `Kasir aktif: ${kasirName}\nMasukkan 4 digit PIN untuk melanjutkan transaksi.`
              : "Buat 4 digit PIN sementara untuk mengunci mesin kasir saat istirahat."}
          </Text>

          {!checking && (
            <>
              <TextInput
                style={styles.pinInput}
                value={pinInput}
                onChangeText={setPinInput}
                placeholder="• • • •"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />

              {savedPin ? (
                <>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleUnlock}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryBtnText}>
                      Buka Kunci Kasir →
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={handleResetPin}
                  >
                    <Text style={styles.resetBtnText}>
                      Hapus PIN dari Perangkat
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleCreatePin}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryBtnText}>
                      Simpan PIN & Kunci Layar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.resetBtn} onPress={onClose}>
                    <Text style={styles.resetBtnText}>Batal</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    width: "100%",
    maxWidth: 380,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  lockIcon: {
    fontSize: 38,
    marginBottom: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  badge: {
    color: "#38bdf8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 4,
    marginBottom: 12,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 18,
  },
  pinInput: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    width: "70%",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#2563eb",
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  resetBtn: {
    marginTop: 14,
    paddingVertical: 6,
  },
  resetBtnText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
});
