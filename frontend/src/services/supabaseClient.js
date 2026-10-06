import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvewrlzhaadojtyoiwii.supabase.co';
const supabaseKey = 'sb_publishable_aRKLBe32e69toiY92g1V9g_6cp-JbTj';

export const supabase = createClient(supabaseUrl, supabaseKey);
