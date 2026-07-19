const SUPABASE_URL = "https://moflesipsnyqrmvsnjaw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6noZ6rOvlvdt9TntaVMGPw_pV1dDl11";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;

console.log(window.supabaseClient);
