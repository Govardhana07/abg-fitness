(() => {
  const message = (text) => { const el = document.getElementById('cloudMessage'); if (el) el.textContent = text; };
  let client = null;
  const configReady = () => Boolean(window.ABG_SUPABASE_URL && window.ABG_SUPABASE_ANON_KEY && window.supabase?.createClient);
  const getClient = () => {
    if (!configReady()) throw new Error('Cloud setup incomplete. Add your Supabase project URL and anon key in supabase-config.js, then apply supabase/schema.sql.');
    if (!client) client = window.supabase.createClient(window.ABG_SUPABASE_URL, window.ABG_SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    return client;
  };
  const credentials = () => {
    const email = document.getElementById('cloudEmail').value.trim();
    const password = document.getElementById('cloudPassword').value;
    if (!email || !email.includes('@')) throw new Error('Enter a valid email address.');
    if (password.length < 8) throw new Error('Password must contain at least 8 characters.');
    return { email, password };
  };
  const run = async (fn) => { try { message('Working…'); await fn(); } catch (e) { message(e?.message || 'Request failed. Check your connection and Supabase configuration.'); } };
  window.abgCloudSignUp = () => run(async () => { const { email, password } = credentials(); const { error } = await getClient().auth.signUp({ email, password }); if (error) throw error; message('Sign-up requested. Check your email if confirmation is enabled in Supabase.'); });
  window.abgCloudSignIn = () => run(async () => { const { email, password } = credentials(); const { error } = await getClient().auth.signInWithPassword({ email, password }); if (error) throw error; message('Signed in. You can now upload or restore your cloud data.'); });
  window.abgCloudResetPassword = () => run(async () => { const email = document.getElementById('cloudEmail').value.trim(); if (!email.includes('@')) throw new Error('Enter your email first.'); const { error } = await getClient().auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }); if (error) throw error; message('If the email is registered, password-reset instructions will be sent.'); });
  window.abgCloudSignOut = () => run(async () => { const { error } = await getClient().auth.signOut(); if (error) throw error; message('Signed out. Local data on this device has not been deleted.'); });
  window.abgCloudSave = () => run(async () => { const c = getClient(); const { data: { user }, error: authError } = await c.auth.getUser(); if (authError) throw authError; if (!user) throw new Error('Sign in before uploading.'); if (typeof state === 'undefined') throw new Error('App data is not ready yet.'); const payload = { user_id: user.id, app_state: state, updated_at: new Date().toISOString() }; const { error } = await c.from('app_state').upsert(payload, { onConflict: 'user_id' }); if (error) throw error; message('Cloud backup saved. Your local data is unchanged.'); });
  window.abgCloudLoad = () => run(async () => { const c = getClient(); const { data: { user }, error: authError } = await c.auth.getUser(); if (authError) throw authError; if (!user) throw new Error('Sign in before restoring.'); const { data, error } = await c.from('app_state').select('app_state').eq('user_id', user.id).maybeSingle(); if (error) throw error; if (!data?.app_state?.profile || !data.app_state.days || !Array.isArray(data.app_state.checkins) || !Array.isArray(data.app_state.workouts)) throw new Error('No valid cloud backup found for this account.'); if (!confirm('Restore cloud backup and replace current local data? Export a local backup first if needed.')) { message('Restore cancelled.'); return; } state = data.app_state; save(); location.reload(); });
  window.abgAskAi = async (question) => {
    if (!configReady()) return null;
    const c = getClient();
    const { data: { session }, error } = await c.auth.getSession();
    if (error) throw error;
    if (!session) return null;
    const { data, error: fnError } = await c.functions.invoke('abg-coach', { body: { question } });
    if (fnError) throw new Error('AI coach unavailable. Check that the Edge Function and AI_API_KEY are configured.');
    if (!data?.answer) throw new Error(data?.error || 'AI coach did not return an answer.');
    return data.answer;
  };
  if (!configReady()) message('Cloud sync setup required: add Supabase URL/key and run the supplied SQL schema. Local features still work.');
})();
