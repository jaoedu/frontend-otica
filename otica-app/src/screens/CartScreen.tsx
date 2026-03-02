import { useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import AppButton from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { useCartStore } from "@/store/cartStore";
import { checkout } from "@/api/orders";

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const inc = useCartStore((s) => s.inc);
  const dec = useCartStore((s) => s.dec);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total);

  const [loading, setLoading] = useState(false);

  if (!items.length) {
    return <EmptyState title="Carrinho vazio" subtitle="Adicione produtos para finalizar a compra." />;
  }

  async function handleCheckout() {
    try {
      setLoading(true);
      const payload = items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }));
      const order = await checkout(payload);
      clear();
      Alert.alert("Pedido criado!", `Pedido #${order.id} criado com sucesso.`);
    } catch (e: any) {
      Alert.alert("Erro no checkout", "Verifique estoque/servidor e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.product.id)}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 14,
              padding: 12,
              marginBottom: 12,
              gap: 6,
            }}
          >
            <Text style={{ fontWeight: "900" }}>{item.product.name}</Text>
            <Text style={{ opacity: 0.7 }}>R$ {Number(item.product.final_price || item.product.price).toFixed(2)}</Text>

            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              <AppButton title="-" variant="outline" onPress={() => dec(item.product.id)} />
              <Text style={{ alignSelf: "center", fontWeight: "800" }}>{item.quantity}</Text>
              <AppButton title="+" variant="outline" onPress={() => inc(item.product.id)} />
              <View style={{ flex: 1 }} />
              <AppButton title="Remover" variant="danger" onPress={() => remove(item.product.id)} />
            </View>
          </View>
        )}
      />

      <View style={{ backgroundColor: "white", borderRadius: 14, padding: 12, gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "900" }}>
          Total: R$ {total().toFixed(2)}
        </Text>
        <AppButton title="Finalizar compra" onPress={handleCheckout} loading={loading} />
      </View>
    </View>
  );
}