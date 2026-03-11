import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import AppButton from "@/components/AppButton";
import { useAuthStore } from "@/store/authStore";
import { theme } from "@/utils/theme";
import type { AppTabParamList } from "@/navigation/AppTabs";

type Nav = BottomTabNavigationProp<AppTabParamList, "Profile">;

type MenuCardProps = {
  title: string;
  subtitle: string;
  onPress?: () => void;
  disabled?: boolean;
};

function MenuCard({ title, subtitle, onPress, disabled = false }: MenuCardProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={disabled ? "Opção ainda não disponível" : subtitle}
      accessibilityState={{ disabled }}
      hitSlop={8}
      style={({ pressed }) => ({
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        gap: 8,
        opacity: disabled ? 0.6 : pressed ? 0.92 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flex: 1, gap: 6 }}>
          <Text
            allowFontScaling
            style={{
              fontSize: 18,
              fontWeight: "900",
              color: theme.colors.text,
            }}
          >
            {title}
          </Text>

          <Text
            allowFontScaling
            style={{
              color: theme.colors.muted,
              fontWeight: "600",
            }}
          >
            {subtitle}
          </Text>
        </View>

        <Text
          allowFontScaling
          accessible={false}
          style={{
            color: theme.colors.muted,
            fontSize: 18,
            fontWeight: "900",
          }}
        >
          ›
        </Text>
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const logout = useAuthStore((s) => s.logout);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: theme.spacing.md,
          gap: theme.spacing.md,
        }}
      >
        {/* Header */}
        <View style={{ gap: 4 }}>
          <Text
            accessibilityRole="header"
            allowFontScaling
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: theme.colors.text,
            }}
          >
            Perfil
          </Text>

          <Text
            allowFontScaling
            style={{
              color: theme.colors.muted,
              fontWeight: "600",
            }}
          >
            Gerencie suas informações e acompanhe suas compras.
          </Text>
        </View>

        {/* Cards de menu */}
        <View style={{ gap: 12 }}>
          <MenuCard
            title="Dados do cliente"
            subtitle="Visualize suas informações pessoais cadastradas."
            onPress={() => {
              // troque para a rota real quando criar a tela
              // navigation.navigate("ProfileDetails")
            }}
          />

          <MenuCard
            title="Pedidos"
            subtitle="Veja o histórico e acompanhe o status das suas compras."
            onPress={() => navigation.navigate("Orders")}
          />

          <MenuCard
            title="Endereços"
            subtitle="Gerencie seus endereços de entrega. Disponível em breve."
            disabled
          />
        </View>

        {/* Logout no fim */}
        <View style={{ marginTop: "auto" }}>
          <AppButton
            title="Sair da conta"
            variant="danger"
            onPress={logout}
            accessibilityLabel="Sair da conta"
            accessibilityHint="Encerra sua sessão no aplicativo"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}