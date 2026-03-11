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
        flex: 1,
        maxWidth: "48%",
        backgroundColor: "white",
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#eee",
      }}
    >
      {/* Imagem do produto */}
      <View
        style={{
          width: "100%",
          height: 120,
          borderRadius: 12,
          backgroundColor: "#f2f2f2",
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
        ) : null}
      </View>

      {/* Informações */}
      <View style={{ gap: 4 }}>
        <Text
          style={{
            fontWeight: "800",
            fontSize: 14,
          }}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {product.brand ? (
          <Text
            style={{
              opacity: 0.7,
              fontSize: 12,
            }}
          >
            {product.brand}
          </Text>
        ) : null}

        <PriceTag
          price={product.price}
          finalPrice={product.final_price}
          isOnSale={product.is_on_sale}
        />

        {product.is_on_sale ? (
          <Text
            style={{
              color: "#16a34a",
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            Promoção ativa
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}