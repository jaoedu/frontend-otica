import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { listProducts, type Product } from "@/api/products";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";

export default function CatalogScreen({ navigation }: any) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await listProducts();
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator /></View>;

  if (!data.length) {
    return <EmptyState title="Sem produtos" subtitle="Cadastre produtos no Django Admin para aparecer aqui." />;
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("ProductDetails", { id: item.id })}
          />
        )}
      />
    </View>
  );
}