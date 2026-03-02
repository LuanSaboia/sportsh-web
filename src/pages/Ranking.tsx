// src/pages/Ranking.tsx

const rankingData = [
  { id: 1, nome: "Lucas Silva", missao: "Fortaleza", pontos: 1250, nivel: "Capitão" },
  { id: 2, nome: "Ana Clara", missao: "Natal", pontos: 1100, nivel: "Titular" },
  { id: 3, nome: "Mateus Lima", missao: "São Paulo", pontos: 950, nivel: "Titular" },
  { id: 4, nome: "Bia Santos", missao: "Brasília", pontos: 800, nivel: "Reserva" },
  { id: 5, nome: "João Pedro", missao: "Guarulhos", pontos: 750, nivel: "Reserva" },
];

export const Ranking = () => {
  return (
    <div className="py-10 animate-fadeIn">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
          Ranking <span className="text-sh-neon">Magnificat</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-sm mt-2">
          "A glória de Deus é o homem vivente"
        </p>
      </div>

      {/* CRITÉRIOS RÁPIDOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <span className="block text-sh-neon font-black text-xl">+50</span>
          <span className="text-[10px] uppercase font-bold text-gray-400">Treino Presencial</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <span className="block text-sh-neon font-black text-xl">+100</span>
          <span className="text-[10px] uppercase font-bold text-gray-400">Amigo Novo</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <span className="block text-sh-neon font-black text-xl">+30</span>
          <span className="text-[10px] uppercase font-bold text-gray-400">Oração/Intercessão</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <span className="block text-sh-neon font-black text-xl">+20</span>
          <span className="text-[10px] uppercase font-bold text-gray-400">Pastoreio</span>
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sh-green/20 text-sh-neon uppercase text-[10px] tracking-[0.2em]">
              <th className="p-6">Posição</th>
              <th className="p-6">Atleta</th>
              <th className="p-6">Missão</th>
              <th className="p-6">Nível</th>
              <th className="p-6 text-right">Pontos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rankingData.map((atleta, index) => (
              <tr key={atleta.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-6 font-black italic text-xl">
                  {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : `#${index + 1}`}
                </td>
                <td className="p-6 font-bold uppercase tracking-tight">{atleta.nome}</td>
                <td className="p-6 text-gray-400 text-sm">{atleta.missao}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    atleta.nivel === 'Capitão' ? 'bg-sh-neon text-sh-black' : 'border border-sh-green text-sh-green'
                  }`}>
                    {atleta.nivel}
                  </span>
                </td>
                <td className="p-6 text-right font-black text-sh-neon text-xl group-hover:scale-110 transition-transform">
                  {atleta.pontos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="mt-8 text-center text-gray-500 text-xs italic">
        * Os pontos são atualizados semanalmente pelos coordenadores de cada missão.
      </p>
    </div>
  );
};