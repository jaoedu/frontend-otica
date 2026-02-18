import { View, Text } from "react-native";
import AppButton from "@/components/AppButton";
import { theme } from "@/utils/theme";

type Props = { onLogoutMock?: () => void };

export default function HomeScreen({ onLogoutMock }: Props) {
  return (
    <View
      style={{
        flex: 1,
        padding: theme.spacing.md,
        justifyContent: "center",
        gap: theme.spacing.md,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "800", color: theme.colors.text }}>
        Home
      </Text>

      <AppButton
        title="Sair"
        onPress={onLogoutMock ?? (() => {})}
        variant="danger"
/>
    </View>
  );
}
