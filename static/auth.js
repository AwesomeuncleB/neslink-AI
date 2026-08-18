// Marginalia AI — Auth Module

// ─── Supabase Client ───────────────────────────────────────────────
let supabaseClient = null;

if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
  try {
    supabaseClient = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );
  } catch (e) {
    console.error('Supabase init error:', e);
  }
}

window.currentUser = null;

// ─── Session Init ──────────────────────────────────────────────────
async function initAuth() {
  if (!supabaseClient) return;
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    window.currentUser = session ? session.user : null;
    updateNavAuthUI(window.currentUser);
  } catch (e) {
    console.error('Session error:', e);
  }

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    window.currentUser = session ? session.user : null;
    updateNavAuthUI(window.currentUser);
  });
}

// ─── Nav Auth UI ───────────────────────────────────────────────────
function updateNavAuthUI(user) {
  const guestNav   = document.getElementById('auth-nav-guest');
  const userNav    = document.getElementById('auth-nav-user');
  const emailLabel = document.getElementById('auth-user-email');

  if (user) {
    if (guestNav)   guestNav.style.display  = 'none';
    if (userNav)    userNav.style.display   = 'inline-flex';
    if (emailLabel) emailLabel.textContent  = user.email;
  } else {
    if (guestNav) guestNav.style.display  = 'inline-flex';
    if (userNav)  userNav.style.display   = 'none';
  }
}

// ─── Auth Page Logic ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  // Elements
  const formLogin  = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');
  const errBox     = document.getElementById('auth-error');
  const okBox      = document.getElementById('auth-success');

  // ── Helpers ──────────────────────────────────────────────────────
  function clearNotices() {
    if (errBox) { errBox.hidden = true; errBox.textContent = ''; }
    if (okBox)  { okBox.hidden  = true; okBox.textContent  = ''; }
  }
  function showError(msg)   { clearNotices(); if (errBox) { errBox.textContent = msg; errBox.hidden = false; } }
  function showSuccess(msg) { clearNotices(); if (okBox)  { okBox.textContent  = msg; okBox.hidden  = false; } }

  // ── Sign In ───────────────────────────────────────────────────────
  formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearNotices();
    if (!supabaseClient) return showError('Auth client not ready.');

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn      = document.getElementById('login-submit-btn');

    btn.disabled = true;
    btn.textContent = 'Signing in…';

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        showSuccess('Signed in! Redirecting…');
        setTimeout(() => { window.location.href = '/app'; }, 700);
      }
    } catch (err) {
      showError(err.message || 'Sign in failed.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  });

  // ── Sign Up ───────────────────────────────────────────────────────
  formSignup?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearNotices();
    if (!supabaseClient) return showError('Auth client not ready.');

    const name     = document.getElementById('signup-name').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const btn      = document.getElementById('signup-submit-btn');

    btn.disabled = true;
    btn.textContent = 'Creating account…';

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;

      if (data.session) {
        // Email confirmation disabled — signed in immediately
        showSuccess('Account created! Redirecting…');
        setTimeout(() => { window.location.href = '/app'; }, 700);
      } else {
        // Email confirmation required
        showSuccess('Account created! Check your email to confirm your address, then sign in.');
        setTimeout(() => { window.location.href = '/login'; }, 3000);
      }
    } catch (err) {
      showError(err.message || 'Registration failed.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Create Account';
    }
  });

  // ── Sign Out (all pages) ──────────────────────────────────────────
  document.querySelectorAll('.btn-sign-out').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!supabaseClient) return;
      await supabaseClient.auth.signOut();
      window.currentUser = null;
      updateNavAuthUI(null);
      window.location.href = '/';
    });
  });
});
