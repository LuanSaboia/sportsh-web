import { TimerTrigger } from '../features/intercessao/TimerTrigger';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="flex flex-col gap-24 pb-20">
      
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden rounded-[3rem] bg-gradient-to-b from-sh-green/20 to-sh-black border border-sh-green/30">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
        
        <div className="bg-sh-neon text-sh-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-bounce">
          Temporada 2026 Ativa
        </div>

        <h1 className="text-7xl md:text-9xl font-black italic text-white uppercase tracking-tighter leading-[0.85] mb-4">
          Sport<span className="text-sh-neon">SH</span>
        </h1>
        <p className="text-sh-green font-bold tracking-[0.4em] uppercase text-xs md:text-sm mb-12 max-w-xl">
          A disciplina do corpo a serviço da alma. <br/> A visão cristã do desporto.
        </p>
        
        <div className="max-w-md w-full mb-8">
          <TimerTrigger />
        </div>

        <Link to="/vestiario" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-sh-neon transition-colors">
          ↓ Role para conhecer a missão
        </Link>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
        <div className="space-y-6">
          <h2 className="text-5xl font-black italic uppercase leading-none">
            Mais que <span className="text-sh-neon">Atletas</span>,<br/> somos <span className="text-white">Santos</span>.
          </h2>
          <p className="text-gray-400 leading-relaxed font-medium">
            O SPORTSH é o caminho de evangelização da Comunidade Católica Shalom no mundo do desporto. 
            Entendemos que o suor do treino é uma forma de oferta e a disciplina esportiva um espelho 
            da vida espiritual. Não corremos sem alvo; corremos para a eternidade.
          </p>
          <div className="flex gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="block text-sh-neon font-black text-2xl tracking-tighter">01</span>
              <span className="text-[10px] font-bold uppercase text-gray-500">Formação Integral</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="block text-sh-green font-black text-2xl tracking-tighter">02</span>
              <span className="text-[10px] font-bold uppercase text-gray-500">Vida de Oração</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-sh-green/20 group">
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            alt="Treino SPORTSH"
          />
          <div className="absolute inset-0 bg-sh-neon/10 mix-blend-multiply"></div>
        </div>
      </section>

      <section className="bg-sh-green/10 border-y border-sh-green/20 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="text-sh-green font-black uppercase tracking-[0.3em] text-[10px]">O que a Igreja diz</span>
          <blockquote className="text-2xl md:text-4xl font-black italic uppercase tracking-tight text-white leading-tight">
            "O esporte é um ginásio de disciplina, um caminho de educação para os valores humanos e espirituais."
          </blockquote>
          <cite className="block text-sh-neon font-bold not-italic uppercase text-xs tracking-widest">
            — Papa Francisco
          </cite>
        </div>
      </section>

      <section className="px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black italic uppercase leading-none">Suor dos <span className="text-sh-neon">Santos</span></h2>
            <p className="text-sh-green font-bold uppercase text-[10px] tracking-widest mt-2">Testemunhos da Arena</p>
          </div>
          <Link to="/suor" className="text-[10px] font-black border-b-2 border-sh-neon pb-1 uppercase hover:tracking-widest transition-all">Ver Galeria</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-sh-neon/30 transition-all">
            <p className="italic text-gray-300 mb-6 leading-relaxed">"O esporte é um caminho que Deus me dá pra minha vocação e pra evangelização neste meio que precisa tanto de Deus."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sh-neon rounded-full"></div>
              <p className="font-bold text-white text-xs uppercase tracking-tighter">João Pedro | <span className="text-sh-green">Guarulhos</span></p>
            </div>
          </div>
          
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-sh-neon/30 transition-all">
            <p className="italic text-gray-300 mb-6 leading-relaxed">"O vôlei teve um papel fundamental na minha formação, ajudando a cultivar disciplina dentro da comunidade."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sh-green rounded-full"></div>
              <p className="font-bold text-white text-xs uppercase tracking-tighter">Rafaela | <span className="text-sh-neon">Brasília</span></p>
            </div>
          </div>

          <div className="bg-sh-neon p-8 rounded-3xl flex flex-col justify-center items-center text-center group cursor-pointer">
             <span className="text-sh-black font-black uppercase italic text-xl mb-2 group-hover:scale-110 transition-transform">Conte sua história</span>
             <p className="text-sh-black/60 font-bold uppercase text-[10px]">Envie seu testemunho para o Vestiário</p>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="bg-white/5 border border-white/10 p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-black italic uppercase">Área do <span className="text-sh-green">Coordenador</span></h3>
            <p className="text-gray-500 text-sm font-medium mt-2">Acesse materiais, manuais e ferramentas de gestão para sua missão.</p>
          </div>
          <Link to="/documentos" className="bg-white text-sh-black px-8 py-4 rounded-2xl font-black uppercase italic hover:bg-sh-neon transition-colors whitespace-nowrap">
            Acessar Materiais
          </Link>
        </div>
      </section>

    </div>
  );
};