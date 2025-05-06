import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm";
import { isSmallScreen, generateSlug } from "./utils.js";
import { renderPasteView } from './ui.js';

export function getClient() {
    const supabaseUrl = "https://fbogwkdfwzdxdriwecbi.supabase.co";
    const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZib2d3a2Rmd3pkeGRyaXdlY2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjkzNTQsImV4cCI6MjA1MjAwNTM1NH0.XTfmP4M5eoVkWqhGgwlU7g_9kmlzj7WgrULLgkqkCEA";
    const client = createClient(supabaseUrl, supabaseKey);

    return client;
}

export async function sendPaste(pasteTitle, pasteText) {
    if (!pasteText) {
        return;
    }

    const pasteId = generateSlug();

    try {
        const { error } = await getClient()
            .from("pastes")
            .insert([{
                content: pasteText,
                title: pasteTitle,
                slug: pasteId
            }]);

        if (error) {
            console.error("Error al enviar el texto:", error);
            return;
        }

        sessionStorage.setItem("copiedToClipboard", "true");
        await navigator.clipboard.writeText(`${window.location.origin}/${pasteId}`);
        window.location.href = `/${pasteId}`;

    } catch (error) {
        console.error("Error inesperado:", error);
    }
}

export async function fetchPaste(slug, domRefs) {
    try {
        const { data, error } = await getClient()
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
