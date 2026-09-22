import { FormEvent, ReactNode, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Loader2, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials' ? '邮箱或密码不正确' : signInError.message);
    }
    setSubmitting(false);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 px-6 text-white">
        <div className="max-w-sm rounded-3xl border border-amber-400/30 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl">
          <h1 className="text-lg font-black">尚未连接云端</h1>
          <p className="mt-2 text-sm text-white/65">请配置 VITE_SUPABASE_URL 与 VITE_SUPABASE_PUBLISHABLE_KEY 后重新部署。</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-slate-950 text-white"><Loader2 className="h-7 w-7 animate-spin" /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_top,#164e63_0%,#0f172a_48%,#020617_100%)] px-5 text-white">
        <form onSubmit={signIn} className="w-full max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-300"><ShieldCheck className="h-6 w-6" /></div>
            <div><h1 className="text-xl font-black">北欧同行空间</h1><p className="mt-0.5 text-xs text-white/55">登录后与旅伴同步行程、账单和票据</p></div>
          </div>
          <label htmlFor="trip-email" className="mb-1.5 block text-xs font-bold text-white/70">邮箱</label>
          <input id="trip-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-cyan-300" />
          <label htmlFor="trip-password" className="mb-1.5 block text-xs font-bold text-white/70">密码</label>
          <input id="trip-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-cyan-300" />
          {error && <p role="alert" className="mt-3 rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-200">{error}</p>}
          <button disabled={submitting} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-2.5 text-sm font-black text-slate-950 disabled:opacity-60">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} 登录共享行程
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {children}
      <button onClick={() => supabase.auth.signOut()} title={`退出 ${session.user.email || ''}`} className="fixed right-3 top-3 z-[200] flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-xl">
        <LogOut className="h-3 w-3" /> 退出
      </button>
    </div>
  );
}
