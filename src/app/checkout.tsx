import { globalStyles } from '@/constants/styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const { count, total } = useLocalSearchParams();

  const handleFinishTransaction = () => {
    Alert.alert('Transaksi Berhasil', 'Data transaksi kasir berhasil disalin!');
    router.replace('/');
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerBanner}>
        <Text style={globalStyles.headerTitle}>Rincian Pembayaran</Text>
        <Text style={globalStyles.headerSubtitle}>Konfirmasi akhir sebelum mencetak struk</Text>
      </View>

      <View style={[globalStyles.card, { flexDirection: 'column', alignItems: 'stretch', padding: 18, gap: 10 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#64748b' }}>Jumlah Pakaian Thrift:</Text>
          <Text style={{ fontWeight: 'bold', color: '#0f172a' }}>{count} Pcs</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#e2e8f0', paddingTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}>Total Tagihan:</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#16a34a' }}>
            Rp {Number(total || 0).toLocaleString('id-ID')}
          </Text>
        </View>
      </View>

      <View style={{ gap: 10, marginTop: 20 }}>
        <Pressable style={[globalStyles.button, { backgroundColor: '#16a34a', paddingVertical: 12 }]} onPress={handleFinishTransaction}>
          <Text style={[globalStyles.buttonText, { textAlign: 'center', fontSize: 15 }]}>Selesaikan & Cetak Struk</Text>
        </Pressable>

        <Pressable style={[globalStyles.button, { backgroundColor: '#dc2626', paddingVertical: 12 }]} onPress={() => router.back()}>
          <Text style={[globalStyles.buttonText, { textAlign: 'center', fontSize: 15 }]}>← Batal / Tambah Barang</Text>
        </Pressable>
      </View>
    </View>
  );
}