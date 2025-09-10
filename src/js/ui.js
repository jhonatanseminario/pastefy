const NOTIFICATION_DELAY = 400;
const NOTIFICATION_DURATION = 4000;


const removeDomElements = (domElements = []) =>
    domElements.forEach(domElement => domElement?.remove?.())


const createDomElements = (data) => {
    const $pasteTitle = document.createElement('h1');
    const $pasteContent = document.createElement('div');
    const $copyButton = document.createElement('button');

    $pasteTitle.classList.add('render-title');
    if (!data.title?.trim()) $pasteTitle.classList.add('no-title');
    $pasteContent.classList.add('paste-content');
    $copyButton.classList.add('button', 'render-button');
    
    $pasteTitle.textContent = data.title?.trim() || 'Sin título';
    $pasteContent.textContent = data.content;
    $copyButton.textContent = 'Copiar texto';

    return { $pasteTitle, $pasteContent, $copyButton }
}


const insertDomElements = (domElements, newDomElements) => {
    const { $mainForm, $sendButton } = domElements;
    const { $pasteTitle, $pasteContent, $copyButton } = newDomElements;

    $mainForm.prepend($pasteTitle);
    $mainForm.append($pasteContent);
    $sendButton.replaceWith($copyButton);

    $mainForm.classList.add('rendered-form');
}


export const renderData = (data, domElements) => {
    const { $heroTitle, $heroSubtitle, $$formLabels, $titleInput, $pasteInput } = domElements;

    removeDomElements([$heroTitle, $heroSubtitle, ...($$formLabels || []), $titleInput, $pasteInput]);
    const newDomElements = createDomElements(data);
    insertDomElements(domElements, newDomElements);

    return newDomElements;
}


export const showNotification = (domElements, message) => {
    const { $notification } = domElements;
    $notification.textContent = message;

    setTimeout(() => {
        $notification.classList.remove('hidden-notification');
    }, NOTIFICATION_DELAY);

    setTimeout(() => {
        $notification.classList.add('hidden-notification');
    }, NOTIFICATION_DELAY + NOTIFICATION_DURATION);
}
