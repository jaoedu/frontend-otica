import { View, Text } from "react-native";
import { theme } from "@/utils/theme";

export default function CartScreen() {
  return (
    <View style={{ flex: 1, padding: theme.spacing.md }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: theme.colors.text }}>
        Carrinho
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 8 }}>
        Itens + total + botão checkout.
      </Text>
    </View>
  );
}
