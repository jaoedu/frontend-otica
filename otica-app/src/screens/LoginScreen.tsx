import { View, Text, TextInput, Pressable,} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginForm } from "@/utils/validators";
import { theme } from "@/utils/theme";
import AppButton from "@/components/AppButton";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/navigation/AuthStack";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange", // valida enquanto digita (bom pra UX)
  });

  const login = useAuthStore((s) => s.login);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const authError = useAuthStore((s) => s.authError);

async function onSubmit(data: LoginForm) {
  await login(data.email, data.password);
  }
  
  {!!authError && (
  <Text accessibilityRole="alert" style={{ color: theme.colors.danger, textAlign: "center" }}>
    {authError}
  </Text>
)}


  return (
    <View
      style={{
        flex: 1,
        padding: theme.spacing.md,
        justifyContent: "center",
        gap: theme.spacing.sm,
      }}
    >
      <Text
        accessibilityRole="header"
        style={{ fontSize: 24, fontWeight: "800", color: theme.colors.text }}
      >
        Entrar
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        accessibilityLabel="Email"
        accessibilityHint="Digite seu email"
        onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
        style={{
          borderWidth: 1,
          borderColor: errors.email ? theme.colors.danger : theme.colors.border,
          borderRadius: theme.radius.md,
          padding: 12,
          minHeight: 44,
        }}
      />
      {!!errors.email && (
        <Text accessibilityRole="alert" style={{ color: theme.colors.danger }}>
          {errors.email.message}
        </Text>
      )}

      <TextInput
        placeholder="Senha"
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onSubmit)}
        accessibilityLabel="Senha"
        accessibilityHint="Digite sua senha"
        onChangeText={(t) => setValue("password", t, { shouldValidate: true })}
        style={{
          borderWidth: 1,
          borderColor: errors.password ? theme.colors.danger : theme.colors.border,
          borderRadius: theme.radius.md,
          padding: 12,
          marginTop: 8,
          minHeight: 44,
        }}
      />
      {!!errors.password && (
        <Text accessibilityRole="alert" style={{ color: theme.colors.danger }}>
          {errors.password.message}
        </Text>
      )}

      <View style={{ marginTop: 12, gap: 10 }}>
        <AppButton
  title={isAuthLoading ? "Entrando..." : "Entrar"}
  onPress={handleSubmit(onSubmit)}
  disabled={isAuthLoading}
  loading={isAuthLoading}
/>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Criar conta"
          accessibilityHint="Abre a tela de cadastro"
          hitSlop={12}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Criar conta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
