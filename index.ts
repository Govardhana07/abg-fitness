// Supabase Edge Function template for an optional AI coach.
// Set AI_API_KEY as an Edge Function secret; never expose it to the browser.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json' };
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST required' }), { status: 405, headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    const aiKey = Deno.env.get('AI_API_KEY');
    if (!url || !anon || !aiKey) return new Response(JSON.stringify({ error: 'Server secrets are not configured.' }), { status: 503, headers: cors });
    const auth = req.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Authentication required.' }), { status: 401, headers: cors });
    const supabase = createClient(url, anon, { global: { headers: { Authorization: auth } } });
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return new Response(JSON.stringify({ error: 'Invalid session.' }), { status: 401, headers: cors });
    const body = await req.json();
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    if (!question || question.length > 1200) return new Response(JSON.stringify({ error: 'Question must be 1–1200 characters.' }), { status: 400, headers: cors });
    const response = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${aiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: Deno.env.get('AI_MODEL') || 'gpt-4.1-mini', instructions: 'You are ABG Coach, a general fitness education assistant. Give practical, conservative advice. Do not diagnose, prescribe treatment, encourage extreme dieting, or claim exact nutrition facts without labels. For urgent symptoms, advise urgent medical care. Ask clarifying questions when needed.', input: question, max_output_tokens: 450 }) });
    if (!response.ok) return new Response(JSON.stringify({ error: 'AI provider request failed.' }), { status: 502, headers: cors });
    const result = await response.json();
    const answer = (result.output || []).flatMap((item: any) => item.content || []).filter((item: any) => item.type === 'output_text').map((item: any) => item.text).join('\n').trim();
    if (!answer) return new Response(JSON.stringify({ error: 'No answer was returned.' }), { status: 502, headers: cors });
    return new Response(JSON.stringify({ answer }), { status: 200, headers: cors });
  } catch (_e) { return new Response(JSON.stringify({ error: 'Invalid request or temporary server error.' }), { status: 400, headers: cors }); }
});
