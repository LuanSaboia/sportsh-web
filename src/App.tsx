import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Ranking } from './pages/Ranking';
import { SuorDosSantos } from './pages/SuorDosSantos';
import { ArenaSH } from './pages/ArenaSH';
import { PlaylistsDeFogo } from './pages/Playlist';
import { CentralDocumentos } from './pages/CentralDocumentos';
import { Vestiario } from './pages/Vestiario';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useEffect, useState } from 'react';
import supabase from './lib/supabase';
import { AdminPanel } from './pages/AdminPanel';
import { Footer } from './components/Footer';
import { NewsPage } from './pages/NewsPage';
import { NewsDetails } from './pages/NewsDetails';
import { Settings } from './pages/Settings';

function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <main className="min-h-screen bg-sh-black text-white font-urban max-w-7xl mx-auto px-4">

        <nav className="flex justify-between items-center py-8 sticky top-0 bg-sh-black/80 backdrop-blur-md z-[100] border-b border-sh-green/20 px-4 rounded-b-3xl">
          <Link to="/" className="font-black italic text-2xl tracking-tighter">
            <img
              src="/src/assets/sportsh.png"
              alt="logo-sportsh"
              className="h-8 md:h-8 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8 uppercase font-bold text-[10px] tracking-[0.15em]">
            <Link to="/" className="hover:text-sh-neon transition-colors">Arena</Link>
            <Link to="/ranking" className="hover:text-sh-neon transition-colors">Ranking</Link>
            <Link to="/suor-dos-santos" className="hover:text-sh-neon transition-colors">Suor dos Santos</Link>
            <Link to="/mapa" className="hover:text-sh-neon transition-colors">Arena SH</Link>
            <Link to="/playlist" className="hover:text-sh-neon transition-colors">Playlist</Link>
            <Link to="/documentos" className="hover:text-sh-neon transition-colors">Documentos</Link>
            {!session ? (
              <Link to="/vestiario" className="text-sh-black bg-sh-neon px-4 py-1 rounded-full hover:scale-105 transition-transform">Vestiário</Link>)
              : <></>
            }

            {session && (
              <div
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >

                <button
                  className="flex items-center gap-3 bg-white/5 border border-white/10 p-1 pr-4 rounded-full hover:bg-white/10 transition-all cursor-default"
                >
                  <div className="w-8 h-8 bg-sh-neon rounded-full overflow-hidden flex items-center justify-center text-sh-black font-black italic">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span>{profile?.full_name?.charAt(0) || 'A'}</span>
                    )}
                  </div>
                  <span className="text-[9px] tracking-widest">
                    {profile?.full_name?.split(' ')[0] || 'Atleta'}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 pt-2 w-56 z-20 animate-slideIn">
                    <div className="bg-sh-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                      <div className="p-4 border-b border-white/5 bg-white/5">
                        <p className="text-sh-neon font-black italic text-xs uppercase truncate">
                          {profile?.full_name}
                        </p>
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                          {profile?.mission || 'Missão Shalom'}
                        </p>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase hover:bg-sh-neon hover:text-sh-black rounded-xl transition-all"
                        >
                          <span>📊</span> Dashboard
                        </Link>

                        {profile?.role === 'coordenador' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase hover:bg-sh-green hover:text-sh-black rounded-xl transition-all"
                          >
                            <span>🛡️</span> Painel Admin
                          </Link>
                        )}

                        <Link
                          to="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase hover:bg-sh-neon hover:text-sh-black rounded-xl transition-all"
                        >
                          <span>⚙️</span> Configurações
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        >
                          <span>🚪</span> Sair da Arena
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/suor-dos-santos" element={<SuorDosSantos />} />
          <Route path="/mapa" element={<ArenaSH />} />
          <Route path="/playlist" element={<PlaylistsDeFogo />} />
          <Route path="/documentos" element={<CentralDocumentos />} />
          <Route path="/vestiario" element={<Vestiario />} />
          <Route path="/noticias" element={<NewsPage />} />
          <Route path="/noticias/:id" element={<NewsDetails />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              profile?.role === 'coordenador' ? <AdminPanel /> : <Navigate to="/" />
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}

export default App;