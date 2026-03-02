import { Text, View } from "react-native";

export function PriceTag({
  price,
  finalPrice,
  isOnSale,
}: {
  price: string;
  finalPrice: string;
  isOnSale: boolean;
}) {
  return (
    <View style={{ gap: 4 }}>
      {isOnSale ? (
        <>
          <Text style={{ textDecorationLine: "line-through", opacity: 0.6 }}>
            R$ {Number(price).toFixed(2)}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>
            R$ {Number(finalPrice).toFixed(2)}
          </Text>
        </>
      ) : (
        <Text style={{ fontSize: 18, fontWeight: "800" }}>
          R$ {Number(finalPrice || price).toFixed(2)}
        </Text>
      )}
    </View>
  );
}