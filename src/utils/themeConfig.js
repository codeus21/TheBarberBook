// Theme configuration for different tenants
export const themeConfigs = {
    default: {
        name: "Clean Cuts",
        colors: {
            primary: "#D4AF37",
            secondary: "#000000",
            background: "#FFFFFF",
            text: "#333333"
        },
        fonts: {
            primary: "Arial, sans-serif",
            heading: "Arial, sans-serif"
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
            secondary: "#F8FAFC",
            background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
            text: "#1E293B"
        },
        fonts: {
            primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            heading: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        },
        styles: {
            buttonClass: "elite-button",
            cardClass: "elite-service-card",
            headerClass: "elite-hero-section",
            titleClass: "elite-gold"
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
            secondary: "#F5F5DC",
            background: "#FAF0E6",
            text: "#2F1B14"
        },
        fonts: {
            primary: "Georgia, serif",
            heading: "Georgia, serif"
        },
        styles: {
            buttonClass: "vintage-button",
            cardClass: "vintage-service-card",
            headerClass: "vintage-hero-section",
            titleClass: "vintage-title"
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
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--background-color', theme.colors.background);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--font-family', theme.fonts.primary);
    root.style.setProperty('--heading-font', theme.fonts.heading);
};
