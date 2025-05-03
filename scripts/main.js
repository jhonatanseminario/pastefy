import { $, $$, isMobile } from './utils.js';
import { getClient, sendPaste } from './api.js';

const heroSection = $("#hero");
const pageTitle = $(".title");
const pageDescription = $(".description");
const pageBackground = $(".background");
const mainForm = $(".form");
const formLabel = $$(".label");
const titleInput = $(".title-input");
const pasteInput = $(".paste-input");
const sendButton = $(".send-button");
const notification = $(".notification");

sendPaste();

function renderPage(data) {

    // REMOVER ELEMENTOS
    pageTitle.remove();
    pageDescription.remove();
    titleInput.remove();
    pasteInput.remove();

    formLabel.forEach(label => {
        label.remove();
    });
    
    // CREAR ELEMENTOS
    const newTitle = document.createElement("h2");
    const backgrounClone = pageBackground.cloneNode(true);
    const newButton = sendButton.cloneNode(true);
    const newDiv = document.createElement("div");

    // MODIFICAR ELEMENTOS
    pageBackground.className = "render-background";
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

    // AÑADIR AL DOM
    heroSection.appendChild(backgrounClone);
    mainForm.appendChild(newDiv);
    sendButton.parentNode.replaceChild(newButton, sendButton);
    mainForm.insertBefore(newTitle, newButton);

    // AÑADIR EVENTOS
    newButton.addEventListener("click", () => {
        navigator.clipboard.writeText(data.content);
    });
}

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
            renderPage(data);
            document.body.classList.remove("hidden");

            if (sessionStorage.getItem("copiedToClipboard") === "true" && !isMobile()) {
                setTimeout(() => {
                    notification.classList.remove("hidden-notification");
                }, 400);
            
                setTimeout(() => {
                    notification.classList.add("hidden-notification");
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

window.addEventListener('DOMContentLoaded', () => {
    sendButton.disabled = true;

    pasteInput.addEventListener("input", () => {
        pasteInput.value.trim() === ""
            ? sendButton.disabled = true
            : sendButton.disabled = false;
    });

    sendButton.addEventListener("click", () => {
        const pasteTitle = titleInput.value;
        const pasteText = pasteInput.value;
        sendPaste(pasteTitle, pasteText);
        sendButton.disabled = true;
    });
});
