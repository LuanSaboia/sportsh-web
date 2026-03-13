// src/pages/Ranking.tsx
import { useEffect, useState, useMemo } from 'react';
import supabase from '../lib/supabase';

export const Ranking = () => {
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'atletas' | 'missoes'>('atletas');

  useEffect(() => {
    fetchRanking();
  }, []);

  async function fetchRanking() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, mission, level, total_points')
        .order('total_points', { ascending: false });

      if (!error) setAtletas(data || []);
    } finally {
      setLoading(false);
    }
  }

  // Lógica para agrupar pontos por missão
  const rankingMissoes = useMemo(() => {
    const missoesMap = atletas.reduce((acc: any, curr: any) => {
      const nome = curr.mission || 'Arena Geral';
      acc[nome] = (acc[nome] || 0) + (curr.total_points || 0);
      return acc;
    }, {});

    return Object.entries(missoesMap)
      .map(([name, points]) => ({ name, points: points as number }))
      .sort((a, b) => b.points - a.points);
  }, [atletas]);

  return (
    <div className="py-10 animate-fadeIn min-h-screen">
      <header className="mb-12 border-l-4 border-sh-neon pl-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            Ranking <span className="text-sh-neon">Magnificat</span>
          </h1>
          <p className="text-sh-green font-bold uppercase tracking-widest text-[10px] mt-2 italic">
            "A glória de Deus é o homem vivente"
          </p>
        </div>

        {/* CONTROLES DE ABA */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('atletas')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'atletas' ? 'bg-sh-neon text-sh-black' : 'text-gray-500 hover:text-white'}`}
          >
            Atletas
          </button>
          <button 
            onClick={() => setActiveTab('missoes')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'missoes' ? 'bg-sh-neon text-sh-black' : 'text-gray-500 hover:text-white'}`}
          >
            Missões
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20 text-sh-neon font-black uppercase text-[10px] animate-pulse italic">
          Sincronizando Placar de Elite...
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sh-green/10 text-sh-neon uppercase text-[10px] tracking-[0.2em] border-b border-white/5">
                  <th className="p-6">Posição</th>
                  <th className="p-6">{activeTab === 'atletas' ? 'Atleta' : 'Missão / Cidade'}</th>
                  {activeTab === 'atletas' && <th className="p-6 hidden md:table-cell">Patente</th>}
                  <th className="p-6 text-right">Pontos Totais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(activeTab === 'atletas' ? atletas.slice(0, 20) : rankingMissoes).map((item, index) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-all group">
                    <td className="p-6">
                      <span className={`text-2xl font-black italic ${index < 3 ? 'text-sh-neon' : 'text-gray-600'}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-bold uppercase text-white group-hover:text-sh-neon transition-colors">
                        {activeTab === 'atletas' ? item.full_name : item.name}
                      </p>
                      {activeTab === 'atletas' && (
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic">{item.mission}</p>
                      )}
                    </td>
                    {activeTab === 'atletas' && (
                      <td className="p-6 hidden md:table-cell">
                         <span className={`text-[8px] px-2 py-0.5 rounded uppercase font-black ${
                          item.level === 'Lenda' ? 'bg-sh-neon text-sh-black' : 
                          item.level === 'Capitão' ? 'bg-sh-green text-sh-black' : 
                          'bg-white/10 text-gray-400'
                        }`}>
                          {item.level || 'Reserva'}
                        </span>
                      </td>
                    )}
                    <td className="p-6 text-right">
                      <span className="font-black text-sh-neon text-2xl tracking-tighter">
                        {item.points?.toLocaleString() || item.total_points?.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};