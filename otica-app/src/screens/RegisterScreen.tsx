import { View, Text, TextInput, Pressable } from "react-native";
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
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  async function onSubmit(data: RegisterForm) {
    await register(data.name, data.email, data.password);
    navigation.goBack();
  }

  const inputStyle = (hasError?: boolean) => ({
    borderWidth: 1,
    borderColor: hasError ? theme.colors.danger : theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 12,
    minHeight: 44, // WCAG
  });

  return (
    <View style={{ flex: 1, padding: theme.spacing.md, justifyContent: "center", gap: theme.spacing.sm }}>
      <Text
        accessibilityRole="header"
        style={{ fontSize: 24, fontWeight: "800", color: theme.colors.text }}
      >
        Criar conta
      </Text>

      <TextInput
        placeholder="Nome"
        accessibilityLabel="Nome"
        accessibilityHint="Digite seu nome"
        onChangeText={(t) => setValue("name", t, { shouldValidate: true })}
        style={inputStyle(!!errors.name)}
        returnKeyType="next"
        textContentType="name"
        autoComplete="name"
      />
      {!!errors.name && (
        <Text accessibilityRole="alert" style={{ color: theme.colors.danger }}>
          {errors.name.message}
        </Text>
      )}

      <TextInput
        placeholder="Email"
        accessibilityLabel="Email"
        accessibilityHint="Digite seu email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
        style={inputStyle(!!errors.email)}
        returnKeyType="next"
      />
      {!!errors.email && (
        <Text accessibilityRole="alert" style={{ color: theme.colors.danger }}>
          {errors.email.message}
        </Text>
      )}

      <TextInput
        placeholder="Senha"
        accessibilityLabel="Senha"
        accessibilityHint="Crie uma senha com pelo menos 6 caracteres"
        secureTextEntry
        textContentType="newPassword"
        autoComplete="password-new"
        onChangeText={(t) => setValue("password", t, { shouldValidate: true })}
        style={inputStyle(!!errors.password)}
        returnKeyType="next"
      />
      {!!errors.password && (
        <Text accessibilityRole="alert" style={{ color: theme.colors.danger }}>
          {errors.password.message}
        </Text>
      )}

      <TextInput
        placeholder="Confirmar senha"
        accessibilityLabel="Confirmar senha"
        accessibilityHint="Digite a senha novamente para confirmar"
        secureTextEntry
        onChangeText={(t) => setValue("confirmPassword", t, { shouldValidate: true })}
        style={inputStyle(!!errors.confirmPassword)}
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onSubmit)}
      />
      {!!errors.confirmPassword && (
        <Text accessibilityRole="alert" style={{ color: theme.colors.danger }}>
          {errors.confirmPassword.message}
        </Text>
      )}

      <View style={{ marginTop: 12, gap: 10 }}>
        <AppButton
            title={isAuthLoading ? "Cadastrando..." : "Cadastrar"}
            onPress={handleSubmit(onSubmit)}
            disabled={isAuthLoading}
            loading={isAuthLoading}
            />

        {!!authError && (
          <Text accessibilityRole="alert" style={{ color: theme.colors.danger, textAlign: "center" }}>
            {authError}
          </Text>
        )}

        <Pressable
          onPress={() => navigation.goBack()}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Já tenho conta"
          accessibilityHint="Volta para a tela de login"
          hitSlop={12}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: "700", textAlign: "center" }}>
            Já tenho conta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
