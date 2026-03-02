import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { getProduct, type ProductDetail } from "@/api/products";
import { PriceTag } from "@/components/PriceTag";
import AppButton from "@/components/AppButton";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailsScreen({ route }: any) {
  const id = Number(route.params?.id);
  const add = useCartStore((s) => s.add);

  const [p, setP] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProduct(id);
        setP(res);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator /></View>;
  if (!p) return null;

  return (
    <ScrollView style={{ flex: 1, padding: 12 }}>
      {/* “Hero” */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 14,
          padding: 12,
          gap: 10,
        }}
      >
        {p.image_url ? (
          <Image
            source={{ uri: p.image_url }}
            style={{ width: "100%", height: 240, borderRadius: 12 }}
            resizeMode="cover"
          />
        ) : null}

        {/* Galeria horizontal (Amazon feel) */}
        {p.gallery?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {p.gallery.map((g) => (
                <Image
                  key={g.id}
                  source={{ uri: g.image_url }}
                  style={{ width: 72, height: 72, borderRadius: 10, backgroundColor: "#f2f2f2" }}
                />
              ))}
            </View>
          </ScrollView>
        ) : null}

        <Text style={{ fontSize: 18, fontWeight: "900" }}>{p.name}</Text>
        <Text style={{ opacity: 0.7 }}>{p.brand}</Text>

        <PriceTag price={p.price} finalPrice={p.final_price} isOnSale={p.is_on_sale} />

        <Text style={{ opacity: 0.8 }}>Estoque: {p.stock}</Text>

        <AppButton
          title="Adicionar ao carrinho"
          onPress={() => add(p, 1)}
          disabled={p.stock <= 0}
        />
      </View>

      {/* Especificações (atributos) */}
      <View style={{ marginTop: 12, backgroundColor: "white", borderRadius: 14, padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "900", marginBottom: 8 }}>
          Especificações
        </Text>

        {p.attributes?.length ? (
          p.attributes.map((a) => (
            <View key={a.id} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
              <Text style={{ fontWeight: "700" }}>{a.name}</Text>
              <Text style={{ opacity: 0.8 }}>{a.value}</Text>
            </View>
          ))
        ) : (
          <Text style={{ opacity: 0.7 }}>Sem atributos cadastrados.</Text>
        )}
      </View>

      {/* Descrição */}
      <View style={{ marginTop: 12, backgroundColor: "white", borderRadius: 14, padding: 12, marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: "900", marginBottom: 8 }}>
          Descrição
        </Text>
        <Text style={{ opacity: 0.85, lineHeight: 20 }}>{p.description}</Text>
      </View>
    </ScrollView>
  );
}