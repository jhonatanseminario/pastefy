import { fetchPasteBySlug, createPaste } from './api.js';
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
        const { data, error } = await fetchPasteBySlug(slug);

        if (error) {
            window.location.href = '/';
            return;
        }

        if (data) {
            const newDomRefs = renderPasteView(data, domRefs);
            const { $copyButton } = newDomRefs;

            $copyButton.addEventListener('click', async (event) => {
                event.preventDefault();
                await navigator.clipboard.writeText(data.content);
            });

            if (sessionStorage.getItem('firstPasteView') === 'true' && isDesktop()) {
                showNotification(domRefs, 'El enlace ha sido copiado al portapapeles');
                sessionStorage.removeItem('firstPasteView');
            }
        }
        else {
            window.location.href = '/';
        }

        $('main')?.classList.remove('hidden');
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

            if (!pasteText || pasteText.trim() === '') {
                $sendButton.disabled = false;
                return;
            }

            const { data, error, slug: newSlug } = await createPaste(pasteTitle, pasteText);

            if (error) {
                $sendButton.disabled = false;
                return;
            }

            if (data) {
                sessionStorage.setItem('firstPasteView', 'true');
                await navigator.clipboard.writeText(`${window.location.origin}/${newSlug}`);
                window.location.href = `/${newSlug}`;
            }
            else {
                 $sendButton.disabled = false;
            }
        });

        $('main')?.classList.remove('hidden');
    }
});
