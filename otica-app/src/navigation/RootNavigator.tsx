import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "@/navigation/AuthStack";
import AppTabs from "@/navigation/AppTabs";
import { useAuthStore } from "@/store/authStore";

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="App" component={AppTabs} />
      )}
    </Stack.Navigator>
  );
}
