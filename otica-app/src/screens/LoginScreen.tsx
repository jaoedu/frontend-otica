import { View, Text, Pressable } from "react-native";

type Props = { onLoginMock: () => void };

export default function LoginScreen({ onLoginMock }: Props) {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Login</Text>

      <Pressable
        onPress={onLoginMock}
        style={{ padding: 14, borderRadius: 10, backgroundColor: "#015DAA" }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
          Entrar (mock)
        </Text>
      </Pressable>
    </View>
  );
}
