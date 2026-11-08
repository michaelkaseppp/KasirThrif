import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Menghilangkan header bawaan Expo secara global
      }}
    />
  );
}
