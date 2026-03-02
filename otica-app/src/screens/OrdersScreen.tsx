import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { listOrders, type Order } from "@/api/orders";
import { EmptyState } from "@/components/EmptyState";

export default function OrdersScreen() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await listOrders();
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator /></View>;
  if (!data.length) return <EmptyState title="Sem pedidos" subtitle="Finalize uma compra para aparecer aqui." />;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={data}
        keyExtractor={(o) => String(o.id)}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "white", borderRadius: 14, padding: 12, marginBottom: 12, gap: 6 }}>
            <Text style={{ fontWeight: "900" }}>Pedido #{item.id}</Text>
            <Text style={{ opacity: 0.7 }}>Status: {item.status}</Text>
            <Text style={{ opacity: 0.7 }}>Total: R$ {Number(item.total).toFixed(2)}</Text>
            <Text style={{ opacity: 0.7 }}>Itens: {item.items?.length ?? 0}</Text>
          </View>
        )}
      />
    </View>
  );
}