import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.56.0/+esm';
import { generateSlug } from './utils.js';


const SUPABASE_URL = 'https://fbogwkdfwzdxdriwecbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZib2d3a2Rmd3pkeGRyaXdlY2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjkzNTQsImV4cCI6MjA1MjAwNTM1NH0.XTfmP4M5eoVkWqhGgwlU7g_9kmlzj7WgrULLgkqkCEA';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const executeQuery = async (query, { slug = null }) => {
    try {
        const { data, error } = await query();

        if (error) {
            return {
                data: null,
                error,
                slug
            }
        }

        return {
            data,
            error: null,
            slug
        }
    }
    catch (error) {
        return {
            data: null,
            error: {
                message: 'No se pudo completar la solicitud. Inténtalo de nuevo más tarde.',
                original: error
            },
            slug
        }
    }
}


export const insertPaste = async (title, content) => { 
    if (!content?.trim()) {
        return {
            data: null,
            error: { message: 'No se pudo crear el paste porque el contenido está vacío o es inválido.' },
            slug: null
        }
    }

    const slug = generateSlug();

    return executeQuery(
        () => supabase
            .from('pastefy')
            .insert({
                title,
                content,
                slug
            })
            .select('title, content, slug'),
        { slug }
    );
}


export const selectPasteBySlug = async (slug) => {
    if (!slug?.trim()) {
        return {
            data: null,
            error: { message: 'El slug es inválido o está vacío.' },
            slug
        }
    }

    return executeQuery(
        () => supabase
            .from('pastefy')
            .select('title, content, slug')
            .eq('slug', slug)
            .single(),
        { slug }
    );
}
