import { sendPaste, fetchPaste } from './api.js';
import { $, $$ } from './utils.js';

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

    sendPaste();

    const slug = window.location.pathname.slice(1);

    if (slug) {
        fetchPaste(slug, domRefs);
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
