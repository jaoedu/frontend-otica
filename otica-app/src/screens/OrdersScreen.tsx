import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { listOrders, type Order } from "@/api/orders";
import { EmptyState } from "@/components/EmptyState";
import { theme } from "@/utils/theme";
import AppButton from "@/components/AppButton";

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function getStatusLabel(status: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("pending")) return "Pendente";
  if (s.includes("paid")) return "Pago";
  if (s.includes("processing")) return "Em preparação";
  if (s.includes("shipped")) return "Enviado";
  if (s.includes("delivered")) return "Entregue";
  if (s.includes("cancel")) return "Cancelado";

  return status || "Sem status";
}

function getStatusColors(status: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("paid") || s.includes("delivered")) {
    return {
      bg: "#EAF8EF",
      text: theme.colors.success,
      border: "#BFE7CC",
    };
  }

  if (s.includes("cancel")) {
    return {
      bg: "#FDECEC",
      text: theme.colors.danger,
      border: "#F5C2C2",
    };
  }

  return {
    bg: "#FFF7E6",
    text: "#9A6700",
    border: "#F3D58B",
  };
}

export default function OrdersScreen() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadOrders() {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await listOrders();
      setData(res);
    } catch {
      setErrorMsg("Não foi possível carregar seus pedidos.");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      const res = await listOrders();
      setData(res);
      setErrorMsg(null);
    } catch {
      setErrorMsg("Falha ao atualizar os pedidos.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: theme.spacing.md,
          }}
          accessible
          accessibilityLabel="Carregando pedidos"
        >
          <ActivityIndicator />
          <Text
            allowFontScaling
            style={{ color: theme.colors.muted, fontWeight: "700" }}
          >
            Carregando pedidos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: theme.spacing.md,
          }}
        >
          <Text
            allowFontScaling
            style={{ color: theme.colors.text, fontSize: 18, fontWeight: "900" }}
          >
            Ops…
          </Text>

          <Text
            allowFontScaling
            style={{ color: theme.colors.muted, textAlign: "center" }}
          >
            {errorMsg}
          </Text>

          <View style={{ width: 220, marginTop: 8 }}>
            <AppButton title="Tentar novamente" onPress={loadOrders} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!data.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <EmptyState
          title="Sem pedidos"
          subtitle="Finalize uma compra para aparecer aqui."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing.md }}>
        <View style={{ marginBottom: theme.spacing.md, gap: 4 }}>
          <Text
            allowFontScaling
            accessibilityRole="header"
            style={{ fontSize: 24, fontWeight: "900", color: theme.colors.text }}
          >
            Meus pedidos
          </Text>
          <Text
            allowFontScaling
            style={{ color: theme.colors.muted, fontWeight: "600" }}
          >
            Acompanhe o status e o resumo das suas compras.
          </Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(o) => String(o.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          accessibilityRole="list"
          accessibilityLabel="Lista de pedidos"
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => {
            const statusLabel = getStatusLabel(item.status);
            const statusColors = getStatusColors(item.status);

            return (
              <View
                accessible
                accessibilityLabel={`Pedido ${item.id}. Status ${statusLabel}. Total ${formatBRL(
                  Number(item.total)
                )}. Itens ${item.items?.length ?? 0}.`}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: 14,
                  marginBottom: 12,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text
                    allowFontScaling
                    style={{ fontWeight: "900", fontSize: 16, color: theme.colors.text }}
                  >
                    Pedido #{item.id}
                  </Text>

                  <View
                    accessible
                    accessibilityLabel={`Status ${statusLabel}`}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: statusColors.bg,
                      borderWidth: 1,
                      borderColor: statusColors.border,
                    }}
                  >
                    <Text
                      allowFontScaling
                      style={{
                        color: statusColors.text,
                        fontWeight: "800",
                        fontSize: 12,
                      }}
                    >
                      {statusLabel}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.colors.border,
                  }}
                />

                <View style={{ gap: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      allowFontScaling
                      style={{ color: theme.colors.muted, fontWeight: "700" }}
                    >
                      Total
                    </Text>
                    <Text
                      allowFontScaling
                      style={{ color: theme.colors.text, fontWeight: "800" }}
                    >
                      {formatBRL(Number(item.total))}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      allowFontScaling
                      style={{ color: theme.colors.muted, fontWeight: "700" }}
                    >
                      Quantidade de itens
                    </Text>
                    <Text
                      allowFontScaling
                      style={{ color: theme.colors.text, fontWeight: "800" }}
                    >
                      {item.items?.length ?? 0}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}