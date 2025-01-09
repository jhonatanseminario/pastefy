//!==========================================================================!//
//!                             IMPORTAR MÓDULOS                             !//
//!==========================================================================!//

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm";


//*==========================================================================*//
//*                     INICIALIZAR CONSTANTES GLOBALES                      *//
//*==========================================================================*//

const pasteInput = document.querySelector("#pasteInput");
const sendButton = document.querySelector("#sendButton");


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

async function sendPaste(pasteText) {
    if (!pasteText) {
        alert("¡El campo de texto está vacío!");
        return;
    }

    try {
        const { error } = await getClient()
            .from("pastes")
            .insert([{ paste: pasteText }]);

        if (error) {
            console.error("Error al enviar el texto:", error);
        }

    } catch (error) {
        console.error("Error inesperado:", error);
    }
}


//*==========================================================================*//
//*                  AGREGAR ESCUCHADORES AL CARGAR EL DOM                   *//
//*==========================================================================*//

window.addEventListener('DOMContentLoaded', () => {
    sendButton.addEventListener("click", () => {
        const pasteText = pasteInput.value;
        sendPaste(pasteText);
    });
});
