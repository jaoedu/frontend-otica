import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { theme } from "@/utils/theme";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CatalogStackParamList } from "@/navigation/CatalogStack";
import { getProduct, type ProductDetail } from "@/api/products";
import { useCartStore } from "@/store/cartStore";

type Props = NativeStackScreenProps<
  CatalogStackParamList,
  "ProductDetails"
>;

export default function ProductDetailsScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const addToCart = useCartStore((s) => s.add);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProduct(id);

        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Não foi possível carregar os detalhes do produto.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleGoToPrescription() {
    navigation.navigate("PrescriptionUpload");
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.feedbackText}>Carregando produto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
          onPress={async () => {
            try {
              setLoading(true);
              setError(null);
              const data = await getProduct(id);
              setProduct(data);
            } catch {
              setError("Não foi possível carregar os detalhes do produto.");
            } finally {
              setLoading(false);
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={`Imagem do produto ${product.name}`}
        />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.imageFallbackText}>Sem imagem</Text>
        </View>
      )}

      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.title}>{product.name}</Text>

      <View style={styles.priceBox}>
        {product.is_on_sale ? (
          <>
            <Text style={styles.oldPrice}>R$ {product.price}</Text>
            <Text style={styles.salePrice}>R$ {product.final_price}</Text>
          </>
        ) : (
          <Text style={styles.normalPrice}>R$ {product.final_price}</Text>
        )}

        <Text style={styles.stock}>
          {product.stock > 0 ? `Em estoque: ${product.stock}` : "Sem estoque"}
        </Text>
      </View>

      <Text style={styles.description}>{product.description}</Text>

      {product.attributes.length > 0 && (
        <View style={styles.attributesCard}>
          <Text style={styles.sectionTitle}>Especificações</Text>

          {product.attributes.map((attr) => (
            <View key={`${attr.name}-${attr.value}`} style={styles.attributeRow}>
              <Text style={styles.attributeName}>{attr.name}</Text>
              <Text style={styles.attributeValue}>{attr.value}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.prescriptionCard}>
        <Text style={styles.prescriptionTitle}>Envie sua receita</Text>

        <Text style={styles.prescriptionText}>
          Para agilizar seu atendimento, você pode fotografar e anexar sua
          receita médica diretamente pelo aplicativo.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.prescriptionButton,
            pressed && styles.prescriptionButtonPressed,
          ]}
          onPress={handleGoToPrescription}
          accessibilityRole="button"
          accessibilityLabel="Anexar receita"
          accessibilityHint="Abre a tela para fotografar a receita"
          hitSlop={theme.a11y.hitSlop}
        >
          <Text style={styles.prescriptionButtonText}>Anexar receita</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.buyButton}
        accessibilityRole="button"
        onPress={() => {
          addToCart(product, 1);
          Alert.alert("Produto adicionado", "Item adicionado ao carrinho.");
        }}
      >
        <Text style={styles.buyButtonText}>Adicionar ao carrinho</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  centered: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
  },

  feedbackText: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginTop: theme.spacing.sm,
  },

  errorText: {
    ...theme.typography.body,
    color: theme.colors.danger,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },

  retryButton: {
    minHeight: theme.a11y.minTouch,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  retryButtonPressed: {
    backgroundColor: theme.colors.primaryPressed,
  },

  retryButtonText: {
    ...theme.typography.body,
    color: theme.colors.onPrimary,
    fontWeight: "800",
  },

  image: {
    width: "100%",
    height: 280,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface2,
  },

  imageFallback: {
    width: "100%",
    height: 280,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  imageFallbackText: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },

  brand: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: "700",
  },

  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  priceBox: {
    marginBottom: theme.spacing.md,
  },

  oldPrice: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textDecorationLine: "line-through",
  },

  salePrice: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: "800",
  },

  normalPrice: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: "800",
  },

  stock: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
  },

  description: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
  },

  attributesCard: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },

  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  attributeRow: {
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },

  attributeName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "700",
  },

  attributeValue: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginTop: 2,
  },

  prescriptionCard: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    ...theme.shadow.card,
  },

  prescriptionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  prescriptionText: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
  },

  prescriptionButton: {
    minHeight: theme.a11y.minTouch,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
  },

  prescriptionButtonPressed: {
    backgroundColor: theme.colors.primaryPressed,
  },

  prescriptionButtonText: {
    ...theme.typography.body,
    color: theme.colors.onPrimary,
    fontWeight: "800",
  },

  buyButton: {
    marginTop: theme.spacing.lg,
    minHeight: theme.a11y.minTouch,
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
  },

  buyButtonText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: "800",
  },
});
