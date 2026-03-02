import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <main className="min-h-screen bg-sh-black text-white font-urban max-w-7xl mx-auto px-4">

        <nav className="flex justify-between items-center py-8 sticky top-0 bg-sh-black/80 backdrop-blur-md z-50 border-b border-sh-green/20">
          <div className="font-black italic text-2xl tracking-tighter">
            SPORT<span className="text-sh-neon">SH</span>
          </div>

          <div className="hidden md:flex gap-6 uppercase font-bold text-[10px] tracking-[0.15em]">
            <Link to="/" className="hover:text-sh-neon transition-colors">Arena</Link>
            <Link to="/ranking" className="hover:text-sh-neon transition-colors">Ranking</Link>
            <Link to="/suor-dos-santos" className="hover:text-sh-neon transition-colors">Suor dos Santos</Link>
            <Link to="/mapa" className="hover:text-sh-neon transition-colors">Arena SH</Link>
            <Link to="/playlist" className="hover:text-sh-neon transition-colors">Playlist de Fogo</Link>
            <Link to="/documentos" className="hover:text-sh-neon transition-colors">Materiais e Documentos</Link>
            {session ? (
              <Link to="/dashboard" className="text-sh-black bg-sh-neon px-4 py-1 rounded-full hover:scale-105 transition-transform">Dashboard</Link>
            ) : (
              <Link to="/vestiario" className="text-sh-black bg-sh-neon px-4 py-1 rounded-full hover:scale-105 transition-transform">Vestiário</Link>
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

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;