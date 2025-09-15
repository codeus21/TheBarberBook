// Theme configuration for different tenants
export const themeConfigs = {
    default: {
        name: "Clean Cuts",
        colors: {
            primary: "#D4AF37",
            primaryLight: "#FFED4E",
            secondary: "#000000",
            background: "#1A1A1A",
            backgroundLight: "#2D2D2D",
            text: "#FFFFFF",
            textSecondary: "#CCCCCC",
            containerBg: "rgba(255, 255, 255, 0.05)",
            cardBg: "rgba(255, 255, 255, 0.05)",
            accentBg: "rgba(255, 215, 0, 0.1)",
            accentBorder: "rgba(255, 215, 0, 0.3)",
            shadowColor: "#D4AF37"
        },
        fonts: {
            primary: "Georgia, serif",
            heading: "Georgia, serif",
            logo: "Dancing Script, Brush Script MT, Lucida Handwriting, cursive"
        },
        effects: {
            borderRadius: "15px",
            backdropFilter: "blur(10px)"
        },
        styles: {
            buttonClass: "book-service-btn",
            cardClass: "service-card",
            headerClass: "services-header",
            titleClass: "services-title"
        },
        content: {
            servicesTitle: "Our Services",
            servicesSubtitle: "Professional Grooming Services for the Modern Gentleman",
            buttonText: "Book Now",
            badgeText: null
        },
        layout: "clean"
    },
    
    elite: {
        name: "Elite Cuts",
        colors: {
            primary: "#8B5CF6",
            primaryLight: "#A855F7",
            secondary: "#F8FAFC",
            background: "#F8FAFC",
            backgroundLight: "#E2E8F0",
            text: "#1E293B",
            textSecondary: "#64748B",
            containerBg: "rgba(255, 255, 255, 0.9)",
            cardBg: "rgba(255, 255, 255, 0.95)",
            accentBg: "rgba(139, 92, 246, 0.1)",
            accentBorder: "rgba(139, 92, 246, 0.2)",
            shadowColor: "#8B5CF6"
        },
        fonts: {
            primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            heading: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            logo: "Dancing Script, Brush Script MT, Lucida Handwriting, cursive"
        },
        effects: {
            borderRadius: "16px",
            backdropFilter: "blur(10px)"
        },
        styles: {
            buttonClass: "book-service-btn",
            cardClass: "service-card",
            headerClass: "elite-hero-section",
            titleClass: "elite-title"
        },
        content: {
            servicesTitle: "Elite Services",
            servicesSubtitle: "Premium Grooming Services for the Discerning Gentleman",
            buttonText: "Reserve Now",
            badgeText: "Exclusive Elite Experience"
        },
        layout: "elite"
    },
    
    // Easy to add new tenants!
    vintage: {
        name: "Vintage Barbers",
        colors: {
            primary: "#8B4513",
            primaryLight: "#A0522D",
            secondary: "#F5F5DC",
            background: "#FAF0E6",
            backgroundLight: "#FDF5E6",
            text: "#2F1B14",
            textSecondary: "#5C3D2E",
            containerBg: "#F5F5DC",
            cardBg: "#F5F5DC",
            accentBg: "rgba(139, 69, 19, 0.1)",
            accentBorder: "rgba(139, 69, 19, 0.3)",
            shadowColor: "#8B4513"
        },
        fonts: {
            primary: "Georgia, serif",
            heading: "Georgia, serif",
            logo: "Dancing Script, Brush Script MT, Lucida Handwriting, cursive"
        },
        effects: {
            borderRadius: "8px",
            backdropFilter: "none"
        },
        styles: {
            buttonClass: "book-service-btn",
            cardClass: "service-card",
            headerClass: "services-header",
            titleClass: "services-title"
        },
        content: {
            servicesTitle: "Classic Services",
            servicesSubtitle: "Traditional Barbering with Modern Excellence",
            buttonText: "Schedule",
            badgeText: "Est. 1920"
        },
        layout: "vintage"
    }
};

// Get theme config for current tenant
export const getCurrentTheme = (tenant) => {
    return themeConfigs[tenant] || themeConfigs.default;
};

// Apply theme to CSS variables
export const applyTheme = (theme) => {
    const root = document.documentElement;
    
    // Colors
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--background-color', theme.colors.background);
    root.style.setProperty('--text-color', theme.colors.text);
    
    // Additional color variations
    root.style.setProperty('--primary-light', theme.colors.primaryLight || theme.colors.primary);
    root.style.setProperty('--background-light', theme.colors.backgroundLight || theme.colors.background);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary || theme.colors.text);
    root.style.setProperty('--container-bg', theme.colors.containerBg || 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--card-bg', theme.colors.cardBg || 'rgba(255, 255, 255, 0.95)');
    root.style.setProperty('--accent-bg', theme.colors.accentBg || `rgba(${hexToRgb(theme.colors.primary)}, 0.1)`);
    root.style.setProperty('--accent-border', theme.colors.accentBorder || `rgba(${hexToRgb(theme.colors.primary)}, 0.2)`);
    
    // Fonts
    root.style.setProperty('--font-family', theme.fonts.primary);
    root.style.setProperty('--heading-font', theme.fonts.heading);
    root.style.setProperty('--logo-font', theme.fonts.logo || theme.fonts.heading);
    
    // Effects
    root.style.setProperty('--border-radius', theme.effects?.borderRadius || '12px');
    root.style.setProperty('--shadow-color', theme.colors.shadowColor || theme.colors.primary);
    root.style.setProperty('--backdrop-filter', theme.effects?.backdropFilter || 'blur(10px)');
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '139, 92, 246'; // Default purple
};
