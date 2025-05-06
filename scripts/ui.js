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
    const $pasteContent = document.createElement('div');
    const $copyButton = document.createElement('button');


    $newBackground.className = 'new-background';
    $mainForm.classList.add('rendered-form');
    $pasteTitle.className = 'render-title';
    
    if (data.title && data.title.trim() !== '') {
        $pasteTitle.textContent = data.title;
    } else {
        $pasteTitle.textContent = 'Sin título';
        $pasteTitle.classList.add('no-title');
    }
    
    $pasteContent.className = 'paste-content';
    $pasteContent.textContent = data.content;
    $copyButton.classList.add('button', 'render-button');
    $copyButton.textContent = 'Copiar texto';

    
    $heroSection.parentNode.insertBefore($newBackground, $heroSection);

    if ($mainForm) {
        $mainForm.appendChild($pasteContent);

        if ($sendButton && $sendButton.parentNode) {
            $sendButton.parentNode.replaceChild($copyButton, $sendButton);
        } else {
            $mainForm.appendChild($copyButton);
        }

        $mainForm.insertBefore($pasteTitle, $copyButton);
    }


    return {
        $newBackground,
        $pasteTitle,
        $pasteContent,
        $copyButton,
    }
}
