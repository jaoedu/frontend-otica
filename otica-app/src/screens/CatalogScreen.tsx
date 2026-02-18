import { View, Text } from "react-native";
import { theme } from "@/utils/theme";

export default function CatalogScreen() {
  return (
    <View style={{ flex: 1, padding: theme.spacing.md }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: theme.colors.text }}>
        Catálogo
      </Text>
      <Text style={{ color: theme.colors.muted, marginTop: 8 }}>
        Lista de produtos vai entrar aqui.
      </Text>
    </View>
  );
}
