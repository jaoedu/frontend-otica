import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  RefreshControl,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { listProducts, type Product } from "@/api/products";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { theme } from "@/utils/theme";
import type { CatalogStackParamList } from "@/navigation/CatalogStack";
import { useCartStore } from "@/store/cartStore";

type Nav = NativeStackNavigationProp<CatalogStackParamList, "Catalog">;

export default function CatalogScreen() {
  const navigation = useNavigation<Nav>();
  const addToCart = useCartStore((s) => s.add);

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadProducts() {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await listProducts();
      setData(res);
    } catch {
      setErrorMsg("Não foi possível carregar o catálogo.");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);

    try {
      const res = await listProducts();
      setData(res);
      setErrorMsg(null);
    } catch {
      setErrorMsg("Erro ao atualizar o catálogo.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProducts();
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
          }}
          accessible
          accessibilityLabel="Carregando catálogo"
        >
          <ActivityIndicator />
          <Text allowFontScaling style={{ color: theme.colors.muted, fontWeight: "700" }}>
            Carregando produtos...
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
            padding: theme.spacing.md,
            gap: 10,
          }}
        >
          <Text
            allowFontScaling
            style={{
              fontSize: 18,
              fontWeight: "900",
              color: theme.colors.text,
            }}
          >
            Ops…
          </Text>

          <Text
            allowFontScaling
            style={{
              color: theme.colors.muted,
              textAlign: "center",
            }}
          >
            {errorMsg}
          </Text>

          <Pressable
            onPress={loadProducts}
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
            accessibilityHint="Tenta carregar o catálogo novamente"
            hitSlop={8}
            style={({ pressed }) => ({
              minHeight: 48,
              minWidth: 220,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.colors.primary,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: theme.spacing.md,
              opacity: pressed ? 0.92 : 1,
              marginTop: 8,
            })}
          >
            <Text
              allowFontScaling
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!data.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <EmptyState
          title="Sem produtos"
          subtitle="Cadastre produtos no Django Admin para aparecer aqui."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.sm,
        }}
      >
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text
            allowFontScaling
            accessibilityRole="header"
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: theme.colors.text,
            }}
          >
            Catálogo
          </Text>

          <Text
            allowFontScaling
            style={{
              color: theme.colors.muted,
              fontWeight: "600",
              marginTop: 4,
            }}
          >
            Explore nossas armações e lentes.
          </Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(i) => String(i.id)}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          contentContainerStyle={{
            paddingBottom: 16,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          accessibilityRole="list"
          accessibilityLabel="Lista de produtos"
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate("ProductDetails", { id: item.id })}
              onAddToCart={() => addToCart(item, 1)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}