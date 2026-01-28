import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/screens/LoginScreen";
import HomeScreen from "@/screens/HomeScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  isLoggedIn: boolean;
  onLoginMock: () => void;
  onLogoutMock: () => void;
};

export default function RootNavigator({
  isLoggedIn,
  onLoginMock,
  onLogoutMock,
}: Props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login">
          {() => <LoginScreen onLoginMock={onLoginMock} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Home">
          {() => <HomeScreen onLogoutMock={onLogoutMock} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
