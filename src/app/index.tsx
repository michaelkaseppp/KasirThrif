import { globalStyles } from '@/constants/styles';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

export interface ThriftItem {
  id: string;
  title: string;
  category: string;
  price: number;
  size: string;
  material: string;
  condition: string;
}

const THRIFT_PRODUCTS: ThriftItem[] = [
  { id: '1', title: 'Jaket Denim Vintage 90s', category: 'Outerwear', price: 150000, size: 'L', material: 'Heavy Denim 14oz', condition: 'Grade A+ (No Minus)' },
  { id: '2', title: 'Kaos Band Oversize Original', category: 'T-Shirt', price: 85000, size: 'XL', material: '100% Cotton Combed', condition: 'Grade A (Faded Vintage Look)' },
  { id: '3', title: 'Celana Corduroy Cargo', category: 'Pants', price: 120000, size: '32', material: 'Corduroy Velvet', condition: 'Grade A (Kancing & Resleting Aman)' },
  { id: '4', title: 'Sweater Hoodie Thrift JP', category: 'Sweater', price: 95000, size: 'M', material: 'Fleece Heavyweight', condition: 'Grade A (Bulu halus & Tag Lengkap)' },
  { id: '5', title: 'Kemeja Flanel Uniqlo Second', category: 'Shirt', price: 75000, size: 'L', material: 'Flannel Cotton', condition: 'Grade B+ (Warna sedikit pekat)' },
  { id: '6', title: 'Workjacket Carhartt Style', category: 'Outerwear', price: 210000, size: 'XL', material: 'Canvas Duck Heavy', condition: 'Grade A+ (Sangat Kokoh)' },
  { id: '7', title: 'Vest Rompi Tactical Army', category: 'Vest', price: 65000, size: 'All Size', material: 'Ripstop Water-resistant', condition: 'Grade A (Banyak Saku Lengkap)' },
  { id: '8', title: 'Celana Jeans Levis 501 Second', category: 'Pants', price: 180000, size: '34', material: 'Rigid Denim', condition: 'Grade A (Pola Cut Original)' },
  { id: '9', title: 'Varsity Jacket Leather Sleeve', category: 'Outerwear', price: 250000, size: 'L', material: 'Wool Blend & Synthetic Leather', condition: 'Grade A+ (Kulit Mulus No Cacat)' },
  { id: '10', title: 'Kaos Graphic Anime Retro', category: 'T-Shirt', price: 70000, size: 'M', material: 'Cotton 30s', condition: 'Grade A (Sablon Masih Utuh)' },
  { id: '11', title: 'Trench Coat Formal Beige', category: 'Outerwear', price: 220000, size: 'M', material: 'Gabardine Cotton', condition: 'Grade A+ (Elegant & Clean)' },
  { id: '12', title: 'Celana Chino Slimfit Dickies', category: 'Pants', price: 135000, size: '30', material: 'Polyester Cotton Blend', condition: 'Grade A (Bahan Kaku Presisi)' },
  { id: '13', title: 'Sweater Crewneck Champion', category: 'Sweater', price: 110000, size: 'L', material: 'Reverse Weave Cotton', condition: 'Grade A (Bordir Logo Utuh)' },
  { id: '14', title: 'Kemeja Hawaii Motif Floral', category: 'Shirt', price: 60000, size: 'XL', material: 'Rayon Silk', condition: 'Grade A (Adem & Jatuh)' },
  { id: '15', title: 'Jaket Windbreaker Nike Vintage', category: 'Outerwear', price: 130000, size: 'L', material: 'Nylon Taslan', condition: 'Grade A (Karet Pinggang Kencang)' },
  { id: '16', title: 'Kaos Stripe Horizontal Retro', category: 'T-Shirt', price: 65000, size: 'S', material: 'Heavyweight Cotton', condition: 'Grade A (Warna Masih Pekat)' },
  { id: '17', title: 'Celana Jogger Fleece Adidas', category: 'Pants', price: 90000, size: '31', material: 'Soft Fleece', condition: 'Grade B+ (Tali Pinggang Asli)' },
  { id: '18', title: 'Jaket Tracktop Puma Classic', category: 'Outerwear', price: 125000, size: 'M', material: 'Polyester Tricot', condition: 'Grade A (Zipper Mulus)' },
  { id: '19', title: 'Kemeja Corduroy Oversized', category: 'Shirt', price: 85000, size: 'XL', material: 'Fine Corduroy', condition: 'Grade A (Kancing Cadangan Ada)' },
  { id: '20', title: 'Sweater Knit Rajut Vintage', category: 'Sweater', price: 105000, size: 'L', material: 'Knitted Wool', condition: 'Grade A (Tidak Ada Benang Brudul)' },
];

export default function CatalogScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<ThriftItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const calculateTotal = (items: ThriftItem[]): number => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  useEffect(() => {
    setTotalPrice(calculateTotal(cart));
  }, [cart]);

  const addToCart = (item: ThriftItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerBanner}>
        <Text style={globalStyles.headerTitle}>Katalog Pakaian Thrift </Text>
        <Text style={globalStyles.headerSubtitle}>Pilih item thrift siap pakai untuk dimasukkan ke kasir</Text>
      </View>

      <FlatList
        data={THRIFT_PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.itemText}>{item.title}</Text>
              <Text style={globalStyles.categoryText}>Kat: {item.category} | Size: {item.size}</Text>
              <Text style={globalStyles.priceText}>Rp {item.price.toLocaleString('id-ID')}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Pressable
                style={[globalStyles.button, { backgroundColor: '#64748b' }]}
                onPress={() =>
                  router.push(
                    `/detail/${item.id}?title=${item.title}&price=${item.price}&category=${item.category}&size=${item.size}&material=${item.material}&condition=${item.condition}`
                  )
                }>
                <Text style={globalStyles.buttonText}>Detail</Text>
              </Pressable>

              <Pressable style={globalStyles.button} onPress={() => addToCart(item)}>
                <Text style={globalStyles.buttonText}>+ Kasir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={globalStyles.cartBox}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#475569' }}>Item Terpilih: {cart.length} pcs</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#16a34a' }}>
            Rp {totalPrice.toLocaleString('id-ID')}
          </Text>
        </View>

        <Pressable
          style={[
            globalStyles.button,
            { backgroundColor: cart.length > 0 ? '#16a34a' : '#cbd5e1', marginTop: 12, paddingVertical: 12 },
          ]}
          disabled={cart.length === 0}
          onPress={() =>
            router.push({
              pathname: '/checkout',
              params: { count: cart.length, total: totalPrice },
            })
          }>
          <Text style={[globalStyles.buttonText, { textAlign: 'center', fontSize: 15 }]}>
            {cart.length > 0 ? 'Proses Transaksi Kasir →' : 'Pilih Barang Dulu'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}