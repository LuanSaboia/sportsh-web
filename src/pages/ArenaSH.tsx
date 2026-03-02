// src/pages/ArenaSH.tsx
import { useState } from 'react';

const missoes = [
  { id: 1, cidade: "Fortaleza", local: "Centro de Evangelização Shalom", modalidades: ["Vôlei", "Futsal", "Beach Tênis"], responsavel: "Felipe (Regional NE)" },
  { id: 2, cidade: "São Paulo", local: "Parque do Ibirapuera / Missão SP", modalidades: ["Corrida", "Skate", "Basquete"], responsavel: "Juliana (Regional SE)" },
  { id: 3, cidade: "Brasília", local: "Eixão / Missão BSB", modalidades: ["Bike", "Vôlei de Praia"], responsavel: "Ricardo (Regional CO)" },
  { id: 4, cidade: "Rio de Janeiro", local: "Praia de Copacabana", modalidades: ["Surf", "Vôlei", "Funcional"], responsavel: "Thiago (Regional SE)" },
];

const filtros = ["Todos", "Vôlei", "Futsal", "Skate", "Corrida", "Beach Tênis", "Bike"];

export const ArenaSH = () => {
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  const missoesFiltradas = missoes.filter(m => 
    (filtroAtivo === "Todos" || m.modalidades.includes(filtroAtivo)) &&
    (m.cidade.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="py-10 animate-fadeIn">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
          Arena <span className="text-sh-neon">SH</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-sm mt-2">
          Encontre o SPORTSH em qualquer missão.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: BUSCA E LISTA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar missão ou cidade..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-sh-neon outline-none transition-all"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filtros.map(f => (
              <button 
                key={f}
                onClick={() => setFiltroAtivo(f)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${
                  filtroAtivo === f ? 'bg-sh-neon text-sh-black' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-sh-green'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {missoesFiltradas.map(m => (
              <div key={m.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-sh-green/50 transition-all cursor-pointer group">
                <h4 className="text-sh-neon font-black italic uppercase text-lg group-hover:tracking-wider transition-all">{m.cidade}</h4>
                <p className="text-gray-400 text-xs mb-3">{m.local}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {m.modalidades.map(mod => (
                    <span key={mod} className="text-[8px] bg-sh-green/20 text-sh-green px-2 py-0.5 rounded font-bold uppercase">{mod}</span>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                   <span className="text-[10px] text-gray-500 uppercase font-bold">👤 {m.responsavel}</span>
                   <button className="text-sh-neon text-[10px] font-black uppercase underline decoration-sh-green underline-offset-4">Falar no Whats</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA: O "MAPA" (STYLIZED MOCKUP) */}
        <div className="lg:col-span-2 relative min-h-[400px] bg-sh-black rounded-3xl border border-sh-green/30 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          {/* Efeito de Scanline/Radar */}
          <div className="absolute inset-0 bg-gradient-to-b from-sh-green/5 to-transparent pointer-events-none"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Aqui simulamos um mapa do Brasil simplificado ou uma grade tecnológica */}
            <div className="relative w-full h-full flex items-center justify-center opacity-40">
               <div className="absolute w-[80%] h-[80%] border border-sh-green/10 rounded-full animate-ping"></div>
               <div className="absolute w-[60%] h-[60%] border border-sh-green/5 rounded-full"></div>
               <p className="text-sh-green/20 font-black text-8xl italic uppercase select-none">MAPA SH</p>
            </div>

            {/* PONTOS NO MAPA (Pins dinâmicos baseados na lista) */}
            {missoesFiltradas.map((m, i) => (
              <div 
                key={m.id} 
                className="absolute animate-bounce"
                style={{ 
                  top: `${30 + (i * 15)}%`, 
                  left: `${20 + (i * 20)}%` 
                }}
              >
                <div className="w-4 h-4 bg-sh-neon rounded-full shadow-[0_0_15px_#d7f205]"></div>
                <div className="absolute top-6 -left-4 bg-sh-neon text-sh-black text-[10px] font-black px-2 py-1 rounded whitespace-nowrap uppercase italic">
                  {m.cidade}
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-sh-black/80 backdrop-blur-md border border-sh-green/20 rounded-2xl">
            <p className="text-[10px] text-sh-green font-bold uppercase tracking-widest leading-none">Status da Rede</p>
            <p className="text-white font-black italic text-xl uppercase tracking-tighter">{missoesFiltradas.length} Arenas Ativas</p>
          </div>
        </div>

      </div>
    </div>
  );
};