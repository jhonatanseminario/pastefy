export const $ = selector => {
    if (typeof selector !== 'string' || selector.trim() === '') {
        return null;
    }

    try {
        return document.querySelector(selector);
    }
    catch (error) {
        return null;
    }
}


export const $$ = selector => {
    if (typeof selector !== 'string' || selector.trim() === '') {
        return [];
    }

    try {
        return Array.from(document.querySelectorAll(selector));
    }
    catch (error) {
        return [];
    }
}

export const isSmallScreen = () => {
    const breakpoint = 768;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
}


export const generateSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let slug = '';
    
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        slug += chars.charAt(randomIndex);
    }
    
    return slug;
}
