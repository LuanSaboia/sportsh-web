import { useEffect, useState, useMemo } from 'react';
import supabase from '../lib/supabase';

export const Ranking = () => {
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  async function fetchRanking() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, mission, level, total_points')
        .order('total_points', { ascending: false })
        .limit(20); 

      if (!error) setAtletas(data || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-10 animate-fadeIn min-h-screen">
      
      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
          Ranking <span className="text-sh-neon text-glow">Magnificat</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-[10px] mt-2 italic">
          "A glória de Deus é o homem vivente" — São Ireneu
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-sh-neon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sh-neon font-black uppercase text-[10px]">Processando Placar...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sh-green/10 text-sh-neon uppercase text-[10px] tracking-[0.2em] border-b border-white/5">
                  <th className="p-6">Posição</th>
                  <th className="p-6">Atleta</th>
                  <th className="p-6 hidden md:table-cell">Missão</th>
                  <th className="p-6 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {atletas.map((atleta, index) => (
                  <tr key={atleta.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <span className={`text-2xl font-black italic ${index < 3 ? 'scale-125' : 'text-gray-600'}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <p className="font-bold uppercase tracking-tight text-white group-hover:text-sh-neon transition-colors">
                          {atleta.full_name}
                        </p>
                        <span className={`w-fit text-[8px] px-2 py-0.5 rounded uppercase font-black mt-1 ${
                          atleta.level === 'Lenda' ? 'bg-sh-neon text-sh-black' : 
                          atleta.level === 'Capitão' ? 'bg-sh-green text-sh-black' : 
                          'bg-white/10 text-gray-400'
                        }`}>
                          {atleta.level || 'Reserva'}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 hidden md:table-cell">
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">
                        {atleta.mission}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <span className="font-black text-sh-neon text-2xl tracking-tighter">
                        {atleta.total_points.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white/5 border border-white/10 rounded-[2rem]">
            {[
              { n: 'Reserva', p: '0+', c: 'text-gray-500' },
              { n: 'Titular', p: '1.000+', c: 'text-white' },
              { n: 'Capitão', p: '3.500+', c: 'text-sh-green' },
              { n: 'Lenda', p: '7.000+', c: 'text-sh-neon' },
            ].map(lvl => (
              <div key={lvl.n} className="text-center md:text-left">
                <p className={`font-black uppercase italic text-[10px] ${lvl.c}`}>{lvl.n}</p>
                <p className="text-[9px] text-gray-600 font-bold uppercase">{lvl.p} PTS</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};