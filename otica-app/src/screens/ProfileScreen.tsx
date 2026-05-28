import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import AppButton from "@/components/AppButton";
import { useAuthStore } from "@/store/authStore";
import { theme } from "@/utils/theme";
import type { AppTabParamList } from "@/navigation/AppTabs";
import type { Address, AddressPayload } from "@/api/auth";

type Nav = BottomTabNavigationProp<AppTabParamList, "Profile">;

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

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || "Cliente";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatAddress(address?: Address) {
  if (!address) return "Nenhum endereco cadastrado";
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
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
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

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const createAddress = useAuthStore((s) => s.createAddress);
  const updateAddress = useAuthStore((s) => s.updateAddress);
  const deleteAddress = useAuthStore((s) => s.deleteAddress);

  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<AddressPayload>(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);

  const addresses = useMemo(() => user?.addresses ?? [], [user?.addresses]);
  const defaultAddress = useMemo(
    () => addresses.find((address) => address.is_default) ?? addresses[0],
    [addresses]
  );

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  useEffect(() => {
    if (!editingProfile) {
      setName(user?.name ?? "");
      setPhone(user?.phone ?? "");
    }
  }, [editingProfile, user?.name, user?.phone]);

  function startNewAddress() {
    setEditingAddress(null);
    setAddressForm({
      ...emptyAddress,
      is_default: addresses.length === 0,
    });
    setShowAddressForm(true);
  }

  function startEditAddress(address: Address) {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      zipcode: address.zipcode,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      is_default: address.is_default,
    });
    setShowAddressForm(true);
  }

  function cancelAddressForm() {
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    setShowAddressForm(false);
  }

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
      });
      setEditingProfile(false);
      Alert.alert("Perfil salvo", "Seus dados foram atualizados.");
    } catch {
      Alert.alert("Erro", "Nao foi possivel salvar o perfil.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveAddress() {
    const payload = normalizeAddressPayload(addressForm);
    if (!isAddressValid(payload)) {
      Alert.alert("Endereco incompleto", "Preencha todos os campos obrigatorios.");
      return;
    }

    try {
      setSavingAddress(true);
      if (editingAddress) {
        await updateAddress(editingAddress.id, payload);
      } else {
        await createAddress(payload);
      }
      cancelAddressForm();
      Alert.alert("Endereco salvo", "Seu endereco foi atualizado.");
    } catch {
      Alert.alert("Erro", "Nao foi possivel salvar o endereco.");
    } finally {
      setSavingAddress(false);
    }
  }

  function handleDeleteAddress(address: Address) {
    Alert.alert(
      "Excluir endereco",
      `Deseja excluir "${address.label}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(address.id);
            } catch {
              Alert.alert("Erro", "Nao foi possivel excluir o endereco.");
            }
          },
        },
      ]
    );
  }

  function handleLogout() {
    Alert.alert(
      "Sair da conta",
      "Deseja encerrar sua sessao neste aparelho?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logout },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingBottom: theme.spacing.xl,
          gap: theme.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 4 }}>
          <Text
            accessibilityRole="header"
            allowFontScaling
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: theme.colors.text,
            }}
          >
            Perfil
          </Text>

          <Text
            allowFontScaling
            style={{
              color: theme.colors.muted,
              fontWeight: "600",
            }}
          >
            Gerencie seus dados, enderecos e pedidos.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.md,
            gap: theme.spacing.md,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              accessible
              accessibilityLabel={`Iniciais ${getInitials(user?.name, user?.email)}`}
              style={{
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: theme.colors.text,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                allowFontScaling
                style={{ color: theme.colors.white, fontWeight: "900", fontSize: 20 }}
              >
                {getInitials(user?.name, user?.email)}
              </Text>
            </View>

            <View style={{ flex: 1, gap: 4 }}>
              <Text
                allowFontScaling
                style={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                {user?.name?.trim() || "Cliente"}
              </Text>
              <Text allowFontScaling style={{ color: theme.colors.muted }}>
                {user?.email}
              </Text>
              <Text allowFontScaling style={{ color: theme.colors.muted }}>
                {user?.phone?.trim() || "Telefone nao informado"}
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
            <Text
              allowFontScaling
              style={{ color: theme.colors.text, fontWeight: "900" }}
            >
              Endereco padrao
            </Text>
            <Text allowFontScaling style={{ color: theme.colors.muted }}>
              {formatAddress(defaultAddress)}
            </Text>
          </View>

          {editingProfile ? (
            <View style={{ gap: 12 }}>
              <Field label="Nome" value={name} onChangeText={setName} />
              <Field
                label="Telefone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Cancelar"
                    variant="outline"
                    onPress={() => setEditingProfile(false)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Salvar"
                    onPress={handleSaveProfile}
                    loading={savingProfile}
                  />
                </View>
              </View>
            </View>
          ) : (
            <AppButton
              title="Editar dados"
              variant="outline"
              onPress={() => setEditingProfile(true)}
            />
          )}
        </View>

        <View style={{ gap: 10 }}>
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
                style={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                Meus enderecos
              </Text>
              <Text allowFontScaling style={{ color: theme.colors.muted }}>
                Cadastre casa, trabalho ou outro local de entrega.
              </Text>
            </View>
            <View style={{ width: 120 }}>
              <AppButton title="Adicionar" onPress={startNewAddress} />
            </View>
          </View>

          {addresses.map((address) => (
            <View
              key={address.id}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: address.is_default
                  ? theme.colors.primary
                  : theme.colors.border,
                padding: theme.spacing.md,
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <Text
                    allowFontScaling
                    style={{ color: theme.colors.text, fontWeight: "900" }}
                  >
                    {address.label}
                  </Text>
                  <Text allowFontScaling style={{ color: theme.colors.muted }}>
                    {formatAddress(address)}
                  </Text>
                  <Text allowFontScaling style={{ color: theme.colors.muted }}>
                    CEP {address.zipcode}
                    {address.complement ? ` - ${address.complement}` : ""}
                  </Text>
                </View>
                {address.is_default ? (
                  <View
                    style={{
                      alignSelf: "flex-start",
                      borderRadius: theme.radius.pill,
                      backgroundColor: theme.colors.warningBg,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                    }}
                  >
                    <Text
                      allowFontScaling
                      style={{ color: "#9A6700", fontWeight: "800", fontSize: 12 }}
                    >
                      Padrao
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={{ flexDirection: "row", gap: 8 }}>
                {!address.is_default ? (
                  <View style={{ flex: 1 }}>
                    <AppButton
                      title="Padrao"
                      variant="outline"
                      onPress={() => updateAddress(address.id, { is_default: true })}
                    />
                  </View>
                ) : null}
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Editar"
                    variant="outline"
                    onPress={() => startEditAddress(address)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Excluir"
                    variant="danger"
                    onPress={() => handleDeleteAddress(address)}
                  />
                </View>
              </View>
            </View>
          ))}

          {!addresses.length ? (
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: theme.spacing.md,
                gap: 8,
              }}
            >
              <Text
                allowFontScaling
                style={{ color: theme.colors.text, fontWeight: "900" }}
              >
                Nenhum endereco salvo
              </Text>
              <Text allowFontScaling style={{ color: theme.colors.muted }}>
                Adicione um endereco para finalizar pedidos com entrega.
              </Text>
            </View>
          ) : null}
        </View>

        {showAddressForm ? (
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
              style={{ color: theme.colors.text, fontSize: 18, fontWeight: "900" }}
            >
              {editingAddress ? "Editar endereco" : "Novo endereco"}
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
                setAddressForm((current) => ({ ...current, neighborhood: value }))
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

            <Pressable
              onPress={() =>
                setAddressForm((current) => ({
                  ...current,
                  is_default: !current.is_default,
                }))
              }
              accessibilityRole="checkbox"
              accessibilityState={{ checked: addressForm.is_default }}
              style={({ pressed }) => ({
                minHeight: 48,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.bg,
                justifyContent: "center",
                paddingHorizontal: 12,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                allowFontScaling
                style={{ color: theme.colors.text, fontWeight: "800" }}
              >
                {addressForm.is_default ? "[x]" : "[ ]"} Usar como endereco padrao
              </Text>
            </Pressable>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <AppButton
                  title="Cancelar"
                  variant="outline"
                  onPress={cancelAddressForm}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppButton
                  title="Salvar"
                  onPress={handleSaveAddress}
                  loading={savingAddress}
                />
              </View>
            </View>
          </View>
        ) : null}

        <View style={{ gap: 10 }}>
          <AppButton
            title="Ver pedidos"
            variant="outline"
            onPress={() => navigation.navigate("Orders")}
          />
          <AppButton
            title="Sair da conta"
            variant="danger"
            onPress={handleLogout}
            accessibilityLabel="Sair da conta"
            accessibilityHint="Encerra sua sessao no aplicativo"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
