import { View, Text } from "react-native";
import AppButton from "@/components/AppButton";
import { theme } from "@/utils/theme";

type Props = { onLoginMock: () => void };

export default function LoginScreen({ onLoginMock }: Props) {
  return (
    <View style={{ flex: 1, padding: theme.spacing.md, justifyContent: "center", gap: theme.spacing.md }}>
      <Text style={{ fontSize: 24, fontWeight: "800", color: theme.colors.text }}>Entrar</Text>
      <Text style={{ color: theme.colors.muted }}>Acesse sua conta para comprar.</Text>

      <AppButton title="Entrar (mock)" onPress={onLoginMock} />
    </View>
  );
}
