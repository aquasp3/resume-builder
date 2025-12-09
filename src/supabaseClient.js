// mobile/src/supabaseClient.js

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qkzjozlswqlxdxlbrkgx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrempvemxzd3FseGR4bGJya2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzg2NDMsImV4cCI6MjA3ODM1NDY0M30.ew6q6-4mqdpGeg77Zol1iOFGk3XjAjJhuZn76Hz_gU0" // keep your key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
