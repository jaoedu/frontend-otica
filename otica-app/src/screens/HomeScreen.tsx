import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { theme } from "@/utils/theme";
import { api } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import type { AppTabParamList } from "@/navigation/AppTabs";

type Nav = BottomTabNavigationProp<AppTabParamList, "Home">;

type Product = {
  id: number;
  name: string;
  price: string;
  category: number;
  image_url?: string | null;
  final_price?: string | null;
  is_on_sale?: boolean;
};

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.trim()?.split(" ")[0] || "Cliente";

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadProducts() {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.get<Product[]>("/products/products/");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setErrorMsg("Não foi possível carregar os produtos. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);

    try {
      const res = await api.get<Product[]>("/products/products/");
      setProducts(Array.isArray(res.data) ? res.data : []);
      setErrorMsg(null);
    } catch {
      setErrorMsg("Falha ao atualizar. Tente novamente.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [products, query]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.sm,
        }}
      >
        {/* Header */}
        <View style={{ gap: theme.spacing.sm }}>
          <View>
            <Text
              allowFontScaling
              style={{
                color: theme.colors.muted,
                fontSize: 13,
                fontWeight: "700",
                marginBottom: 2,
              }}
            >
              Bem-vindo(a), {firstName}
            </Text>

            <Text
              allowFontScaling
              accessibilityRole="header"
              style={{
                color: theme.colors.text,
                fontSize: 24,
                fontWeight: "900",
              }}
            >
              Catálogo da Ótica
            </Text>
          </View>

          {/* Busca */}
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 14,
            }}
          >
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar produto..."
              placeholderTextColor={theme.colors.muted}
              style={{
                color: theme.colors.text,
                paddingVertical: 12,
                fontSize: 16,
              }}
              allowFontScaling
              accessibilityLabel="Buscar produtos"
              accessibilityHint="Digite para filtrar os produtos da lista"
              returnKeyType="search"
            />
          </View>

          {/* Banner */}
          <View
            accessible
            accessibilityRole="summary"
            accessibilityLabel="Informação da loja"
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.colors.surface,
              padding: theme.spacing.md,
              gap: 8,
            }}
          >
            <Text
              allowFontScaling
              style={{
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: "900",
              }}
            >
              Lentes e armações com segurança
            </Text>

            <Text
              allowFontScaling
              style={{
                color: theme.colors.muted,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Escolha seu modelo e finalize seu pedido pelo app.
            </Text>

            <Pressable
              onPress={onRefresh}
              accessibilityRole="button"
              accessibilityLabel="Atualizar catálogo"
              accessibilityHint="Atualiza a lista de produtos"
              hitSlop={8}
              style={({ pressed }) => ({
                minHeight: 48,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: theme.spacing.md,
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <Text
                allowFontScaling
                style={{
                  color: theme.colors.primary,
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                Atualizar catálogo
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Conteúdo */}
        <View style={{ flex: 1, marginTop: theme.spacing.md }}>
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              accessible
              accessibilityLabel="Carregando produtos"
            >
              <ActivityIndicator />
              <Text
                allowFontScaling
                style={{ color: theme.colors.muted, fontWeight: "700" }}
              >
                Carregando catálogo...
              </Text>
            </View>
          ) : errorMsg ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Text
                allowFontScaling
                style={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontWeight: "900",
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
                accessibilityHint="Tenta carregar os produtos novamente"
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
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(p) => String(p.id)}
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
              renderItem={({ item }) => {
                const rawPrice =
                  item.is_on_sale && item.final_price
                    ? item.final_price
                    : item.price;

                const priceN = Number(rawPrice);
                const priceText = Number.isFinite(priceN)
                  ? formatBRL(priceN)
                  : `R$ ${rawPrice}`;

                return (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("CatalogTab", {
                        screen: "ProductDetails",
                        params: { id: item.id },
                      })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}. Preço ${priceText}.`}
                    accessibilityHint="Abre os detalhes do produto"
                    hitSlop={8}
                    style={({ pressed }) => ({
                      width: "48%",
                      borderRadius: theme.radius.lg,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surface,
                      padding: 12,
                      opacity: pressed ? 0.92 : 1,
                    })}
                  >
                    {item.image_url ? (
                      <Image
                        source={{ uri: item.image_url }}
                        style={{
                          width: "100%",
                          height: 130,
                          borderRadius: theme.radius.md,
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.bg,
                          marginBottom: 8,
                        }}
                        resizeMode="cover"
                        accessibilityRole="image"
                        accessibilityLabel={`Imagem do produto ${item.name}`}
                      />
                    ) : (
                      <View
                        accessible={false}
                        style={{
                          width: "100%",
                          height: 130,
                          borderRadius: theme.radius.md,
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.bg,
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          allowFontScaling
                          style={{
                            color: theme.colors.muted,
                            fontWeight: "700",
                          }}
                        >
                          Sem foto
                        </Text>
                      </View>
                    )}

                    <Text
                      allowFontScaling
                      numberOfLines={2}
                      style={{
                        color: theme.colors.text,
                        fontSize: 15,
                        fontWeight: "900",
                        minHeight: 40,
                        marginBottom: 6,
                      }}
                    >
                      {item.name}
                    </Text>

                    <Text
                      allowFontScaling
                      style={{
                        color: theme.colors.muted,
                        fontSize: 14,
                        fontWeight: "700",
                      }}
                    >
                      {priceText}
                    </Text>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View
                  style={{
                    marginTop: 24,
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    allowFontScaling
                    style={{
                      color: theme.colors.text,
                      fontSize: 18,
                      fontWeight: "900",
                    }}
                  >
                    Nenhum produto encontrado
                  </Text>

                  <Text
                    allowFontScaling
                    style={{
                      color: theme.colors.muted,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    Tente refazer a busca ou atualize o catálogo.
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}