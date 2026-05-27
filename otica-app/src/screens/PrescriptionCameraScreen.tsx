import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { theme } from "@/utils/theme";

type Props = {
  navigation: any;
};

export default function PrescriptionCameraScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.centerText}>Carregando câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.permissionTitle}>Permissão necessária</Text>
        <Text style={styles.permissionText}>
          Precisamos acessar a câmera para fotografar sua receita.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.permissionButton,
            pressed && styles.permissionButtonPressed,
          ]}
          onPress={requestPermission}
          accessibilityRole="button"
          accessibilityLabel="Permitir uso da câmera"
        >
          <Text style={styles.permissionButtonText}>Permitir câmera</Text>
        </Pressable>
      </View>
    );
  }

  async function handleTakePhoto() {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePictureAsync({
      quality: 0.7,
      skipProcessing: true,
    });

    setPhotoUri(result.uri);
  }

  function handleRetake() {
    setPhotoUri(null);
  }

  function handleUsePhoto() {
    navigation.navigate("PrescriptionUpload", {
      photoUri: photoUri ?? undefined,
    });
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.preview} />

          <View style={styles.bottomPanel}>
            <Text style={styles.tip}>Confira se a receita está legível antes de continuar.</Text>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={handleRetake}
              accessibilityRole="button"
              accessibilityLabel="Tirar outra foto"
            >
              <Text style={styles.secondaryButtonText}>Tirar outra</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleUsePhoto}
              accessibilityRole="button"
              accessibilityLabel="Usar esta foto da receita"
            >
              <Text style={styles.primaryButtonText}>Usar esta foto</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />

          <View style={styles.overlay}>
            <View style={styles.guideBox} />
          </View>

          <View style={styles.bottomPanel}>
            <Text style={styles.tip}>
              Centralize a receita dentro da área destacada.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleTakePhoto}
              accessibilityRole="button"
              accessibilityLabel="Fotografar receita"
            >
              <Text style={styles.primaryButtonText}>Fotografar receita</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  centerScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  centerText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  permissionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  permissionText: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  permissionButton: {
    minHeight: theme.a11y.minTouch,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  permissionButtonPressed: {
    backgroundColor: theme.colors.primaryPressed,
  },
  permissionButtonText: {
    ...theme.typography.body,
    color: theme.colors.onPrimary,
    fontWeight: "800",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  guideBox: {
    width: "82%",
    height: "45%",
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.white,
    backgroundColor: "transparent",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
    backgroundColor: theme.colors.black,
  },
  bottomPanel: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.overlay,
    gap: theme.spacing.sm,
  },
  tip: {
    ...theme.typography.small,
    color: theme.colors.white,
    textAlign: "center",
  },
  primaryButton: {
    minHeight: theme.a11y.minTouch,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
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
  },
  secondaryButtonPressed: {
    opacity: 0.85,
  },
  secondaryButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "700",
  },
});
