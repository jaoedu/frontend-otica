import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { NavigatorScreenParams } from "@react-navigation/native";
import HomeScreen from "@/screens/HomeScreen";
import CartScreen from "@/screens/CartScreen";
import OrdersScreen from "@/screens/OrdersScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import CatalogStack, { type CatalogStackParamList } from "@/navigation/CatalogStack";
import { theme } from "@/utils/theme";

export type AppTabParamList = {
  Home: undefined;
  CatalogTab: NavigatorScreenParams<CatalogStackParamList>;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.bg,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="CatalogTab" component={CatalogStack} options={{ title: "Catálogo" }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: "Carrinho" }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: "Pedidos" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}