import { Text, View } from "react-native";

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ padding: 24, alignItems: "center", gap: 6 }}>
      <Text style={{ fontSize: 18, fontWeight: "800" }}>{title}</Text>
      {subtitle ? <Text style={{ opacity: 0.7, textAlign: "center" }}>{subtitle}</Text> : null}
    </View>
  );
}