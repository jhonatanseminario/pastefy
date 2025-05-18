import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm";
import { isSmallScreen, generateSlug } from "./utils.js";
import { renderPasteView } from './ui.js';


const SUPABASE_URL = 'https://fbogwkdfwzdxdriwecbi.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZib2d3a2Rmd3pkeGRyaXdlY2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjkzNTQsImV4cCI6MjA1MjAwNTM1NH0.XTfmP4M5eoVkWqhGgwlU7g_9kmlzj7WgrULLgkqkCEA';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);


export const sendPaste = async (pasteTitle, pasteContent) => {
    if (!pasteContent || pasteContent.trim() === '') {
        console.warn('Función "sendPaste" llamada sin contenido de texto válido.');
        return {
            data: null,
            error: { message: 'El contenido del paste no puede estar vacío.' },
            slug: null
        }
    }

    const slug = generateSlug();

    try {
        const { data, error } = await supabaseClient
            .from('pastes')
            .insert([{
                title: pasteTitle,
                content: pasteContent,
                slug: slug
            }])
            .select();

        if (error) {
            console.error(`API Error al enviar el texto: ${error}`);
            return {
                data: null,
                error: error,
                slug: slug
            }
        }

        console.log(`API: Paste creado con slug: ${slug}`);
        return {
            data: data,
            error: null,
            slug: slug
        }
    }
    catch (error) {
        console.error(`API Error inesperado en función "sendPaste": ${error}`);
        return {
            data: null, 
            error: { message: 'Error inesperado al comunicarse con la API.' },
            slug: null
        }
    }
}


export const getPaste = async (slug) => {
    if (!slug || slug.trim() === '') {
        console.warn('Función "getPaste" llamada sin slug válido.');
        return {
            data: null,
            error: { message: 'Slug inválido o vacío.' },
            slug: null
        }
    }

    try {
        const { data, error } = await supabaseClient
            .from('pastes')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error(`Error al recuperar el texto: ${error}`);
            return {
                data: null,
                error: error,
                slug: null
            };
        }

        console.log(`API: Paste encontrado con slug: ${slug}`);
        return {
            data: data,
            error: null,
            slug: slug
        }
    }
    catch (error) {
        console.error(`API Error inesperado en función "getPaste": ${error}`);
        return {
            data: null,
            error: { message: "Error inesperado al comunicarse con la API." },
            slug: null
        };
    }
}

// const $notification = document.querySelector(".notification");
// if (data && Object.keys(data).length > 0) {
//     const newElements = renderPasteView(data, domRefs);

//     if (newElements && newElements.$copyButton) {
//         newElements.$copyButton.addEventListener("click", async (event) => {
//             event.preventDefault();
//             await navigator.clipboard.writeText(data.content);
//         });
//     }

//     document.body.classList.remove("hidden");

//     if (sessionStorage.getItem("copiedToClipboard") === "true" && !isSmallScreen()) {
//         setTimeout(() => {
//             $notification.classList.remove("hidden-notification");
//         }, 400);
    
//         setTimeout(() => {
//             $notification.classList.add("hidden-notification");
//         }, 4400);

//         sessionStorage.removeItem("copiedToClipboard");
//     }

// } else {
//     window.location.href = "/";
// }