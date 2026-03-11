import { View, Text, ScrollView } from "react-native";
import { theme } from "@/utils/theme";
import AppButton from "@/components/AppButton";

export default function CheckoutScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingBottom: 120,
          gap: theme.spacing.md,
        }}
      >
        {/* Header */}
        <View style={{ gap: 6 }}>
          <Text
            allowFontScaling
            accessibilityRole="header"
            style={{ fontSize: 24, fontWeight: "900", color: theme.colors.text }}
          >
            Checkout
          </Text>
          <Text
            allowFontScaling
            style={{ color: theme.colors.muted, fontWeight: "600" }}
          >
            Revise as informações antes de finalizar seu pedido.
          </Text>
        </View>

        {/* Entrega */}
        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel="Seção de entrega"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.md,
            gap: 10,
          }}
        >
          <Text
            allowFontScaling
            style={{ fontSize: 16, fontWeight: "900", color: theme.colors.text }}
          >
            Entrega
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: 12,
              backgroundColor: theme.colors.bg,
              gap: 4,
            }}
          >
            <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "800" }}>
              Endereço
            </Text>
            <Text allowFontScaling style={{ color: theme.colors.muted }}>
              Adicione ou confirme o endereço de entrega.
            </Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: 12,
              backgroundColor: theme.colors.bg,
              gap: 4,
            }}
          >
            <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "800" }}>
              Forma de recebimento
            </Text>
            <Text allowFontScaling style={{ color: theme.colors.muted }}>
              Entrega em domicílio ou retirada na loja.
            </Text>
          </View>
        </View>

        {/* Receita */}
        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel="Seção de receita"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.md,
            gap: 10,
          }}
        >
          <Text
            allowFontScaling
            style={{ fontSize: 16, fontWeight: "900", color: theme.colors.text }}
          >
            Receita
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: 12,
              backgroundColor: theme.colors.bg,
              gap: 4,
            }}
          >
            <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "800" }}>
              Dados da receita
            </Text>
            <Text allowFontScaling style={{ color: theme.colors.muted }}>
              Adicione a receita ou confirme as medidas informadas.
            </Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: 12,
              backgroundColor: theme.colors.bg,
              gap: 4,
            }}
          >
            <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "800" }}>
              Observações
            </Text>
            <Text allowFontScaling style={{ color: theme.colors.muted }}>
              Exemplo: lente com antirreflexo, fotocromática ou filtro azul.
            </Text>
          </View>
        </View>

        {/* Resumo */}
        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel="Resumo do pedido"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.md,
            gap: 12,
          }}
        >
          <Text
            allowFontScaling
            style={{ fontSize: 16, fontWeight: "900", color: theme.colors.text }}
          >
            Resumo do pedido
          </Text>

          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text allowFontScaling style={{ color: theme.colors.muted, fontWeight: "700" }}>
                Subtotal
              </Text>
              <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "800" }}>
                R$ 0,00
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text allowFontScaling style={{ color: theme.colors.muted, fontWeight: "700" }}>
                Entrega
              </Text>
              <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "800" }}>
                A calcular
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: theme.colors.border,
                marginVertical: 4,
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>
                Total
              </Text>
              <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>
                R$ 0,00
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer fixo */}
      <View
        accessible
        accessibilityRole="toolbar"
        accessibilityLabel="Ações do checkout"
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
        <AppButton
          title="Finalizar pedido"
          onPress={() => {}}
          accessibilityLabel="Finalizar pedido"
          accessibilityHint="Confirma as informações e envia o pedido"
        />
      </View>
    </View>
  );
}