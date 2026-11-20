import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({
  message = "Memuat data supplier...",
}: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#0284c7" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
  },
  text: {
    fontSize: 13,
    color: "#0369a1",
    fontWeight: "bold",
  },
});
