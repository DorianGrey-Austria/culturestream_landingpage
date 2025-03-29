import { createClient } from '@supabase/supabase-js';

/**
 * Konfiguration für die Supabase-Client Verbindung
 * Die Werte werden aus den Umgebungsvariablen geladen
 * 
 * @environment
 * NEXT_PUBLIC_SUPABASE_URL - Die URL der Supabase-Instanz
 * NEXT_PUBLIC_SUPABASE_ANON_KEY - Der öffentliche anonyme API-Schlüssel
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase Umgebungsvariablen sind nicht konfiguriert');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);