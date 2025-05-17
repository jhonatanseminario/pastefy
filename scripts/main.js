import { sendPaste, fetchPaste } from './api.js';
import { $, $$ } from './utils.js';

const slug = window.location.pathname.slice(1);

window.addEventListener('DOMContentLoaded', () => {    
    const $heroSection = $("#hero");
    const $heroTitle = $(".title");
    const $heroSubtitle = $(".subtitle");
    const $pageBackground = $(".background");
    const $mainForm = $(".form");
    const $$formLabels = $$(".label");
    const $titleInput = $(".title-input");
    const $pasteInput = $(".paste-input");
    const $sendButton = $(".send-button");
    const $notification = $(".notification");

    const domRefs = {
        $heroSection,
        $heroTitle,
        $heroSubtitle,
        $pageBackground,
        $mainForm,
        $$formLabels,
        $titleInput,
        $pasteInput,
        $sendButton,
        $notification
    };

    if (slug) {
        fetchPaste(slug, domRefs);
    } else {
        document.body.classList.remove("hidden");
        $sendButton.disabled = true;

        $pasteInput.addEventListener("input", () => {
            $pasteInput.value.trim() === ""
                ? $sendButton.disabled = true
                : $sendButton.disabled = false;
        });


        $sendButton.addEventListener("click", async () => {
            const pasteTitle = $titleInput.value;
            const pasteText = $pasteInput.value;

            $sendButton.disabled = true;

            try {

                let info = await sendPaste(pasteTitle, pasteText);
                if (info.error) {
                    console.error("Error reportado por sendPaste:", info.error);
                    alert("Error: " + (info.error.message || "No se pudo guardar el paste."));
                    $sendButton.disabled = false;
                    return;
                }

                if (info.slug) {
                    sessionStorage.setItem("copiedToClipboard", "true");
                    await navigator.clipboard.writeText(`${window.location.origin}/${info.slug}`);
                    window.location.href = `/${info.slug}`;
                } else {
                    console.error("Error inesperado: sendPaste retornó sin error pero sin slug.", info);
                    alert("Error inesperado al obtener la dirección del paste.");
                    $sendButton.disabled = false;
                }


            } catch (error) {
                console.error("Error inesperado al procesar el paste:", error);
                alert("Ocurrió un error inesperado.");
                $sendButton.disabled = false;
            }
        });
    }
});
