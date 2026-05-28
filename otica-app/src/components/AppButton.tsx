import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  PressableProps,
} from "react-native";
import { theme } from "@/utils/theme";

type Props = PressableProps & {
  title: string;
  variant?: "primary" | "outline" | "danger";
  loading?: boolean;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  accessibilityHint,
  accessibilityLabel,
  
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  const background =
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
      ? theme.colors.danger
      : "transparent";

  const borderColor = variant === "outline" ? theme.colors.primary : "transparent";

  // ⚠️ importante: contraste — texto branco em primary/danger
  const textColor =
    variant === "outline" ? theme.colors.primary : theme.colors.white;

  return (
    <Pressable
      {...rest}
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint ?? `Toque duas vezes para ${title.toLowerCase()}`}
      onPress={isDisabled ? undefined : onPress}
      hitSlop={12}
      style={({ pressed }) => [
        {
          minHeight: 48,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: background,
          borderColor,
          borderWidth: variant === "outline" ? 1 : 0,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
          opacity: isDisabled ? 0.55 : pressed ? 0.9 : 1,
        },
        // permite sobrescrever estilo vindo de fora
        typeof rest.style === "function" ? {} : (rest.style as any),
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {loading ? <ActivityIndicator /> : null}
        <Text allowFontScaling style={{ color: textColor, fontWeight: "800" }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}