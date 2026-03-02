import { useState } from 'react';
import supabase from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Vestiario = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mission, setMission] = useState('Fortaleza');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              mission: mission,
            },
          },
        });
        if (error) throw error;
        alert('Verifique seu e-mail para confirmar o cadastro!');
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao processar sua entrada no vestiário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-sh-green/10">
          
          <div className="bg-sh-green/20 p-8 text-center border-b border-white/5">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              {isLogin ? 'Vestiário' : 'Novo Atleta'}
            </h1>
            <p className="text-sh-neon font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
              {isLogin ? 'Prepare-se para entrar em campo' : 'Faça sua filiação ao time'}
            </p>
          </div>

          <form className="p-8 space-y-5" onSubmit={handleAuth}>
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Nome do Atleta</label>
                <input 
                  type="text" 
                  required
                  placeholder="Seu nome completo" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-sh-black/50 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:border-sh-neon transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">E-mail</label>
              <input 
                type="email" 
                required
                placeholder="atleta@missao.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-sh-black/50 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:border-sh-neon transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Senha</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-sh-black/50 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:border-sh-neon transition-all"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">Missão / Cidade</label>
                <select 
                  className="w-full bg-sh-black/50 border border-white/10 rounded-xl py-4 px-5 text-white outline-none focus:border-sh-neon transition-all cursor-pointer"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                >
                  <option value="Fortaleza">Fortaleza</option>
                  <option value="São Paulo">São Paulo</option>
                  <option value="Brasília">Brasília</option>
                  <option value="Outra Missão">Outra Missão</option>
                </select>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-sh-neon text-sh-black font-black uppercase italic py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-sh-neon/20 mt-4 disabled:opacity-50"
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar em Campo ⚽' : 'Filiar-se ao SPORTSH'}
            </button>
          </form>

          <div className="p-6 bg-sh-black/30 text-center border-t border-white/5">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-gray-400 hover:text-sh-neon transition-colors uppercase tracking-widest"
            >
              {isLogin ? 'Ainda não tem conta? Crie aqui' : 'Já é do time? Faça login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};