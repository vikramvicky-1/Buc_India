import { createTheme } from "@mui/material/styles";

// M3 Expressive Theme for Buc_India
// Orange-based primary with dark mode surfaces
const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#3B82F6",      // Blue 500 – brand color
            light: "#60A5FA",     // Blue 400
            dark: "#2563EB",      // Blue 600
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#8B5CF6",      // Violet 500 - new accent
            light: "#A78BFA",     // Violet 400
            dark: "#7C3AED",      // Violet 600
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#0F1214",   // M3 dark surface
            paper: "#1A1D21",     // M3 surface container
        },
        surface: {
            main: "#1A1D21",
            container: "#1E2227",
            containerLow: "#161A1D",
            containerHigh: "#252A2E",
            containerHighest: "#2E3338",
        },
        text: {
            primary: "#E8EAED",
            secondary: "#9AA0A6",
            disabled: "#5F6368",
        },
        error: {
            main: "#F44336",
            light: "#E57373",
            dark: "#D32F2F",
        },
        success: {
            main: "#4CAF50",
            light: "#81C784",
            dark: "#388E3C",
        },
        warning: {
            main: "#FF9800",
            light: "#FFB74D",
            dark: "#F57C00",
        },
        divider: "rgba(255, 255, 255, 0.08)",
    },

    typography: {
        fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700, fontSize: "2.5rem", letterSpacing: "-0.02em" },
        h2: { fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.01em" },
        h3: { fontWeight: 600, fontSize: "1.75rem" },
        h4: { fontWeight: 600, fontSize: "1.5rem" },
        h5: { fontWeight: 600, fontSize: "1.25rem" },
        h6: { fontWeight: 600, fontSize: "1rem" },
        subtitle1: { fontWeight: 500, fontSize: "1rem", color: "#9AA0A6" },
        subtitle2: { fontWeight: 500, fontSize: "0.875rem", color: "#9AA0A6" },
        body1: { fontSize: "1rem", lineHeight: 1.6 },
        body2: { fontSize: "0.875rem", lineHeight: 1.5 },
        button: { fontWeight: 600, textTransform: "none" },
        caption: { fontSize: "0.75rem", color: "#9AA0A6" },
        overline: { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em" },
    },

    shape: {
        borderRadius: 16, // M3 Expressive rounded corners
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: "thin",
                    scrollbarColor: "#3B82F6 #0F1214",
                    "&::-webkit-scrollbar": { width: 10 },
                    "&::-webkit-scrollbar-track": { background: "#0F1214" },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#3B82F6",
                        borderRadius: 5,
                        border: "2px solid #0F1214",
                    },
                    "&::-webkit-scrollbar-thumb:hover": { background: "#FB923C" },
                },
            },
        },

        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 100, // M3 full-rounded buttons
                    padding: "10px 24px",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    transition: "all 0.2s ease-in-out",
                },
                contained: {
                    "&:hover": { transform: "translateY(-1px)" },
                },
                outlined: {
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 },
                },
            },
        },

        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: "#1A1D21",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        borderColor: "rgba(59, 130, 246, 0.3)",
                        transform: "translateY(-2px)",
                    },
                },
            },
        },

        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    borderRadius: 20,
                },
            },
        },

        MuiAppBar: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundColor: "#1A1D21",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#1A1D21",
                    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                },
            },
        },

        MuiTextField: {
            defaultProps: { variant: "outlined", fullWidth: true },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 12,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3B82F6",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3B82F6",
                            borderWidth: 2,
                        },
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 8, fontWeight: 500 },
                filled: { backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60A5FA" },
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 24,
                    backgroundColor: "#1A1D21",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    minWidth: "auto",
                    padding: "10px 20px",
                },
            },
        },

        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#3B82F6",
                    fontWeight: 700,
                },
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    margin: "2px 8px",
                    "&.Mui-selected": {
                        backgroundColor: "rgba(59, 130, 246, 0.12)",
                        color: "#3B82F6",
                        "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.18)" },
                    },
                },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.08)" },
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                },
                head: {
                    fontWeight: 700,
                    color: "#E8EAED",
                    backgroundColor: "#1E2227",
                },
            },
        },

        MuiFab: {
            styleOverrides: {
                root: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
            },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: "#252A2E",
                    borderRadius: 8,
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;
