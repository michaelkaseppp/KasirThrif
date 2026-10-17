import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerShadowVisible: true,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: '🛍️ THRIFTKASIR',
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          title: '💳 Ringkasan Pembayaran',
        }}
      />
      <Stack.Screen
        name="detail/[id]"
        options={{
          title: '🔍 Detail Item Thrifting',
        }}
      />
    </Stack>
  );
}