import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "@/navigation/RootNavigator";
import { useAuthStore } from "@/store/authStore";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}