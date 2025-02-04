import { Roboto } from "next/font/google"
import { createTheme } from "@mui/material/styles"

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
})

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#D2B48C", // Cor areia base
            light: "#E6D5B8",
            dark: "#A89076",
            contrastText: "#2C1810",
        },
        secondary: {
            main: "#8B4513", // Cor marrom complementar
            light: "#A0522D",
            dark: "#6B3410",
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#FAF9F6", // Cor de fundo off-white
            paper: "#FFFFFF",
        },
        text: {
            primary: "#2C1810", // Cor do texto marrom escuro
            secondary: "#5C534E", // Cor do texto marrom desbotado
        },
        error: {
            main: "#D32F2F",
        },
        warning: {
            main: "#ED6C02",
        },
        info: {
            main: "#0288D1",
        },
        success: {
            main: "#2E7D32",
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
            fontWeight: 500,
            color: "#2C1810",
        },
        h2: {
            fontWeight: 500,
            color: "#2C1810",
        },
        h3: {
            fontWeight: 500,
            color: "#2C1810",
        },
        body1: {
            color: "#2C1810",
        },
        body2: {
            color: "#5C534E",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                },
                contained: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
})
