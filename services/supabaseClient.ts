
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tejibsqmdxuehluneayl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlamlic3FtZHh1ZWhsdW5lYXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODg2NjMsImV4cCI6MjA4MDI2NDY2M30.iZCVGkGeLWY1Nv6dVOe9WfypCaR3hX0_g0wdAVvCOMo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
