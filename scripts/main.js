import { getPaste, sendPaste } from './api.js';
import { renderPasteView, showNotification } from './ui.js';
import { $, $$, isDesktop } from './utils.js';

const slug = window.location.pathname.slice(1);

window.addEventListener('DOMContentLoaded', async () => {    
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
    }

    if (slug) {
        const response = await getPaste(slug);
        const data = await response.data;

        if (!data) {
            window.location.href = '/';
            return;
        }
        
        const newDomRefs = renderPasteView(data, domRefs);
        const { $copyButton } = newDomRefs;

        $copyButton.addEventListener('click', (event) => {
            event.preventDefault();
            navigator.clipboard.writeText(data.content);
        });
        
        if (sessionStorage.getItem('firstPasteView') && isDesktop()) {
            showNotification(domRefs);
        }

        document.body.classList.remove('hidden');
    }
    else {
        $pasteInput.addEventListener('input', () => {
            const hasContent = $pasteInput.value.trim() !== '';
            $sendButton.disabled = !hasContent;
        });

        $sendButton.addEventListener('click', async () => {
            $sendButton.disabled = true;

            const pasteTitle = $titleInput.value;
            const pasteText = $pasteInput.value;

            const data = await sendPaste(pasteTitle, pasteText);

            if (data.error) {
                $sendButton.disabled = false;
                return;
            }

            if (data.slug) {
                sessionStorage.setItem('firstPasteView', 'true');
                navigator.clipboard.writeText(`${window.location.origin}/${data.slug}`);
                window.location.href = `/${data.slug}`;
            }
        });

        document.body.classList.remove('hidden');
    }
});
