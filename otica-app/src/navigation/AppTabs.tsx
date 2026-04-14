import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "@/screens/HomeScreen";
import CartScreen from "@/screens/CartScreen";
import OrdersScreen from "@/screens/OrdersScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import CatalogStack, { type CatalogStackParamList } from "@/navigation/CatalogStack";
import { theme } from "@/utils/theme";
import { useCartStore } from "@/store/cartStore";

export type AppTabParamList = {
  Home: undefined;
  CatalogTab: NavigatorScreenParams<CatalogStackParamList>;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppTabs() {
  const items = useCartStore((s) => s.items);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CatalogTab") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Orders") {
            iconName = focused ? "receipt" : "receipt-outline";
          } else {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Início" }}
      />

      <Tab.Screen
        name="CatalogTab"
        component={CatalogStack}
        options={{ title: "Catálogo" }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Carrinho",
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.danger,
            color: theme.colors.white,
            fontSize: 11,
            fontWeight: "800",
          },
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "Pedidos" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}