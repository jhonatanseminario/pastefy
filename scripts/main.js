import { $, $$, isSmallScreen } from './utils.js';
import { getClient, sendPaste } from './api.js';
import { renderPasteView } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {    
    const $heroSection = $("#hero");
    const $heroTitle = $(".title");
    const $heroSubtitle = $(".subtitle");
    const $pageBackground = $(".background");
    const $mainForm = $(".form");
    const $formLabels = $$(".label");
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
        $formLabels,
        $titleInput,
        $pasteInput,
        $sendButton,
        $notification
    };

    sendPaste();

    const slug = window.location.pathname.slice(1);

    async function fetchPaste(slug) {
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
                renderPasteView(data, domRefs);
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

    if (slug) {
        fetchPaste(slug);
    } else {
        document.body.classList.remove("hidden");
    }


    $sendButton.disabled = true;

    $pasteInput.addEventListener("input", () => {
        $pasteInput.value.trim() === ""
            ? $sendButton.disabled = true
            : $sendButton.disabled = false;
    });

    $sendButton.addEventListener("click", () => {
        const pasteTitle = $titleInput.value;
        const pasteText = $pasteInput.value;
        sendPaste(pasteTitle, pasteText);
        $sendButton.disabled = true;
    });
});
