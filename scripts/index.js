//!==========================================================================!//
//!                             IMPORTAR MÓDULOS                             !//
//!==========================================================================!//

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm";


//*==========================================================================*//
//*                     INICIALIZAR CONSTANTES GLOBALES                      *//
//*==========================================================================*//

const heroSection = document.querySelector("#hero");
const pageTitle = document.querySelector(".title");
const pageDescription = document.querySelector(".description");
const pageBackground = document.querySelector(".background");
const mainForm = document.querySelector(".form");
const formLabel = document.querySelectorAll(".label");
const titleInput = document.querySelector(".title-input");
const pasteInput = document.querySelector(".paste-input");
const sendButton = document.querySelector(".send-button");


//*==========================================================================*//
//*                CREAR Y DEVOLVER UNA INSTANCIA DE SUPABASE                *//
//*==========================================================================*//

function getClient() {
    const supabaseUrl = "https://fbogwkdfwzdxdriwecbi.supabase.co";
    const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZib2d3a2Rmd3pkeGRyaXdlY2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjkzNTQsImV4cCI6MjA1MjAwNTM1NH0.XTfmP4M5eoVkWqhGgwlU7g_9kmlzj7WgrULLgkqkCEA";
    const client = createClient(supabaseUrl, supabaseKey);

    return client;
}


//*==========================================================================*//
//*                             CREAR NUEVO PASTE                            *//
//*==========================================================================*//

function generateId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        id += chars.charAt(randomIndex);
    }
    
    return id;
}

async function sendPaste(pasteTitle, pasteText) {
    if (!pasteText) {
        return;
    }

    const pasteId = generateId();

    try {
        const { error } = await getClient()
            .from("pastes")
            .insert([{
                content: pasteText,
                title: pasteTitle,
                slug: pasteId
            }]);

        if (error) {
            console.error("Error al enviar el texto:", error);
            return;
        }

        window.location.href = `/${pasteId}`;

    } catch (error) {
        console.error("Error inesperado:", error);
    }
}


//*==========================================================================*//
//*                             RECUPERAR PASTES                             *//
//*==========================================================================*//

function renderPage(data) {
    pageTitle.className = "render-title";
    pageTitle.textContent = data.title;

    pageDescription.remove();

    pageBackground.className = "render-background";
    const backgrounClone = pageBackground.cloneNode(true);
    backgrounClone.className = "background-clone";
    heroSection.appendChild(backgrounClone);

    mainForm.classList.add("render-form");
    const newDiv = document.createElement("div");
    newDiv.className = "render-content";
    newDiv.textContent = data.content;
    mainForm.appendChild(newDiv);
    
    formLabel.forEach(label => {
        label.remove();
    });

    titleInput.remove();
    pasteInput.remove();

    const newButton = sendButton.cloneNode(true);
    sendButton.parentNode.replaceChild(newButton, sendButton);
    newButton.classList.add("render-button");
    newButton.textContent = "Copiar texto";
    newButton.disabled = false;
    
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
            return;
        }

        if (data) {
            renderPage(data);
            document.body.classList.remove("hidden");
        } else {
            document.body.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error inesperado:", error);
    }
}

if (slug) {
    fetchPaste(slug);
} else {
    document.body.classList.remove("hidden");
}


//*==========================================================================*//
//*                  AGREGAR ESCUCHADORES AL CARGAR EL DOM                   *//
//*==========================================================================*//

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
        navigator.clipboard.writeText(pasteInput.value);
        sendPaste(pasteTitle, pasteText);
    });
});
