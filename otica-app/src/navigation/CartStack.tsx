import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "@/screens/CartScreen";
import CheckoutScreen from "@/screens/CheckoutScreen";
import PrescriptionUploadScreen from "@/screens/PrescriptionUploadScreen";
import PrescriptionCameraScreen from "@/screens/PrescriptionCameraScreen";

export type CartStackParamList = {
  CartHome: undefined;
  Checkout: undefined;
  PrescriptionUpload: { photoUri?: string } | undefined;
  PrescriptionCamera: undefined;
};

const Stack = createNativeStackNavigator<CartStackParamList>();

export default function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartHome"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Checkout" }}
      />
      <Stack.Screen
        name="PrescriptionUpload"
        component={PrescriptionUploadScreen}
        options={{ title: "Anexar receita" }}
      />
      <Stack.Screen
        name="PrescriptionCamera"
        component={PrescriptionCameraScreen}
        options={{ title: "Camera" }}
      />
    </Stack.Navigator>
  );
}
