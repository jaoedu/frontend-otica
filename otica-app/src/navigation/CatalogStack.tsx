import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CatalogScreen from "@/screens/CatalogScreen";
import ProductDetailsScreen from "@/screens/ProductDetailsScreen";

export type CatalogStackParamList = {
  Catalog: undefined;
  ProductDetails: { id: number };
};

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export default function CatalogStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: "Detalhes do produto" }}
      />
    </Stack.Navigator>
  );
}