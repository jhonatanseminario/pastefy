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


export const isDesktop = (breakpoint = 768) => 
    window.matchMedia(`(min-width: ${breakpoint}px)`).matches;


export const generateSlug = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let slug = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        slug += chars.charAt(randomIndex);
    }
    
    return slug;
}
