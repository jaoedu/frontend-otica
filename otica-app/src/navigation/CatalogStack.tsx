import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CatalogScreen from "@/screens/CatalogScreen";
import ProductDetailsScreen from "@/screens/ProductDetailsScreen";
import PrescriptionUploadScreen from "@/screens/PrescriptionUploadScreen";
import PrescriptionCameraScreen from "@/screens/PrescriptionCameraScreen";

export type CatalogStackParamList = {
  Catalog: undefined;
  ProductDetails: { id: number };
  PrescriptionUpload: { photoUri?: string } | undefined;
  PrescriptionCamera: undefined;
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

      <Stack.Screen
        name="PrescriptionUpload"
        component={PrescriptionUploadScreen}
        options={{ title: "Anexar receita" }}
      />

      <Stack.Screen
        name="PrescriptionCamera"
        component={PrescriptionCameraScreen}
        options={{ title: "Câmera" }}
      />
    </Stack.Navigator>
  );
}