import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0D1117', // Deep, dark navy/charcoal
        },
        secondary: {
            main: '#3B82F6', // Vibrant, glowing cyan/light blue (Accent & Brand)
        },
        background: {
            default: '#0D1117', // Base background color, will be behind the blurred image
            paper: '#FFFFFF', // Pure, solid white for content cards
        },
        text: {
            primary: '#FFFFFF', // Bright white for high-level headings and navigation (on dark backgrounds)
            secondary: '#333333', // Dark, readable gray/off-black for content within white cards
        },
        buttonBackground: {
            main: '#F3F4F6', // Very light, subtle gray for button background
        },
    },
    typography: {
        fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica Neue", Arial, sans-serif', // Modern sans-serif fonts
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
            textAlign: 'center',
            color: '#FFFFFF', // Primary text color
            '@media (min-width:600px)': {
                fontSize: '4rem',
            },
        },
        h2: {
            fontSize: '2.2rem',
            fontWeight: 700, // Card Headings: Medium size, bold
            color: '#333333', // Secondary text color for card headings
            '@media (min-width:600px)': {
                fontSize: '3.2rem',
            },
        },
        h3: {
            fontSize: '1.8rem',
            fontWeight: 700, // Card Headings: Medium size, bold
            color: '#333333', // Secondary text color for card headings
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.8, // Generous line spacing
            color: '#333333', // Secondary text color for body text
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6, // Generous line spacing
            color: '#333333', // Secondary text color for body text
        },
        button: {
            textTransform: 'none', // Keep button text as is, not all caps
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundColor: '#0D1117', // Blends with primary background
                    color: '#FFFFFF', // White text
                    boxShadow: 'none', // No shadow for a seamless blend
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999, // Pill-shaped
                    textTransform: 'none',
                    padding: '10px 20px',
                    border: '1px solid transparent', // Subtle border
                    '&:hover': {
                        borderColor: '#3B82F6', // Brighter border on hover
                    },
                    boxShadow: 'none', // Remove default glow
                },
                containedPrimary: {
                    backgroundColor: '#3B82F6', // Brand's light blue
                    color: '#FFFFFF', // White text
                    '&:hover': {
                        backgroundColor: '#2A65CC', // Slightly darker blue on hover
                        boxShadow: 'none',
                    },
                },
                containedSecondary: {
                    backgroundColor: '#F3F4F6', // Very light gray
                    color: '#333333', // Dark text
                    '&:hover': {
                        backgroundColor: '#E5E7EB', // Slightly darker gray on hover
                        boxShadow: 'none',
                    },
                },
                text: {
                    color: '#3B82F6', // Accent color for text buttons
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.08)', // Subtle hover background
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)', // Diffused drop shadow
                    backgroundColor: '#FFFFFF', // Solid white
                    color: '#333333', // Default text color
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
                    backgroundColor: '#FFFFFF',
                    color: '#333333',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    // Default typography color will be handled by context or specific component styles
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    color: '#333333',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F3F4F6', // Light gray background
                    borderRadius: 8, // Slightly rounded corners
                    '& fieldset': {
                        borderColor: '#E5E7EB', // Subtle border color
                    },
                    '&:hover fieldset': {
                        borderColor: '#3B82F6 !important', // Brighter border on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#3B82F6 !important', // Brighter border on focus
                    },
                },
                input: {
                    color: '#333333', // Dark text
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#333333', // Dark label
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: '#333333', // Dark icon
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: '#3B82F6', // Accent color
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#3B82F6', // Accent color
                },
            },
        },
    },
});

export default theme;