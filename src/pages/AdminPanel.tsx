import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { registerActivity } from '../lib/activities';

export const AdminPanel = () => {
  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, mission, total_points')
      .ilike('full_name', `%${busca}%`)
      .limit(5);
    
    if (!error) setUsuarios(data || []);
    setLoading(false);
  };

  const adicionarPontosExtra = async (userId: string, pontos: number, motivo: string) => {
    const confirmacao = window.confirm(`Confirmar envio de ${pontos} pontos para este atleta?`);
    if (!confirmacao) return;

    try {
      const { error } = await supabase.rpc('handle_activity', {
        p_user_id: userId,
        p_type: 'evangelization',
        p_description: `PONTOS ADMIN: ${motivo}`,
        p_points: pontos
      });

      if (error) throw error;
      alert("Pontos creditados com sucesso!");
      buscarUsuarios();
    } catch (e) {
      alert("Erro ao processar pontos.");
    }
  };

  return (
    <div className="py-10 animate-fadeIn max-w-4xl mx-auto">
      <h1 className="text-4xl font-black italic uppercase mb-8 border-l-4 border-sh-green pl-4">
        Painel de <span className="text-sh-neon">Coordenação</span>
      </h1>

      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 mb-8">
        <p className="text-sh-green font-bold uppercase text-[10px] tracking-widest mb-4">Premiar Atleta</p>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Nome do Atleta..." 
            className="flex-1 bg-sh-black border border-white/10 rounded-xl px-4 text-white outline-none focus:border-sh-neon"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button 
            onClick={buscarUsuarios}
            className="bg-sh-neon text-sh-black px-6 py-3 rounded-xl font-black uppercase italic hover:scale-105 transition-all"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {usuarios.map(u => (
          <div key={u.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group">
            <div>
              <h4 className="font-black uppercase text-white">{u.full_name}</h4>
              <p className="text-gray-500 text-[10px] uppercase font-bold">{u.mission} | {u.total_points} PTS</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => adicionarPontosExtra(u.id, 50, "Participação em Evento")}
                className="bg-sh-green/20 text-sh-green px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-sh-green hover:text-sh-black transition-all"
              >
                +50 PTS
              </button>
              <button 
                onClick={() => adicionarPontosExtra(u.id, 100, "Destaque da Missão")}
                className="bg-sh-neon/20 text-sh-neon px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-sh-neon hover:text-sh-black transition-all"
              >
                +100 PTS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};