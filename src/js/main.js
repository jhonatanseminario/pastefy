import { insertPaste, selectPasteBySlug } from './api.js';
import { DOM } from './dom.js';
import { renderData, showNotification } from './ui.js';
import { isDesktop } from './utils.js';


const { $main, $heroSection, $heroTitle, $heroSubtitle, $pasteForm, $formLabels, $titleInput, $pasteInput, $sendButton, $notification } = DOM;
const domElements = { $main, $heroSection, $heroTitle, $heroSubtitle, $pasteForm, $formLabels, $titleInput, $pasteInput, $sendButton, $notification }


const slug = window.location.pathname.slice(1);

if (slug) {
    const { data, error } = await selectPasteBySlug(slug);

    if (error || !data) {
        window.location.replace('/');
    }

    const newDomElements = renderData(data, domElements);
    const { $copyButton } = newDomElements;

    $copyButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await navigator.clipboard.writeText(data.content);
    });

    if (sessionStorage.getItem('firstPasteView') && isDesktop()) {
        showNotification(domElements, 'El enlace ha sido copiado al portapapeles');
        sessionStorage.removeItem('firstPasteView');
    }
}
else {
    $pasteInput.addEventListener('input', () => {
        const hasContent = $pasteInput.value.trim() !== '';
        $sendButton.disabled = !hasContent;
    });

    $sendButton.addEventListener('click', async () => {
        $sendButton.disabled = true;

        const pasteTitle = $titleInput.value;
        const pasteContent = $pasteInput.value;
        
        const { data, error, slug } = await insertPaste(pasteTitle, pasteContent);

        if (error || !data) {
            $sendButton.disabled = false;
            return;
        }

        sessionStorage.setItem('firstPasteView', 'true');
        await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
        window.location.replace(`/${slug}`);
    });
}

$main.classList.remove('hidden');
