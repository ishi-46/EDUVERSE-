// Shared Supabase connection for EduVerse
// Safe to expose publicly — this is the publishable key, not the secret key.

const SUPABASE_URL = "https://awnwxkndxfyroumuspsl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_WNMlZxUEMDpk0ZBnvwNw0A_Qg3HWV37";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
