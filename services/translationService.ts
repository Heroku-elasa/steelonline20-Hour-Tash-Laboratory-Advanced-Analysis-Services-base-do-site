
import { supabase } from './supabaseClient';

export const fetchSiteTranslations = async () => {
    try {
        const { data, error } = await supabase.from('site_content').select('*');
        if (error) throw error;
        return data;
    } catch (error) {
        // Table might not exist yet, return empty to allow fallback to static JSON
        return [];
    }
};
