import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm";
import { isSmallScreen, generateSlug } from "./utils.js";
import { renderPasteView } from './ui.js';
const $notification = document.querySelector(".notification");


const SUPABASE_URL = 'https://fbogwkdfwzdxdriwecbi.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZib2d3a2Rmd3pkeGRyaXdlY2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjkzNTQsImV4cCI6MjA1MjAwNTM1NH0.XTfmP4M5eoVkWqhGgwlU7g_9kmlzj7WgrULLgkqkCEA';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);


export const sendPaste = async (pasteTitle, pasteText) => {
    if (!pasteText || pasteText.trim() === '') {
        return {
            data: null,
            error: { message: 'El contenido del paste no puede estar vacío.' },
            slug: null
        }
    }

    const slug = generateSlug();

    try {
        const { error } = await supabaseClient
            .from("pastes")
            .insert([{
                content: pasteText,
                title: pasteTitle,
                slug: slug
            }]);

        if (error) {
            return {
                data: null,
                error: error,
                slug: slug
            };
        }

        sessionStorage.setItem("copiedToClipboard", "true");
        await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
        window.location.href = `/${slug}`;

    } catch (error) {
        return {
            data: null, 
            error: { message: "Error inesperado al comunicarse con la API." },
            slug: null
        };
    }
}

export async function fetchPaste(slug, domRefs) {
    try {
        const { data, error } = await supabaseClient
            .from("pastes")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) {
            console.error("Error al recuperar el texto:", error);

            if (error.code === 'PGRST116') {
                window.location.href = "/";
            }

            return;
        }

        if (data && Object.keys(data).length > 0) {
            const newElements = renderPasteView(data, domRefs);

            if (newElements && newElements.$copyButton) {
                newElements.$copyButton.addEventListener("click", async (event) => {
                    event.preventDefault();
                    await navigator.clipboard.writeText(data.content);
                });
            }

            document.body.classList.remove("hidden");

            if (sessionStorage.getItem("copiedToClipboard") === "true" && !isSmallScreen()) {
                setTimeout(() => {
                    $notification.classList.remove("hidden-notification");
                }, 400);
            
                setTimeout(() => {
                    $notification.classList.add("hidden-notification");
                }, 4400);

                sessionStorage.removeItem("copiedToClipboard");
            }

        } else {
            window.location.href = "/";
        }
    } catch (error) {
        console.error("Error inesperado:", error);
        window.location.href = "/";
    }
}
