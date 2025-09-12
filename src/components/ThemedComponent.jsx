import React from 'react';
import { getTenantFromUrl } from '../utils/apiHelper.js';
import { getCurrentTheme, applyTheme } from '../utils/themeConfig.js';

const ThemedComponent = ({ children, className = "", ...props }) => {
    const tenant = getTenantFromUrl();
    const theme = getCurrentTheme(tenant);
    
    // Apply theme CSS variables
    React.useEffect(() => {
        applyTheme(theme);
    }, [theme]);
    
    // Build dynamic className
    const getClassName = (baseClass, themeClass) => {
        return `${baseClass} ${themeClass || ''}`.trim();
    };
    
    // Theme-aware content
    const getContent = (key) => {
        return theme.content[key] || '';
    };
    
    // Theme-aware styling
    const getStyle = (key) => {
        return theme.styles[key] || '';
    };
    
    return (
        <div 
            className={`${className} ${theme.layout}-layout`}
            data-theme={tenant}
            {...props}
        >
            {React.cloneElement(children, {
                theme,
                getClassName,
                getContent,
                getStyle
            })}
        </div>
    );
};

export default ThemedComponent;
