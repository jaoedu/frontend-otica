import { useEffect } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { usePrescriptionStore } from "@/store/prescriptionStore";
import { theme } from "@/utils/theme";

type Props = {
  navigation: any;
  route: { params?: { photoUri?: string } };
};

export default function PrescriptionUploadScreen({ navigation, route }: Props) {
  const photoUri = usePrescriptionStore((s) => s.photoUri);
  const setPhotoUri = usePrescriptionStore((s) => s.setPhotoUri);

  useEffect(() => {
    if (route.params?.photoUri) {
      setPhotoUri(route.params.photoUri);
    }
  }, [route.params?.photoUri, setPhotoUri]);

  function handleOpenCamera() {
    navigation.navigate("PrescriptionCamera");
  }

  function handleRemovePhoto() {
    setPhotoUri(null);
  }

  function handleConfirm() {
    navigation.goBack();
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Anexar receita</Text>

      <Text style={styles.subtitle}>
        Fotografe sua receita medica e anexe ao pedido para facilitar o atendimento.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Dicas para uma boa foto</Text>
        <Text style={styles.infoText}>- Deixe a receita bem iluminada</Text>
        <Text style={styles.infoText}>- Evite sombras e cortes nas bordas</Text>
        <Text style={styles.infoText}>- Mantenha o texto legivel</Text>
      </View>

      <View style={styles.card}>
        {photoUri ? (
          <>
            <Image source={{ uri: photoUri }} style={styles.preview} />
            <View style={styles.statusRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Receita anexada</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>Nenhuma receita anexada</Text>
            <Text style={styles.placeholderText}>
              Toque no botao abaixo para fotografar sua receita.
            </Text>
          </View>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
        ]}
        onPress={handleOpenCamera}
        accessibilityRole="button"
        accessibilityLabel={photoUri ? "Tirar outra foto da receita" : "Fotografar receita"}
        hitSlop={theme.a11y.hitSlop}
      >
        <Text style={styles.primaryButtonText}>
          {photoUri ? "Tirar outra foto" : "Fotografar receita"}
        </Text>
      </Pressable>

      {photoUri ? (
        <>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={handleRemovePhoto}
            accessibilityRole="button"
            accessibilityLabel="Remover foto da receita"
            hitSlop={theme.a11y.hitSlop}
          >
            <Text style={styles.secondaryButtonText}>Remover foto</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && styles.confirmButtonPressed,
            ]}
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel="Confirmar receita anexada"
            hitSlop={theme.a11y.hitSlop}
          >
            <Text style={styles.confirmButtonText}>Confirmar receita</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={handleConfirm}
          accessibilityRole="button"
          accessibilityLabel="Continuar sem receita"
          hitSlop={theme.a11y.hitSlop}
        >
          <Text style={styles.secondaryButtonText}>Continuar sem receita</Text>
        </Pressable>
      )}
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
  },
  infoBox: {
    backgroundColor: theme.colors.infoBg,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoTitle: {
    ...theme.typography.h3,
    color: theme.colors.info,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.small,
    color: theme.colors.text,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },
  preview: {
    width: "100%",
    height: 360,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },
  statusRow: {
    marginTop: theme.spacing.sm,
    flexDirection: "row",
  },
  statusBadge: {
    backgroundColor: theme.colors.successBg,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusBadgeText: {
    ...theme.typography.small,
    color: theme.colors.success,
  },
  placeholder: {
    minHeight: 260,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  placeholderTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.muted,
    textAlign: "center",
  },
  primaryButton: {
    minHeight: theme.a11y.minTouch,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  primaryButtonPressed: {
    backgroundColor: theme.colors.primaryPressed,
  },
  primaryButtonText: {
    ...theme.typography.body,
    color: theme.colors.onPrimary,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: theme.a11y.minTouch,
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  secondaryButtonPressed: {
    opacity: 0.8,
  },
  secondaryButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "700",
  },
  confirmButton: {
    minHeight: theme.a11y.minTouch,
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
  },
  confirmButtonPressed: {
    opacity: 0.9,
  },
  confirmButtonText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: "800",
  },
});
