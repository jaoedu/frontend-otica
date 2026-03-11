export const theme = {
  colors: {
    // Base (mantém compatibilidade)
    bg: "#FFFFFF",
    background: "#FFFFFF", // alias (evita erro theme.colors.background)
    surface: "#F7F7F8",
    surface2: "#FFFFFF",
    text: "#0B0F19",
    muted: "#6B7280",
    border: "#E5E7EB",

    // Brand
    primary: "#F4B400",
    primaryPressed: "#E0A800",
    onPrimary: "#111827",

    // Status
    danger: "#D32F2F",
    dangerBg: "#FEE2E2",
    success: "#16A34A",
    successBg: "#DCFCE7",
    warning: "#F59E0B",
    warningBg: "#FEF3C7",
    info: "#2563EB",
    infoBg: "#DBEAFE",

    // Extras úteis
    overlay: "rgba(0,0,0,0.35)",
    white: "#FFFFFF",
    black: "#000000",
  },

  // Tipografia (pra padronizar títulos e textos)
  typography: {
    h1: { fontSize: 28, fontWeight: "900" as const, lineHeight: 34 },
    h2: { fontSize: 22, fontWeight: "900" as const, lineHeight: 28 },
    h3: { fontSize: 18, fontWeight: "800" as const, lineHeight: 24 },
    body: { fontSize: 16, fontWeight: "500" as const, lineHeight: 22 },
    small: { fontSize: 13, fontWeight: "600" as const, lineHeight: 18 },
  },

  // Bordas arredondadas (mantém md/lg e adiciona mais)
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
  },

  // Espaçamento (mantém xs/sm/md/lg e adiciona mais)
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Sombra padrão de card (iOS/Android)
  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    floating: {
      shadowColor: "#000",
      shadowOpacity: 0.14,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
  },

  // Acessibilidade / toque confortável
  a11y: {
    minTouch: 44, // recomendado (Apple/Google)
    hitSlop: 10,
  },
};