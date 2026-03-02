import { Text, View } from "react-native";
import AppButton from "@/components/AppButton";
import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={{ flex: 1, padding: 12, gap: 12 }}>
      <View style={{ backgroundColor: "white", borderRadius: 14, padding: 12, gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: "900" }}>Perfil</Text>
        <Text style={{ opacity: 0.7 }}>Dados do cliente + endereços (próxima etapa)</Text>
      </View>

      <AppButton title="Sair" variant="danger" onPress={logout} />
    </View>
  );
}