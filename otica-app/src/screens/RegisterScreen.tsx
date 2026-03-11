import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { registerSchema, type RegisterForm } from "@/utils/validators";
import { theme } from "@/utils/theme";
import AppButton from "@/components/AppButton";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/navigation/AuthStack";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Register">;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();

  const register = useAuthStore((s) => s.register);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const authError = useAuthStore((s) => s.authError);

  const {
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  async function onSubmit(data: RegisterForm) {
    await register(data.name, data.email, data.password);
    navigation.goBack();
  }

  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  } as const;

  const labelStyle = {
    color: theme.colors.text,
    fontWeight: "800" as const,
    marginBottom: 6,
  };

  const helperStyle = {
    color: theme.colors.muted,
    fontWeight: "600" as const,
    marginTop: 6,
  };

  const inputStyle = (hasError?: boolean) =>
    ({
      borderWidth: 1,
      borderColor: hasError ? theme.colors.danger : theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: 12,
      paddingVertical: 12,
      minHeight: 44, // alvo de toque
      color: theme.colors.text,
      backgroundColor: theme.colors.bg,
    }) as const;

  const ErrorText = ({ msg }: { msg?: string }) =>
    msg ? (
      <Text allowFontScaling accessibilityRole="alert" style={{ color: theme.colors.danger, fontWeight: "700" }}>
        {msg}
      </Text>
    ) : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: theme.spacing.md, justifyContent: "center" }}>
        {/* Header */}
        <View style={{ marginBottom: theme.spacing.md, gap: 6 }}>
          <Text allowFontScaling accessibilityRole="header" style={{ fontSize: 26, fontWeight: "900", color: theme.colors.text }}>
            Criar conta
          </Text>
          <Text allowFontScaling style={{ color: theme.colors.muted, fontWeight: "600" }}>
            Cadastre-se para comprar armações e lentes com segurança.
          </Text>
        </View>

        {/* Card do formulário */}
        <View style={cardStyle}>
          {/* Nome */}
          <View>
            <Text allowFontScaling style={labelStyle}>Nome</Text>
            <TextInput
              placeholder="Ex: João Mota"
              placeholderTextColor={theme.colors.muted}
              accessibilityLabel="Nome"
              accessibilityHint="Digite seu nome completo"
              onChangeText={(t) => setValue("name", t, { shouldValidate: true })}
              style={inputStyle(!!errors.name)}
              returnKeyType="next"
              textContentType="name"
              autoComplete="name"
              allowFontScaling
            />
            <ErrorText msg={errors.name?.message} />
          </View>

          {/* Email */}
          <View>
            <Text allowFontScaling style={labelStyle}>Email</Text>
            <TextInput
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={theme.colors.muted}
              accessibilityLabel="Email"
              accessibilityHint="Digite seu email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
              style={inputStyle(!!errors.email)}
              returnKeyType="next"
              allowFontScaling
            />
            <ErrorText msg={errors.email?.message} />
          </View>

          {/* Senha */}
          <View>
            <Text allowFontScaling style={labelStyle}>Senha</Text>
            <TextInput
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={theme.colors.muted}
              accessibilityLabel="Senha"
              accessibilityHint="Crie uma senha com pelo menos 6 caracteres"
              secureTextEntry
              textContentType="newPassword"
              autoComplete="password-new"
              onChangeText={(t) => setValue("password", t, { shouldValidate: true })}
              style={inputStyle(!!errors.password)}
              returnKeyType="next"
              allowFontScaling
            />
            <Text allowFontScaling style={helperStyle}>
              Dica: use letras e números para mais segurança.
            </Text>
            <ErrorText msg={errors.password?.message} />
          </View>

          {/* Confirmar senha */}
          <View>
            <Text allowFontScaling style={labelStyle}>Confirmar senha</Text>
            <TextInput
              placeholder="Digite a senha novamente"
              placeholderTextColor={theme.colors.muted}
              accessibilityLabel="Confirmar senha"
              accessibilityHint="Digite a senha novamente para confirmar"
              secureTextEntry
              onChangeText={(t) => setValue("confirmPassword", t, { shouldValidate: true })}
              style={inputStyle(!!errors.confirmPassword)}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              allowFontScaling
            />
            <ErrorText msg={errors.confirmPassword?.message} />
          </View>

          {/* Erro de backend */}
          {!!authError && (
            <Text
              allowFontScaling
              accessibilityRole="alert"
              style={{
                color: theme.colors.danger,
                fontWeight: "800",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              {authError}
            </Text>
          )}

          {/* CTA */}
          <View style={{ marginTop: 6, gap: 10 }}>
            <AppButton
              title={isAuthLoading ? "Cadastrando..." : "Cadastrar"}
              onPress={handleSubmit(onSubmit)}
              disabled={isAuthLoading || !isValid}
              loading={isAuthLoading}
              accessibilityLabel="Cadastrar"
              accessibilityHint="Cria sua conta e volta para o login"
            />

            <AppButton
              title="Já tenho conta"
              onPress={() => navigation.goBack()}
              variant="outline"
              accessibilityLabel="Já tenho conta"
              accessibilityHint="Volta para a tela de login"
            />
          </View>
        </View>

        {/* Rodapé de ajuda */}
        <View style={{ marginTop: theme.spacing.md, alignItems: "center" }}>
          <Pressable
            onPress={() => {}}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Ajuda"
            accessibilityHint="Abre o canal de ajuda"
            hitSlop={12}
            style={{ minHeight: 44, justifyContent: "center" }}
          >
            <Text allowFontScaling style={{ color: theme.colors.muted, fontWeight: "700" }}>
              Precisa de ajuda? Fale com a loja.
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}