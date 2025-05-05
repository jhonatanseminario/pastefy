export const renderPasteView = (data, domRefs) => {
    const {
        $heroSection,
        $heroTitle,
        $heroSubtitle,
        $mainForm,
        $$formLabels,
        $titleInput,
        $pasteInput,
        $sendButton,
    } = domRefs;


    if ($heroTitle?.remove) $heroTitle.remove();
    if ($heroSubtitle?.remove) $heroSubtitle.remove();
    if ($titleInput?.remove) $titleInput.remove();
    if ($pasteInput?.remove) $pasteInput.remove();

    if ($$formLabels) $$formLabels.forEach( $formLabel => {
        if ($formLabel?.remove) $formLabel.remove();
    });


    const $newBackground = document.createElement('div');
    const $pasteTitle = document.createElement('h1');
    const $newTextarea = document.createElement('div');
    const $copyButton = document.createElement('button');


    if ($newBackground) $newBackground.className = 'new-background';
    if ($mainForm) $mainForm.classList.add('rendered-form');
    $newTextarea.className = 'paste-content';
    $newTextarea.textContent = data.content;
    $copyButton.classList.add('button', 'render-button');
    $copyButton.textContent = 'Copiar texto';

    $copyButton.addEventListener("click", (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(data.content);
    });
    
    if (data.title && data.title.trim() !== "") {
        $pasteTitle.className = "render-title";
        $pasteTitle.textContent = data.title;
    } else {
        $pasteTitle.className = "render-title";
        $pasteTitle.textContent = "Sin título";
        $pasteTitle.style.fontStyle = "italic";
    }


    $heroSection.parentNode.insertBefore($newBackground, $heroSection);
    $mainForm.appendChild($newTextarea);
    $sendButton.parentNode.replaceChild($copyButton, $sendButton);
    $mainForm.insertBefore($pasteTitle, $copyButton);
}
