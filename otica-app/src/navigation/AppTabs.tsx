import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/screens/HomeScreen";
import CartScreen from "@/screens/CartScreen";
import OrdersScreen from "@/screens/OrdersScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import CatalogStack from "@/navigation/CatalogStack";

export type AppTabParamList = {
  Home: undefined;
  CatalogTab: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="CatalogTab" component={CatalogStack} options={{ title: "Catálogo" }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: "Carrinho" }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: "Pedidos" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}
