import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Anon Key dari dashboard Supabase Anda
const SUPABASE_URL = 'https://zmppewociajkyzvehxss.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcHBld29jaWFqa3l6dmVoeHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NjI1MTIsImV4cCI6MjEwNTUzODUxMn0.qMGnkCwbuPBd2JH35m06YVb7ln1VSFNuV7NM0mRqAvQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);