import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProduct, type ProductDetail } from "@/api/products";
import { PriceTag } from "@/components/PriceTag";
import AppButton from "@/components/AppButton";
import { useCartStore } from "@/store/cartStore";
import { theme } from "@/utils/theme";

export default function ProductDetailsScreen({ route }: any) {
  const id = Number(route.params?.id);
  const add = useCartStore((s) => s.add);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(20)).current;

  async function loadProduct() {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await getProduct(id);
      setProduct(res);
    } catch {
      setErrorMsg("Não foi possível carregar este produto. Tente novamente.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  function showAddedToast() {
    toastOpacity.setValue(0);
    toastTranslateY.setValue(20);

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(toastTranslateY, {
            toValue: 20,
            duration: 220,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1100);
    });
  }

  function handleAddToCart() {
    if (!product) return;
    add(product, 1);
    showAddedToast();
  }

  useEffect(() => {
    loadProduct();
  }, [id]);

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
          accessibilityLabel="Carregando detalhes do produto"
        >
          <ActivityIndicator />
          <Text
            allowFontScaling
            style={{ color: theme.colors.muted, fontWeight: "700" }}
          >
            Carregando produto...
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

          <View style={{ width: 220, marginTop: 8 }}>
            <AppButton title="Tentar novamente" onPress={loadProduct} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock <= 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.md,
            paddingTop: theme.spacing.sm,
            paddingBottom: 120,
          }}
        >
          {/* Imagem principal */}
          <View
            style={{
              width: "100%",
              height: 280,
              borderRadius: theme.radius.lg,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              marginBottom: theme.spacing.md,
            }}
          >
            {product.image_url ? (
              <Image
                source={{ uri: product.image_url }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                accessibilityRole="image"
                accessibilityLabel={`Imagem do produto ${product.name}`}
              />
            ) : (
              <View
                accessible
                accessibilityLabel="Imagem não disponível"
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
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
          </View>

          {/* Galeria */}
          {product.gallery?.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: theme.spacing.md }}
              contentContainerStyle={{ gap: 10 }}
              accessibilityRole="list"
              accessibilityLabel="Galeria de imagens do produto"
            >
              {product.gallery.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.image_url }}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: theme.radius.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                  }}
                  resizeMode="cover"
                  accessibilityRole="image"
                  accessibilityLabel="Imagem adicional do produto"
                />
              ))}
            </ScrollView>
          ) : null}

          {/* Bloco principal */}
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              gap: 12,
              marginBottom: theme.spacing.md,
            }}
          >
            <View style={{ gap: 4 }}>
              <Text
                allowFontScaling
                style={{
                  fontSize: 22,
                  fontWeight: "900",
                  color: theme.colors.text,
                }}
              >
                {product.name}
              </Text>

              {!!product.brand ? (
                <Text
                  allowFontScaling
                  style={{
                    color: theme.colors.muted,
                    fontWeight: "700",
                  }}
                >
                  {product.brand}
                </Text>
              ) : null}
            </View>

            <PriceTag
              price={product.price}
              finalPrice={product.final_price}
              isOnSale={product.is_on_sale}
            />

            <View
              accessible
              accessibilityLabel={
                outOfStock
                  ? "Produto indisponível"
                  : `Produto em estoque. Quantidade ${product.stock}`
              }
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.bg,
                padding: 12,
              }}
            >
              <Text
                allowFontScaling
                style={{
                  color: outOfStock ? theme.colors.danger : theme.colors.success,
                  fontWeight: "900",
                }}
              >
                {outOfStock ? "Indisponível" : `Em estoque (${product.stock})`}
              </Text>
            </View>
          </View>

          {/* Especificações */}
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              gap: 10,
              marginBottom: theme.spacing.md,
            }}
            accessibilityRole="summary"
            accessibilityLabel="Especificações do produto"
          >
            <Text
              allowFontScaling
              style={{
                fontSize: 16,
                fontWeight: "900",
                color: theme.colors.text,
              }}
            >
              Especificações
            </Text>

            {product.attributes?.length ? (
              <View accessibilityRole="list" accessibilityLabel="Lista de atributos">
                {product.attributes.map((attr) => (
                  <View
                    key={attr.id}
                    accessible
                    accessibilityRole="text"
                    accessibilityLabel={`${attr.name}: ${attr.value}`}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 8,
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.border,
                    }}
                  >
                    <Text
                      allowFontScaling
                      style={{
                        color: theme.colors.text,
                        fontWeight: "800",
                        flex: 1,
                      }}
                    >
                      {attr.name}
                    </Text>

                    <Text
                      allowFontScaling
                      style={{
                        color: theme.colors.muted,
                        fontWeight: "700",
                        flex: 1,
                        textAlign: "right",
                      }}
                    >
                      {attr.value}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text
                allowFontScaling
                style={{
                  color: theme.colors.muted,
                  fontWeight: "600",
                }}
              >
                Sem atributos cadastrados.
              </Text>
            )}
          </View>

          {/* Descrição */}
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              gap: 10,
            }}
            accessibilityRole="summary"
            accessibilityLabel="Descrição do produto"
          >
            <Text
              allowFontScaling
              style={{
                fontSize: 16,
                fontWeight: "900",
                color: theme.colors.text,
              }}
            >
              Descrição
            </Text>

            <Text
              allowFontScaling
              style={{
                color: theme.colors.text,
                lineHeight: 22,
              }}
            >
              {product.description || "Sem descrição cadastrada."}
            </Text>
          </View>
        </ScrollView>

        {/* Toast animado */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 96,
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslateY }],
            backgroundColor: theme.colors.text,
            borderRadius: theme.radius.lg,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: "center",
          }}
        >
          <Text
            allowFontScaling
            style={{
              color: theme.colors.bg,
              fontWeight: "800",
            }}
          >
            Produto adicionado ao carrinho
          </Text>
        </Animated.View>

        {/* Rodapé fixo */}
        <View
          accessible
          accessibilityRole="toolbar"
          accessibilityLabel="Ações do produto"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.bg,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            padding: theme.spacing.md,
          }}
        >
          <AppButton
            title={outOfStock ? "Indisponível" : "Adicionar ao carrinho"}
            onPress={handleAddToCart}
            disabled={outOfStock}
            accessibilityLabel={
              outOfStock
                ? "Produto indisponível"
                : "Adicionar produto ao carrinho"
            }
            accessibilityHint={
              outOfStock
                ? "Produto sem estoque"
                : "Adiciona uma unidade ao carrinho"
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}