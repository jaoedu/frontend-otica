import { Pressable, Text, StyleSheet } from "react-native";
import { theme } from "@/utils/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "danger";
};

export default function AppButton({ title, onPress, variant = "primary" }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && {
          backgroundColor: pressed ? theme.colors.primaryPressed : theme.colors.primary,
        },
        variant === "outline" && {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        variant === "danger" && {
          backgroundColor: pressed ? "#B91C1C" : theme.colors.danger,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "outline" ? { color: theme.colors.text } : { color: "#111" },
          variant === "danger" ? { color: "#fff" } : null,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
