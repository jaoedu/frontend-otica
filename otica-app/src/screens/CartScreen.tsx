import { useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { useCartStore } from "@/store/cartStore";
import { checkout } from "@/api/orders";
import { theme } from "@/utils/theme";

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const inc = useCartStore((s) => s.inc);
  const dec = useCartStore((s) => s.dec);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total);

  const [loading, setLoading] = useState(false);

  if (!items.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <EmptyState
          title="Carrinho vazio"
          subtitle="Adicione produtos para finalizar a compra."
        />
      </SafeAreaView>
    );
  }

  async function handleCheckout() {
    try {
      setLoading(true);

      const payload = items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
      }));

      const order = await checkout(payload);

      clear();
      Alert.alert("Pedido criado!", `Pedido #${order.id} criado com sucesso.`);
    } catch {
      Alert.alert(
        "Erro no checkout",
        "Verifique estoque ou servidor e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <View style={{ padding: theme.spacing.md, paddingBottom: 0 }}>
          <Text
            allowFontScaling
            accessibilityRole="header"
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: theme.colors.text,
            }}
          >
            Carrinho
          </Text>
          <Text
            allowFontScaling
            style={{
              color: theme.colors.muted,
              fontWeight: "600",
              marginTop: 4,
            }}
          >
            Revise os itens antes de finalizar a compra.
          </Text>
        </View>

        <FlatList
          data={items}
          keyExtractor={(i) => String(i.product.id)}
          contentContainerStyle={{
            padding: theme.spacing.md,
            paddingBottom: 160,
          }}
          accessibilityRole="list"
          accessibilityLabel="Lista de itens do carrinho"
          renderItem={({ item }) => {
            const rawPrice = item.product.final_price || item.product.price;
            const unitPrice = Number(rawPrice);
            const subtotal = unitPrice * item.quantity;

            return (
              <View
                accessible
                accessibilityLabel={`${item.product.name}. Quantidade ${item.quantity}. Subtotal ${formatBRL(
                  subtotal
                )}.`}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 12,
                  marginBottom: 12,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {item.product.image_url ? (
                    <Image
                      source={{ uri: item.product.image_url }}
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: theme.radius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.bg,
                      }}
                      resizeMode="cover"
                      accessibilityRole="image"
                      accessibilityLabel={`Imagem do produto ${item.product.name}`}
                    />
                  ) : (
                    <View
                      accessible={false}
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: theme.radius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.bg,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        allowFontScaling
                        style={{ color: theme.colors.muted, fontWeight: "700" }}
                      >
                        Sem foto
                      </Text>
                    </View>
                  )}

                  <View style={{ flex: 1, gap: 6 }}>
                    <Text
                      allowFontScaling
                      numberOfLines={2}
                      style={{
                        color: theme.colors.text,
                        fontWeight: "900",
                        fontSize: 16,
                      }}
                    >
                      {item.product.name}
                    </Text>

                    <Text
                      allowFontScaling
                      style={{
                        color: theme.colors.muted,
                        fontWeight: "700",
                      }}
                    >
                      Unitário: {formatBRL(unitPrice)}
                    </Text>

                    <Text
                      allowFontScaling
                      style={{
                        color: theme.colors.text,
                        fontWeight: "900",
                      }}
                    >
                      Subtotal: {formatBRL(subtotal)}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.colors.border,
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View style={{ width: 52 }}>
                    <AppButton
                      title="-"
                      variant="outline"
                      onPress={() => dec(item.product.id)}
                      accessibilityLabel={`Diminuir quantidade de ${item.product.name}`}
                      accessibilityHint="Remove uma unidade do produto"
                    />
                  </View>

                  <View
                    accessible
                    accessibilityLabel={`Quantidade ${item.quantity}`}
                    style={{
                      minWidth: 44,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: theme.radius.md,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.bg,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      allowFontScaling
                      style={{
                        color: theme.colors.text,
                        fontWeight: "900",
                        fontSize: 16,
                      }}
                    >
                      {item.quantity}
                    </Text>
                  </View>

                  <View style={{ width: 52 }}>
                    <AppButton
                      title="+"
                      variant="outline"
                      onPress={() => inc(item.product.id)}
                      accessibilityLabel={`Aumentar quantidade de ${item.product.name}`}
                      accessibilityHint="Adiciona uma unidade do produto"
                    />
                  </View>

                  <View style={{ flex: 1 }} />

                  <View style={{ width: 110 }}>
                    <AppButton
                      title="Remover"
                      variant="danger"
                      onPress={() => remove(item.product.id)}
                      accessibilityLabel={`Remover ${item.product.name} do carrinho`}
                      accessibilityHint="Remove o produto do carrinho"
                    />
                  </View>
                </View>
              </View>
            );
          }}
        />

        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel={`Resumo do carrinho. Total ${formatBRL(total())}.`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.bg,
            gap: 10,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 12,
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                allowFontScaling
                style={{
                  color: theme.colors.muted,
                  fontWeight: "700",
                }}
              >
                Total
              </Text>

              <Text
                allowFontScaling
                style={{
                  color: theme.colors.text,
                  fontWeight: "900",
                  fontSize: 18,
                }}
              >
                {formatBRL(total())}
              </Text>
            </View>

            <AppButton
              title="Finalizar compra"
              onPress={handleCheckout}
              loading={loading}
              disabled={loading}
              accessibilityLabel="Finalizar compra"
              accessibilityHint="Envia os itens do carrinho para criar o pedido"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}