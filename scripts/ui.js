export const renderPasteView = (data, domRefs) => {
    const {
        $hero,
        $title,
        $subtitle,
        $background,
        titleInput,
        pasteInput,
        formLabels,
        mainForm,
        sendButton,
    } = domRefs;

    if ($title?.remove) $title.remove();
    if ($subtitle?.remove) $subtitle.remove();
    if (titleInput?.remove) titleInput.remove();
    if (pasteInput?.remove) pasteInput.remove();

    if (formLabels) formLabels.forEach(label => {
         if (label?.remove) label.remove();
    });
    
    const newTitle = document.createElement("h2");
    const backgrounClone = $background.cloneNode(true);
    const newButton = sendButton.cloneNode(true);
    const newDiv = document.createElement("div");

    $background.className = "render-background";
    backgrounClone.className = "background-clone";
    mainForm.classList.add("render-form");
    newDiv.className = "render-content";
    newDiv.textContent = data.content;
    newButton.classList.add("render-button");
    newButton.textContent = "Copiar texto";
    newButton.disabled = false;
    
    if (data.title) {
        newTitle.className = "render-title";
        newTitle.textContent = data.title;
    } else {
        newTitle.className = "render-title";
        newTitle.textContent = "Sin título";
        newTitle.style.fontStyle = "italic";
    }

    $hero.appendChild(backgrounClone);
    mainForm.appendChild(newDiv);
    sendButton.parentNode.replaceChild(newButton, sendButton);
    mainForm.insertBefore(newTitle, newButton);

    newButton.addEventListener("click", () => {
        navigator.clipboard.writeText(data.content);
    });
}
