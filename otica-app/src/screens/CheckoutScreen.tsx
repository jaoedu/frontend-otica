import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { checkout } from "@/api/orders";
import type { Address, AddressPayload } from "@/api/auth";
import AppButton from "@/components/AppButton";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { usePrescriptionStore } from "@/store/prescriptionStore";
import { theme } from "@/utils/theme";
import type { CartStackParamList } from "@/navigation/CartStack";

type Props = NativeStackScreenProps<CartStackParamList, "Checkout">;

const emptyAddress: AddressPayload = {
  label: "Casa",
  zipcode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  is_default: false,
};

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatAddress(address: Address) {
  return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}`;
}

function normalizeAddressPayload(payload: AddressPayload): AddressPayload {
  return {
    label: payload.label.trim(),
    zipcode: payload.zipcode.trim(),
    street: payload.street.trim(),
    number: payload.number.trim(),
    complement: payload.complement.trim(),
    neighborhood: payload.neighborhood.trim(),
    city: payload.city.trim(),
    state: payload.state.trim().toUpperCase(),
    is_default: payload.is_default,
  };
}

function isAddressValid(payload: AddressPayload) {
  const normalized = normalizeAddressPayload(payload);
  return Boolean(
    normalized.label &&
      normalized.zipcode &&
      normalized.street &&
      normalized.number &&
      normalized.neighborhood &&
      normalized.city &&
      normalized.state.length === 2
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}: FieldProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text
        allowFontScaling
        style={{ color: theme.colors.text, fontWeight: "800" }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor={theme.colors.muted}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={{
          minHeight: 46,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          paddingHorizontal: 12,
          color: theme.colors.text,
          backgroundColor: theme.colors.bg,
        }}
      />
    </View>
  );
}

export default function CheckoutScreen({ navigation }: Props) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clear);

  const user = useAuthStore((s) => s.user);
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const createAddress = useAuthStore((s) => s.createAddress);

  const photoUri = usePrescriptionStore((s) => s.photoUri);
  const notes = usePrescriptionStore((s) => s.notes);
  const setNotes = usePrescriptionStore((s) => s.setNotes);
  const clearPrescription = usePrescriptionStore((s) => s.clear);
  const setPrescriptionPhoto = usePrescriptionStore((s) => s.setPhotoUri);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressPayload>(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addresses = useMemo(() => user?.addresses ?? [], [user?.addresses]);
  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  useEffect(() => {
    if (!addresses.length) {
      setSelectedAddressId(null);
      setShowAddressForm(true);
      setAddressForm({ ...emptyAddress, is_default: true });
      return;
    }

    if (!selectedAddressId || !addresses.some((item) => item.id === selectedAddressId)) {
      const defaultAddress = addresses.find((address) => address.is_default) ?? addresses[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  async function handleCreateAddress() {
    const payload = normalizeAddressPayload(addressForm);
    if (!isAddressValid(payload)) {
      Alert.alert("Endereco incompleto", "Preencha os campos obrigatorios.");
      return;
    }

    try {
      setSavingAddress(true);
      const address = await createAddress(payload);
      setSelectedAddressId(address.id);
      setShowAddressForm(false);
      setAddressForm(emptyAddress);
    } catch {
      Alert.alert("Erro", "Nao foi possivel salvar o endereco.");
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleFinishOrder() {
    if (!items.length) {
      Alert.alert("Carrinho vazio", "Adicione produtos antes de finalizar.");
      navigation.goBack();
      return;
    }

    if (!selectedAddress) {
      Alert.alert("Endereco obrigatorio", "Escolha ou cadastre um endereco.");
      setShowAddressForm(true);
      return;
    }

    try {
      setSubmitting(true);
      const order = await checkout({
        address_id: selectedAddress.id,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        prescription_notes: notes,
        prescription_image_uri: photoUri,
      });

      clearCart();
      clearPrescription();

      Alert.alert("Pedido criado", `Pedido #${order.id} criado com sucesso.`, [
        {
          text: "Ver pedidos",
          onPress: () => navigation.getParent<any>()?.navigate("Orders"),
        },
      ]);
    } catch (error: any) {
      const detail =
        error?.response?.data?.stock ||
        error?.response?.data?.address_id ||
        error?.response?.data?.detail ||
        "Verifique estoque, endereco ou servidor e tente novamente.";
      Alert.alert("Erro no checkout", String(detail));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingBottom: 150,
          gap: theme.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
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
            Confirme entrega, receita e itens antes de finalizar.
          </Text>
        </View>

        <View
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
            Cliente
          </Text>
          <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "800" }}>
            {user?.name?.trim() || "Cliente"}
          </Text>
          <Text allowFontScaling style={{ color: theme.colors.muted }}>
            {user?.email}
          </Text>
          <Text allowFontScaling style={{ color: theme.colors.muted }}>
            {user?.phone?.trim() || "Telefone nao informado"}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.md,
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                allowFontScaling
                style={{ fontSize: 16, fontWeight: "900", color: theme.colors.text }}
              >
                Endereco de entrega
              </Text>
              <Text allowFontScaling style={{ color: theme.colors.muted }}>
                Escolha um endereco salvo ou cadastre um novo.
              </Text>
            </View>
            <View style={{ width: 120 }}>
              <AppButton
                title="Adicionar"
                variant="outline"
                onPress={() => {
                  setAddressForm({
                    ...emptyAddress,
                    is_default: addresses.length === 0,
                  });
                  setShowAddressForm(true);
                }}
              />
            </View>
          </View>

          {addresses.map((address) => {
            const selected = address.id === selectedAddressId;
            return (
              <Pressable
                key={address.id}
                onPress={() => setSelectedAddressId(address.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                style={({ pressed }) => ({
                  borderWidth: 1,
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.bg,
                  padding: 12,
                  gap: 4,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <Text
                    allowFontScaling
                    style={{ color: theme.colors.text, fontWeight: "900" }}
                  >
                    {selected ? "(x) " : "( ) "}
                    {address.label}
                  </Text>
                  {address.is_default ? (
                    <Text
                      allowFontScaling
                      style={{ color: "#9A6700", fontWeight: "800" }}
                    >
                      Padrao
                    </Text>
                  ) : null}
                </View>
                <Text allowFontScaling style={{ color: theme.colors.muted }}>
                  {formatAddress(address)}
                </Text>
                <Text allowFontScaling style={{ color: theme.colors.muted }}>
                  CEP {address.zipcode}
                  {address.complement ? ` - ${address.complement}` : ""}
                </Text>
              </Pressable>
            );
          })}

          {showAddressForm ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.bg,
                padding: 12,
                gap: 10,
              }}
            >
              <Text
                allowFontScaling
                style={{ color: theme.colors.text, fontWeight: "900" }}
              >
                Novo endereco
              </Text>
              <Field
                label="Identificacao"
                value={addressForm.label}
                onChangeText={(value) =>
                  setAddressForm((current) => ({ ...current, label: value }))
                }
                placeholder="Casa, Trabalho..."
              />
              <Field
                label="CEP"
                value={addressForm.zipcode}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setAddressForm((current) => ({ ...current, zipcode: value }))
                }
              />
              <Field
                label="Rua"
                value={addressForm.street}
                onChangeText={(value) =>
                  setAddressForm((current) => ({ ...current, street: value }))
                }
              />
              <Field
                label="Numero"
                value={addressForm.number}
                onChangeText={(value) =>
                  setAddressForm((current) => ({ ...current, number: value }))
                }
              />
              <Field
                label="Complemento"
                value={addressForm.complement}
                onChangeText={(value) =>
                  setAddressForm((current) => ({ ...current, complement: value }))
                }
              />
              <Field
                label="Bairro"
                value={addressForm.neighborhood}
                onChangeText={(value) =>
                  setAddressForm((current) => ({
                    ...current,
                    neighborhood: value,
                  }))
                }
              />
              <Field
                label="Cidade"
                value={addressForm.city}
                onChangeText={(value) =>
                  setAddressForm((current) => ({ ...current, city: value }))
                }
              />
              <Field
                label="UF"
                value={addressForm.state}
                onChangeText={(value) =>
                  setAddressForm((current) => ({
                    ...current,
                    state: value.toUpperCase().slice(0, 2),
                  }))
                }
                placeholder="SP"
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Cancelar"
                    variant="outline"
                    onPress={() => setShowAddressForm(false)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Salvar"
                    onPress={handleCreateAddress}
                    loading={savingAddress}
                  />
                </View>
              </View>
            </View>
          ) : null}
        </View>

        <View
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
            Receita
          </Text>

          {photoUri ? (
            <View style={{ gap: 10 }}>
              <Image
                source={{ uri: photoUri }}
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.bg,
                }}
                resizeMode="cover"
                accessibilityRole="image"
                accessibilityLabel="Foto da receita anexada"
              />
              <AppButton
                title="Remover receita"
                variant="danger"
                onPress={() => setPrescriptionPhoto(null)}
              />
            </View>
          ) : (
            <Text allowFontScaling style={{ color: theme.colors.muted }}>
              Receita opcional. Voce pode finalizar sem anexar foto.
            </Text>
          )}

          <AppButton
            title={photoUri ? "Trocar foto da receita" : "Anexar receita"}
            variant="outline"
            onPress={() => navigation.navigate("PrescriptionUpload")}
          />

          <View style={{ gap: 6 }}>
            <Text
              allowFontScaling
              style={{ color: theme.colors.text, fontWeight: "800" }}
            >
              Observacoes da receita
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: lente antirreflexo, filtro azul, medidas especiais..."
              placeholderTextColor={theme.colors.muted}
              multiline
              style={{
                minHeight: 96,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
                padding: 12,
                textAlignVertical: "top",
                color: theme.colors.text,
                backgroundColor: theme.colors.bg,
              }}
            />
          </View>
        </View>

        <View
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

          {items.map((item) => {
            const unitPrice = Number(item.product.final_price || item.product.price);
            const subtotal = unitPrice * item.quantity;
            return (
              <View
                key={item.product.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <Text
                  allowFontScaling
                  numberOfLines={2}
                  style={{ flex: 1, color: theme.colors.muted, fontWeight: "700" }}
                >
                  {item.quantity}x {item.product.name}
                </Text>
                <Text
                  allowFontScaling
                  style={{ color: theme.colors.text, fontWeight: "800" }}
                >
                  {formatBRL(subtotal)}
                </Text>
              </View>
            );
          })}

          <View style={{ height: 1, backgroundColor: theme.colors.border }} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text allowFontScaling style={{ color: theme.colors.muted, fontWeight: "700" }}>
              Entrega
            </Text>
            <Text allowFontScaling style={{ color: theme.colors.text, fontWeight: "800" }}>
              A combinar
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text
              allowFontScaling
              style={{ color: theme.colors.text, fontWeight: "900", fontSize: 18 }}
            >
              Total
            </Text>
            <Text
              allowFontScaling
              style={{ color: theme.colors.text, fontWeight: "900", fontSize: 18 }}
            >
              {formatBRL(total())}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        accessible
        accessibilityRole="toolbar"
        accessibilityLabel="Acoes do checkout"
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
          title={submitting ? "Finalizando..." : "Finalizar pedido"}
          onPress={handleFinishOrder}
          loading={submitting}
          disabled={submitting || !items.length}
          accessibilityLabel="Finalizar pedido"
          accessibilityHint="Cria o pedido com os itens do carrinho"
        />
      </View>
    </View>
  );
}
