export const $ = selector => {
    if (typeof selector !== 'string' || selector.trim() === '') {
        console.error('$: Se requiere un selector de string no vacío.');
        return null;
    }

    try {
        return document.querySelector(selector);
    }
    catch (e) {
        console.error(`$: Selector inválido "${selector}".`, e);
        return null;
    }
};

export const $$ = selector => {
    if (typeof selector !== 'string' || selector.trim() === '') {
        console.error('$$: Se requiere un selector de string no vacío.');
        return [];
    }

    try {
        return Array.from(document.querySelectorAll(selector));
    }
    catch (e) {
        console.error(`$$: Selector inválido "${selector}".`, e);
        return [];
    }
};

export function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}

export function generateId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        id += chars.charAt(randomIndex);
    }
    
    return id;
}
