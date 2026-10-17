import { globalStyles } from '@/constants/styles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function DetailScreen() {
    const router = useRouter();
    const { id, title, price, category, size, material, condition } = useLocalSearchParams();

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.headerBanner}>
                <Text style={globalStyles.headerTitle}>Detail Produk Thrift #{id}</Text>
                <Text style={globalStyles.headerSubtitle}>Spesifikasi lengkap & kondisi barang bekas berkualitas</Text>
            </View>

            <View style={[globalStyles.card, { flexDirection: 'column', alignItems: 'stretch', padding: 18, gap: 12 }]}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f172a' }}>{title}</Text>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#16a34a' }}>
                    Rp {Number(price || 0).toLocaleString('id-ID')}
                </Text>

                <View style={{ height: 1, backgroundColor: '#e2e8f0', marginVertical: 4 }} />

                <View style={{ gap: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#64748b', fontWeight: '600' }}>Kategori Pakaian:</Text>
                        <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{category || 'Pakaian'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#64748b', fontWeight: '600' }}>Ukuran Tag (Size):</Text>
                        <Text style={{ fontWeight: 'bold', color: '#2563eb', fontSize: 16 }}>{size || 'L'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#64748b', fontWeight: '600' }}>Bahan / Material Utama:</Text>
                        <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{material || 'Katun Original'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#64748b', fontWeight: '600' }}>Kondisi Barang (Grade):</Text>
                        <Text style={{ fontWeight: 'bold', color: '#d97706' }}>{condition || 'Grade A'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#64748b', fontWeight: '600' }}>Status Kebersihan:</Text>
                        <Text style={{ fontWeight: 'bold', color: '#16a34a' }}>✓ Lolos QC & Laundry Hygienic</Text>
                    </View>
                </View>

                <View style={{ height: 1, backgroundColor: '#e2e8f0', marginVertical: 4 }} />

                <View style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' }}>
                    <Text style={{ fontWeight: 'bold', color: '#334155', marginBottom: 4 }}>📌 Catatan Transaksi Kasir:</Text>
                    <Text style={{ fontSize: 12, color: '#475569', lineHeight: 18 }}>
                        • Barang thrifting bersifat unik (stok hanya 1 pcs per artikel).
                        {"\n"}• Pastikan kondisi barang sudah dicek fisik bersama pembeli sebelum melakukan pembayaran di kasir.
                    </Text>
                </View>
            </View>

            <Pressable
                style={[globalStyles.button, { marginTop: 15, paddingVertical: 14, marginBottom: 30 }]}
                onPress={() => router.back()}>
                <Text style={[globalStyles.buttonText, { textAlign: 'center', fontSize: 15 }]}>
                    ← Kembali ke Katalog Kasir
                </Text>
            </Pressable>
        </ScrollView>
    );
}