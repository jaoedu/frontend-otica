import { Image, Pressable, Text, View } from "react-native";
import { PriceTag } from "./PriceTag";
import type { Product } from "@/api/products";

export function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "white",
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 12,
            backgroundColor: "#f2f2f2",
            overflow: "hidden",
          }}
        >
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : null}
        </View>

        <View style={{ flex: 1, gap: 6 }}>
          <Text style={{ fontWeight: "800" }} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={{ opacity: 0.7 }}>{product.brand}</Text>

          <PriceTag
            price={product.price}
            finalPrice={product.final_price}
            isOnSale={product.is_on_sale}
          />
          {product.is_on_sale ? (
            <Text style={{ color: "#16a34a", fontWeight: "700" }}>
              Promoção ativa
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}