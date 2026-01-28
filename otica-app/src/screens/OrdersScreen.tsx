import { View, Text } from "react-native";
import { theme } from "@/utils/theme";

export default function OrdersScreen() {
  return (
    <View style={{ flex: 1, padding: theme.spacing.md }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: theme.colors.text }}>
        Pedidos
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 8 }}>
        Histórico de pedidos e status.
      </Text>
    </View>
  );
}
