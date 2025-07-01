import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://cclqlbmqevgjvyugfilz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbHFsYm1xZXZnanZ5dWdmaWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzA5NDEsImV4cCI6MjA2Njk0Njk0MX0.OvHfHU4Dh10x1xCgPowa6Eaq5PEleIr84UV7dS2Y8bA"
);