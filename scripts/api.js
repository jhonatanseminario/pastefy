import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm";
import { generateSlug } from "./utils.js";

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
