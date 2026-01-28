import { View, Text, Pressable } from "react-native";

type Props = { onLogoutMock: () => void };

export default function HomeScreen({ onLogoutMock }: Props) {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Home</Text>

      <Pressable
        onPress={onLogoutMock}
        style={{ padding: 14, borderRadius: 10, backgroundColor: "#D32F2F" }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
          Sair (mock)
        </Text>
      </Pressable>
    </View>
  );
}
