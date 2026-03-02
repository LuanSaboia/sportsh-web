// src/pages/Home.tsx
import { TimerTrigger } from '../features/intercessao/TimerTrigger';

export const Home = () => {
  return (
    <div className="flex flex-col gap-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden rounded-3xl bg-gradient-to-b from-sh-green/20 to-sh-black border border-sh-green/30">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
        
        <h1 className="text-7xl md:text-9xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">
          Sport<span className="text-sh-neon">SH</span>
        </h1>
        <p className="text-sh-neon font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-8">
          A visão cristã do desporto
        </p>
        
        <div className="max-w-md w-full">
          <TimerTrigger />
        </div>
      </section>

      {/* ÁREA DE TESTEMUNHOS (Baseada no Manual) */}
      <section className="px-4">
        <h2 className="text-3xl font-black italic uppercase mb-8 border-l-4 border-sh-neon pl-4">
          Suor dos Santos <span className="text-sh-green text-sm block not-italic font-medium">O que a galera tá vivendo</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-sh-neon/50 transition-colors">
            <p className="italic text-gray-300 mb-4">"O esporte é um caminho que Deus me dá pra minha vocação e pra evangelização neste meio que precisa tanto de Deus."</p>
            <p className="font-bold text-sh-neon text-sm uppercase">João Pedro | Guarulhos</p>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-sh-neon/50 transition-colors">
            <p className="italic text-gray-300 mb-4">"O vôlei teve um papel fundamental na minha formação, ajudando a cultivar disciplina dentro da comunidade."</p>
            <p className="font-bold text-sh-neon text-sm uppercase">Rafaela | Brasília</p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-sh-neon/50 transition-colors flex items-center justify-center text-center">
             <button className="text-sh-green font-bold uppercase text-xs hover:underline">+ Ver mais testemunhos</button>
          </div>
        </div>
      </section>

    </div>
  );
};