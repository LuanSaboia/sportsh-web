import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

export const Ranking = () => {
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  async function fetchRanking() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, mission, level, total_points')
      .order('total_points', { ascending: false })
      .limit(10); 

    if (!error) setAtletas(data);
    setLoading(false);
  }

  return (
    <div className="py-10 animate-fadeIn">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
          Ranking <span className="text-sh-neon text-glow">Magnificat</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-sm mt-2 italic">
          A glória de Deus é o homem vivente
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sh-neon font-black animate-pulse">PROCESSANDO PLACAR...</div>
      ) : (
        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sh-green/20 text-sh-neon uppercase text-[10px] tracking-[0.2em]">
                <th className="p-6">Posição</th>
                <th className="p-6">Atleta</th>
                <th className="p-6">Missão</th>
                <th className="p-6 text-right">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {atletas.map((atleta, index) => (
                <tr key={atleta.id} className="hover:bg-sh-neon/5 transition-all group">
                  <td className="p-6 font-black italic text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </td>
                  <td className="p-6">
                    <p className="font-bold uppercase tracking-tight text-white">{atleta.full_name}</p>
                    <span className="text-[9px] bg-sh-green/20 text-sh-green px-2 py-0.5 rounded uppercase font-black">
                      {atleta.level}
                    </span>
                  </td>
                  <td className="p-6 text-gray-400 text-sm uppercase font-medium">{atleta.mission}</td>
                  <td className="p-6 text-right font-black text-sh-neon text-2xl group-hover:scale-110 transition-transform">
                    {atleta.total_points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};