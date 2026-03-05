import { useEffect, useState, useMemo } from 'react';
import supabase from '../lib/supabase';

export const ArenaSH = () => {
  const [arenas, setArenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetchArenas();
  }, []);

  async function fetchArenas() {
    try {
      const { data, error } = await supabase
        .from('arenas')
        .select('*')
        .order('city');
      if (!error) setArenas(data || []);
    } finally {
      setLoading(false);
    }
  }

  const arenasFiltradas = useMemo(() => {
    return arenas.filter(a => 
      a.city?.toLowerCase().includes(busca.toLowerCase()) || 
      a.location_name?.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, arenas]);

  return (
    <div className="py-10 animate-fadeIn min-h-screen">
      <header className="mb-16 space-y-8">
        <div className="border-l-4 border-sh-neon pl-6">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Nossa <span className="text-sh-neon">Arena</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 italic">
            Centros de Treinamento e Pontos de Encontro Oficiais
          </p>
        </div>
        
        <div className="max-w-xl relative">
          <input 
            type="text" 
            placeholder="Filtrar por Cidade ou Missão..." 
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-sh-green transition-all italic text-sm"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4 text-sh-neon font-black uppercase text-[10px] animate-pulse">
           Localizando Arenas...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {arenasFiltradas.map((arena) => (
            <div 
              key={arena.id}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-sh-green/50 transition-all duration-500 flex flex-col"
            >
              <div className="h-40 bg-sh-black relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-sh-black to-transparent z-10"></div>
                <span className="text-9xl font-black italic text-white/5 absolute -right-4 -bottom-8 select-none">SH</span>
                <span className="bg-sh-neon text-sh-black px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest z-20 absolute bottom-6 left-8">
                  {arena.city}
                </span>
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase text-white leading-tight group-hover:text-sh-neon transition-colors">
                      {arena.location_name}
                    </h3>
                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-1">
                      📍 {arena.address || 'Local a definir'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {arena.activities?.map((act: string, idx: number) => (
                      <span key={idx} className="bg-sh-green/10 border border-sh-green/20 px-3 py-1 rounded-lg text-[8px] font-black uppercase text-sh-green tracking-tighter">
                        ⚡ {act}
                      </span>
                    ))}
                  </div>

                  {arena.schedule && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] text-gray-500 font-black uppercase mb-1 tracking-widest">Horário de Treino</p>
                      <p className="text-[10px] text-white font-bold uppercase italic">{arena.schedule}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase text-gray-600 italic">Missão {arena.mission || arena.city}</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(arena.location_name + ' ' + (arena.address || arena.city))}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-white text-sh-black px-6 py-3 rounded-xl font-black uppercase italic text-[9px] hover:bg-sh-neon transition-all hover:scale-110 active:scale-95 shadow-xl"
                  >
                    Abrir GPS →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};