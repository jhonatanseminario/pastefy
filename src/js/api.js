import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';
import { generateSlug } from './utils.js';


const SUPABASE_URL = 'https://fbogwkdfwzdxdriwecbi.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZib2d3a2Rmd3pkeGRyaXdlY2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjkzNTQsImV4cCI6MjA1MjAwNTM1NH0.XTfmP4M5eoVkWqhGgwlU7g_9kmlzj7WgrULLgkqkCEA';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);


export const sendPaste = async (title, content) => { 
    if (!content || content.trim() === '') {
        return {
            data: null,
            error: { message: 'El contenido del paste no puede estar vacío.' },
            slug: null
        }
    }

    const slug = generateSlug();

    try {
        const { data, error } = await supabaseClient
            .from('pastes')
            .insert([{
                title: title,
                content: content,
                slug: slug
            }])
            .select();

        if (error) {
            return {
                data: null,
                error: error,
                slug: slug
            }
        }

        return {
            data: data,
            error: null,
            slug: slug
        }
    }
    catch (error) {
        return {
            data: null,
            error: { message: 'Error inesperado al comunicarse con la API.' },
            slug: null
        }
    }
}


export const getPaste = async (slug) => {
    if (!slug || slug.trim() === '') {
        return {
            data: null,
            error: { message: 'Slug inválido o vacío.' }
        }
    }

    try {
        const { data, error } = await supabaseClient
            .from('pastes')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            return {
                data: null,
                error: error
            }
        }

        if (!data) {
            return {
                data: null,
                error: { message: 'Paste no encontrado.' }
            }
        }

        return {
            data: data,
            error: null
        }
    }
    catch (error) {
        return {
            data: null,
            error: { message: 'Error inesperado al comunicarse con la API.' }
        }
    }
}
