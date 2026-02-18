import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { theme } from "@/utils/theme";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "outline" | "danger";
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  accessibilityHint,
}: Props) {
  const isDisabled = disabled || loading;

  const background =
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
      ? theme.colors.danger
      : "transparent";

  const borderColor =
    variant === "outline" ? theme.colors.primary : "transparent";

  const textColor =
    variant === "outline" ? theme.colors.primary : "#000";

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={title}
      accessibilityHint={
        accessibilityHint ?? `Toque duas vezes para ${title.toLowerCase()}`
      }
      onPress={isDisabled ? undefined : onPress}
      hitSlop={12}
      style={{
        minHeight: 48, // WCAG: alvo de toque
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: background,
        borderColor,
        borderWidth: variant === "outline" ? 1 : 0,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        opacity: isDisabled ? 0.55 : 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {loading ? <ActivityIndicator /> : null}
        <Text style={{ color: textColor, fontWeight: "700" }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
