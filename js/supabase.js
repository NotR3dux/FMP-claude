import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://uckinjcynpfklitbfenp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja2luamN5bnBma2xpdGJmZW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MzAxOTAsImV4cCI6MjA5NDMwNjE5MH0.UjW-bY4IjKBByf2jcTbRompRz7O3yrDQ1yswifvre80'
);
